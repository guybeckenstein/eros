import { QueryClient, queryOptions } from '@tanstack/react-query';

import {
  CHAT_DAYS_TO_RESPOND,
  DATE_OPTIONS,
} from '@/shared/configurations/configuration';
import { CandidateJobDetails } from '@/shared/types/candidates';
import { Experience } from '@/shared/types/general';
import { DeleteJob, UpdateJob } from '@/shared/types/jobs';
import { SpecificJobFlattened } from '@/shared/types/recruiter';
import { daysBetweenDates } from '@/utils/helpers';
import { supabase } from '@/utils/supabase';

const queryClient = new QueryClient();

async function getSpecificChat(
  jobId: number,
  candidateId: number,
  isArchived = false,
) {
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
            Number(CHAT_DAYS_TO_RESPOND) * 24 * 60 * 60 * 1000,
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
      DATE_OPTIONS,
    ),
    stages: (jobRecord.job_interview_stages as any[]).reduce(
      (sum, x) => sum + (x?.count ?? 0),
      0,
    ),
    title: (jobRecord.job_titles_ref as any).title,
    seekers: candidates || [], // This is your flattened array
  } as unknown as SpecificJobFlattened;
}

export const chatDetailQueryOptions = (
  jobId: number,
  candidateId: number,
  listQueryKey: any[],
) =>
  queryOptions({
    queryKey: ['chats', 'detail', jobId, candidateId],
    queryFn: async () => await getSpecificChat(jobId, candidateId),
    // This is the magic part:
    initialData: () => {
      // 1. Get the list from the cache using the dynamic key (text, sort, etc.)
      const allChats = queryClient.getQueryData<any[]>(listQueryKey);

      // 2. Find the job in that list
      const chatFromList = allChats?.find(
        (c) => c.jobId === jobId && c.candidateId === candidateId,
      );

      // 3. Map the list item to the "SpecificJobFlattened" shape if they differ
      if (chatFromList) {
        return {
          jobId: chatFromList.jobId,
          dateUploaded: chatFromList.dateUploaded,
          title: chatFromList.title,
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
