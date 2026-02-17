import { QueryClient, queryOptions } from '@tanstack/react-query';

import { CandidateJobDetails } from '@/shared/types/candidates';
import { Experience } from '@/shared/types/general';
import { DeleteJob, JobSearch, UpdateJob } from '@/shared/types/jobs';
import {
  RecruiterJobItem,
  SpecificJobFlattened,
} from '@/shared/types/recruiter';
import { supabase } from '@/utils/supabase';

const queryClient = new QueryClient();

async function getJobs(search: JobSearch, isArchived: boolean = false) {
  const { text, sort } = search;
  const query = supabase
    .from('jobs')
    .select(
      `
          job_id, 
          date_uploaded, 
          is_active, 
          job_titles_ref!inner (title),
          job_seeker_status(count)
      `,
    )
    .eq('is_archived', isArchived);

  if (text) {
    query.ilike('job_titles_ref.title', `%${text}%`);
  }

  if (sort === 'Name') {
    query.order('title', {
      referencedTable: 'job_titles_ref',
      ascending: true,
    });
  } else if (sort === 'Status') {
    query.order('is_active', { ascending: false });
  } else {
    query.order('date_uploaded', { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return data as unknown as RecruiterJobItem[];
}

async function getSpecificJob(jobId: number, isArchived = false) {
  const { data, error } = await supabase
    .from('jobs')
    .select(
      `
        job_id, 
        date_uploaded, 
        job_titles_ref!inner (title),
        recruiter_seeker_swipes!inner (
          seekers!inner (
            seeker_id,
            users!inner (first_name, last_name, profile_pic_url),
            job_titles_ref!inner (
              title,
              job_types_ref!inner (type)
            ),
            seeker_experience_jobs!inner (
              start_month,
              start_year,
              end_month,
              end_year,
              is_currently_working,
              job_description
            ),
            cities_ref!inner (
              name, 
              countries_ref!inner (common_name)
            ),
            linkedin_link,
            website_link
          )
        )
      `,
    )
    .eq('job_id', jobId)
    .eq('is_archived', isArchived)
    .eq('is_active', true);

  if (error) {
    throw error;
  } else if (!data || data.length === 0) {
    console.error('No job found with ID:', jobId);
    throw new Error(`getSpecificJob: No record found for ID '${jobId}'`);
  }

  const jobRecord = data[0];
  const candidates: CandidateJobDetails[] =
    jobRecord.recruiter_seeker_swipes.map((swipe: any) => {
      const seeker = swipe.seekers;
      const user = seeker.users;
      const jobTitleRef = seeker.job_titles_ref;
      const cityRef = seeker.cities_ref;

      // Map the experience array
      let isCurrentlyHired = false;
      const experience: Experience[] = seeker.seeker_experience_jobs.map(
        (exp: any) => {
          isCurrentlyHired = isCurrentlyHired || exp.is_currently_working;
          return {
            startMonth: exp.start_month,
            startYear: exp.start_year,
            endMonth: exp.end_month,
            endYear: exp.end_year,
            isCurrentlyWorking: exp.is_currently_working,
          };
        },
      );

      // Calculate total years of experience
      const yearsOfExperience = experience.reduce((acc: number, job: any) => {
        const start = new Date(job.startYear, job.startMonth - 1);
        const end = job.isCurrentlyWorking
          ? new Date()
          : new Date(job.endYear, (job.endMonth || 1) - 1);

        // Calculate difference in years (including decimal for months)
        const diffInMonths =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        return acc + diffInMonths / 12;
      }, 0);

      return {
        id: seeker.seeker_id,
        fullName: `${user.first_name} ${user.last_name}`,
        profilePicUrl: user.profile_pic_url,
        jobTitle: jobTitleRef.title,
        jobType: jobTitleRef.job_types_ref.type,
        isCurrentlyHired: isCurrentlyHired,
        yearsOfExperience: yearsOfExperience,
        city: `${cityRef.name}, ${cityRef.countries_ref.common_name}`,
        matchScore: 0, // TODO: calculate match score between seekers and recruiters
        linkedinLink: seeker.linkedin_link,
        websiteLink: seeker.website_link,
        resumeId: 0, // TODO: add resume ID logic
        currentStage: 1,
        daysUntilRespond: 7,
      };
    });

  // If your component expects a single object with the job info + candidates:
  return {
    jobId: jobRecord.job_id,
    dateUploaded: jobRecord.date_uploaded,
    title: jobRecord.job_titles_ref.title,
    seekers: candidates || [], // This is your flattened array
  } as unknown as SpecificJobFlattened;
}

export function jobsQueryOptions(
  search: JobSearch,
  isArchived: boolean = false,
) {
  return queryOptions({
    queryKey: ['jobs', search, isArchived],
    queryFn: async () => await getJobs(search, isArchived),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export const jobDetailQueryOptions = (jobId: number, listQueryKey: any[]) =>
  queryOptions({
    queryKey: ['jobs', 'detail', jobId],
    queryFn: async () => await getSpecificJob(jobId),
    // This is the magic part:
    initialData: () => {
      // 1. Get the list from the cache using the dynamic key (text, sort, etc.)
      const allJobs = queryClient.getQueryData<any[]>(listQueryKey);

      // 2. Find the job in that list
      const jobFromList = allJobs?.find((j) => j.jobId === jobId);

      // 3. Map the list item to the "SpecificJobFlattened" shape if they differ
      if (jobFromList) {
        return {
          jobId: jobFromList.jobId,
          dateUploaded: jobFromList.dateUploaded,
          title: jobFromList.title,
        } as SpecificJobFlattened;
      }
      return undefined;
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(listQueryKey)?.dataUpdatedAt,
  });

export async function updateJob(model: UpdateJob) {
  const { jobId, isArchived } = model;
  const { error } = await supabase
    .from('jobs')
    .update({ is_archived: isArchived })
    .eq('job_id', jobId);

  if (error) {
    throw error;
  }
}

async function getIsArchived(jobId: number) {
  const { data, error } = await supabase
    .from('jobs')
    .select('is_archived')
    .eq('job_id', jobId);

  if (error) {
    throw error;
  } else if (data.length !== 1) {
    throw new Error(
      `There are '${data.length}' jobs with same job ID = ${jobId}`,
    );
  }

  return data[0].is_archived;
}

export async function deleteOrUpdateJob(model: DeleteJob) {
  const { jobId } = model;
  const isArchived = await getIsArchived(jobId);

  if (isArchived) {
    const { error } = await supabase.from('jobs').delete().eq('job_id', jobId);

    if (error) {
      throw error;
    }
  } else {
    await updateJob({ jobId: jobId, isArchived: true });
  }
}
