import { queryOptions } from '@tanstack/react-query';

import DiscoverCandidate, { FlattenCandidate } from '@/shared/types/candidates';
import { supabase } from '@/utils/supabase';

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
    years_of_experience,
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
    resume_id
  `,
    )
    .eq('cities_ref.countries_ref.is_active', true);

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
  const transformedData: FlattenCandidate[] = data.map((seeker: any) => ({
    id: seeker.seeker_id,
    fullName: `${seeker.users.first_name} ${seeker.users.last_name}`,
    profilePicUrl: `${seeker.users.profile_pic_url}`,
    jobTitle: seeker.job_titles_ref.title,
    yearsOfExperience: seeker.years_of_experience,
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
  }));

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
