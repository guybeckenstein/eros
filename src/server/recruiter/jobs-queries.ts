import { QueryClient, queryOptions } from '@tanstack/react-query';

import {
  DATE_OPTIONS_NO_TIME,
  RECRUITER_DAYS_TO_RESPOND,
} from '@/shared/configurations/configuration';
import { toRecruiterJobItem } from '@/shared/mapping/recruiter';
import { CandidateJobDetails } from '@/shared/types/candidates';
import { Experience } from '@/shared/types/general';
import { DeleteJob, JobSearch, UpdateJob } from '@/shared/types/jobs';
import { RawJobRow, SpecificJobFlattened } from '@/shared/types/recruiter';
import { daysBetweenDates } from '@/utils/helpers';
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
    query.order('job_titles_ref (title)', {
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

  const items = (data as unknown as RawJobRow[]).map(toRecruiterJobItem);
  return items;
}

async function getSpecificJob(jobId: number, isArchived = false) {
  const { data, error } = await supabase
    .from('jobs')
    .select(
      `
        job_id, 
        date_uploaded, 
        job_interview_stages!inner (count),
        job_titles_ref!inner (title),
        recruiter_seeker_swipes!inner (
          seekers!inner (
            seeker_id,
            users!inner (
              first_name, 
              last_name, 
              profile_pic_url,
              recruiter_seeker_chat_messages (
                message_text,
                message_date,
                is_recruiter,
                job_id
              )
            ),
            job_seeker_stage!inner (count),
            job_seeker_status!inner (is_frozen),
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
    .eq('is_active', true)
    .eq('recruiter_seeker_swipes.seekers.job_seeker_stage.job_id', jobId)
    .eq('recruiter_seeker_swipes.seekers.job_seeker_status.job_id', jobId)
    .eq('recruiter_seeker_swipes.seekers.job_seeker_status.is_active', true)
    .eq(
      'recruiter_seeker_swipes.seekers.users.recruiter_seeker_chat_messages.job_id',
      jobId,
    );

  if (error) {
    throw error;
  } else if (!data || data.length === 0) {
    console.error('No job found with ID:', jobId);
    throw new Error(`getSpecificJob: No record found for ID '${jobId}'`);
  }

  const jobRecord = data[0];
  const currentDate = new Date();
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

      const messages = user.recruiter_seeker_chat_messages || [];

      // 1. Sort messages to find the most recent one
      // We sort descending: index 0 is the newest
      const sortedMessages = [...messages].sort(
        (a, b) =>
          new Date(b.message_date).getTime() -
          new Date(a.message_date).getTime(),
      );

      const latestMessage = sortedMessages[0];
      const recentChatMessage = latestMessage
        ? latestMessage.message_text
        : 'No messages yet';

      // 2. Days until respond logic
      // Find the latest message sent BY THE CANDIDATE
      const isLastCandidateMessage = sortedMessages.find(
        (m) => m.is_recruiter === false,
      );

      const currentStage = (seeker.job_seeker_stage as any[]).reduce(
        (sum, x) => sum + (x?.count ?? 0),
        0,
      );

      let daysUntilRespond = Number.NaN;
      if (isLastCandidateMessage) {
        const sentDate = new Date(isLastCandidateMessage.message_date);
        // Add the response window to the sent date
        const deadlineDate = new Date(
          sentDate.getTime() +
            Number(RECRUITER_DAYS_TO_RESPOND) * 24 * 60 * 60 * 1000,
        );

        daysUntilRespond = daysBetweenDates(currentDate, deadlineDate);
      }

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
        recentChatMessage: recentChatMessage,
        totalChatMessages: messages.length,
        isMessagesUnread: !recentChatMessage.is_read,
        currentStage: currentStage,
        daysUntilRespond: daysUntilRespond,
        isFrozen: seeker.job_seeker_status[0].is_frozen,
      };
    });

  // If your component expects a single object with the job info + candidates:
  return {
    jobId: jobRecord.job_id,
    dateUploaded: new Date(jobRecord.date_uploaded).toLocaleDateString(
      'en-IL',
      DATE_OPTIONS_NO_TIME,
    ),
    stages: (jobRecord.job_interview_stages as any[]).reduce(
      (sum, x) => sum + (x?.count ?? 0),
      0,
    ),
    title: (jobRecord.job_titles_ref as any).title,
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
    staleTime: import.meta.env.STALE_TIME,
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

export async function removeCandidateFromJob(model: RemoveCandidate) {
  const { candidateIdList } = model;

  const { error } = await supabase
    .from('recruiter_seeker_swipes')
    .delete()
    .in('seeker_id', candidateIdList);

  if (error) {
    throw error;
  }
}

export type RemoveCandidate = {
  candidateIdList: number[];
};
