import { queryOptions } from '@tanstack/react-query';

import { FlattenCandidate } from '@/shared/types/candidates';
import { Experience, Language } from '@/shared/types/general';
import { supabase } from '@/utils/supabase';

const languageProficiencyMap: Record<Language['score'], Language['rank']> = {
  1: 'Elementary',
  2: 'Intermediate',
  3: 'Fluent',
  4: 'Native Speaker',
};

async function getDiscoverCandidates(
  filters: {
    jobTitle?: string;
    city?: string;
    workModel?: string;
  } = {},
) {
  const { jobTitle, city, workModel } = filters;

  const query = supabase
    .from('seekers')
    .select(
      `
    seeker_id,
    users!inner(
      first_name,
      last_name,
      profile_pic_url
    ),
    job_titles_ref!inner(
      title
    ),
    cities_ref!inner(
      name,
      countries_ref!inner(
        common_name,
        is_active
      )
    ),
    seeker_experience_jobs!inner(
      companies!inner(
        display_name,
        logo_url
      ),
      job_titles_ref!inner(
        title
      ),
      start_month,
      start_year,
      end_month,
      end_year,
      is_currently_working,
      job_description
    ),
    seeking_job_type,
    seeking_job_availability,
    seeking_job_model,
    expected_salary_min,
    expected_salary_max,
    currencies_ref!inner(
      name,
      symbol
    ),
    linkedin_link,
    website_link,
    resume_id,
    seeker_educational_stages!inner(
      start_year,
      start_month,
      end_year,
      end_month,
      institutions!inner(
        display_name,
        logo_url,
        countries_ref(is_active)
      ),
      degrees_ref!inner(academic_level),
      studies!inner(name),
      is_currently_studying,
      degree_description
    ),
    seeker_skills!inner(
      skills!inner(
        skill
      )
    ),
    seeker_spoken_languages!inner(
      languages_ref!inner(
        name
      ),
      knowledge_level
    )
  `,
    )
    .eq('cities_ref.countries_ref.is_active', true)
    .eq('seeker_educational_stages.institutions.countries_ref.is_active', true)
    .order('id', {
      referencedTable: 'seeker_educational_stages.degrees_ref',
      ascending: true,
    });

  if (jobTitle) {
    console.log('jobTitle true');
    query.ilike('job_titles_ref.name', `%${jobTitle}%`);
  }

  if (city) {
    console.log('city true');
    query.ilike('cities_ref.name', `%${city}%`);
  }

  if (workModel) {
    console.log('workModel true');
    query.eq('work_model', workModel);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  // Transform data to match DiscoverCandidate type
  const transformedData: FlattenCandidate[] = data.map((seeker: any) => {
    const experienceList: Experience[] = seeker.seeker_experience_jobs.map(
      (job: any) => ({
        companyName: job.companies.display_name,
        companyLogoUrl: job.companies.logo_url,
        jobTitle: job.job_titles_ref.title,
        jobDescription: job.job_description,
        startMonth: job.start_month,
        startYear: job.start_year,
        endMonth: job.end_month,
        endYear: job.end_year,
        period: `${job.start_month}/${job.start_year} - ${job.is_currently_studying ? 'Present' : `${job.end_month}/${job.end_year}`}`,
        isCurrentlyWorking: job.is_currently_working,
      }),
    );

    // Calculate sum of experience years
    const totalYears = seeker.seeker_experience_jobs.reduce(
      (acc: number, job: any) => {
        const start = new Date(job.start_year, job.start_month - 1);
        const end = job.is_currently_working
          ? new Date()
          : new Date(job.end_year, (job.end_month || 1) - 1);

        // Calculate difference in years (including decimal for months)
        const diffInMonths =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        return acc + diffInMonths / 12;
      },
      0,
    );

    return {
      id: seeker.seeker_id,
      fullName: `${seeker.users.first_name} ${seeker.users.last_name}`,
      profilePicUrl: seeker.users.profile_pic_url,
      jobTitle: seeker.job_titles_ref.title,
      experience: experienceList,
      yearsOfExperience: Math.round(totalYears * 10) / 10, // Round to 1 decimal place (e.g. 2.5 years)
      workAvailability: seeker.seeking_job_availability,
      workType: seeker.seeking_job_type,
      workModel: seeker.seeking_job_model,
      city: `${seeker.cities_ref.name}, ${seeker.cities_ref.countries_ref.common_name}`,
      expectedSalary: [seeker.expected_salary_min, seeker.expected_salary_max],
      currencyName: seeker.currencies_ref.name,
      currencySymbol: seeker.currencies_ref.symbol,
      linkedinLink: seeker.linkedin_link,
      websiteLink: seeker.website_link,
      resumeId: seeker.resume_id,
      currentStudies: seeker.seeker_educational_stages.map((stage: any) => ({
        institution: stage.institutions.display_name,
        institutionLogoUrl: stage.institutions.logo_url,
        level: stage.degrees_ref.academic_level,
        studyName: stage.studies.name,
        studyDescription: stage.degree_description,
        period: `${stage.start_month}/${stage.start_year} - ${stage.is_currently_studying ? 'Present' : `${stage.end_month}/${stage.end_year}`}`,
      })),
      skills: seeker.seeker_skills?.map((s: any) => s.skills.skill) ?? [],
      languages: seeker.seeker_spoken_languages?.map((l: any) => ({
        name: l.languages_ref.name,
        score: l.knowledge_level,
        rank: languageProficiencyMap[l.knowledge_level as 1 | 2 | 3 | 4],
      })),
    };
  });

  return transformedData;
}

export function discoverCandidatesQueryOptions(
  filters: { jobTitle?: string; city?: string; workModel?: string } = {},
) {
  return queryOptions({
    queryKey: ['seekers', filters],
    queryFn: async () => await getDiscoverCandidates(filters),
    staleTime: 1000, // * 60 * 5, // 5 minutes
  });
}

function recruiterJobTitlesQuery() {
  return supabase.from('job_titles_ref').select('id, title');
}

export function recruiterJobTitlesQueryOptions() {
  return queryOptions({
    queryKey: ['jobTitles'],
    queryFn: async () => {
      const { data, error } = await recruiterJobTitlesQuery();
      if (error) {
        throw error;
      }
      return data;
    },
    staleTime: Infinity,
  });
}
