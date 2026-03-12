import { QueryClient, queryOptions } from '@tanstack/react-query';

import { DATE_OPTIONS_WITH_TIME } from '@/shared/configurations/configuration';
import {
  getTimeDifference,
  getVerboseTimeDifference,
} from '@/shared/mapping/time';
import { CandidateInChat } from '@/shared/types/candidates';
import {
  Message,
  Note,
  SpecificChatFlattened,
  Stage,
} from '@/shared/types/general';
import { AlternativeJobs } from '@/shared/types/jobs';
import { supabase } from '@/utils/supabase';

const queryClient = new QueryClient();

export async function updateJobSeekerStatus({
  jobId,
  candidateId,
  isFrozen,
  isActive,
  daysToRespondDays,
  stageId,
  nextStageId,
}: {
  jobId: number;
  candidateId: number;
  isFrozen: boolean;
  isActive: boolean;
  daysToRespondDays?: number;
  stageId?: number;
  nextStageId?: number;
}) {
  let obj = {};
  if (daysToRespondDays) {
    if (daysToRespondDays >= 7) {
      daysToRespondDays = 14;
    } else {
      daysToRespondDays += 7;
    }
    const date = new Date();
    date.setDate(date.getDate() + daysToRespondDays);
    obj = {
      is_frozen: isFrozen,
      is_active: isActive,
      response_time_date: date.toISOString(),
    };
  } else {
    obj = {
      is_frozen: isFrozen,
      is_active: isActive,
    };
  }

  const { error: updateSeekerStatusError } = await supabase
    .from('job_seeker_status')
    .update(obj)
    .eq('job_id', jobId)
    .eq('seeker_id', candidateId);

  if (updateSeekerStatusError) {
    throw updateSeekerStatusError;
  }

  if (stageId) {
    const { error: updateSeekerStageError } = await supabase
      .from('job_seeker_stage')
      .update({ is_pass: isActive })
      .eq('job_id', jobId)
      .eq('seeker_id', candidateId)
      .eq('stage_id', stageId);

    if (updateSeekerStageError) {
      throw updateSeekerStageError;
    }
  }

  if (nextStageId) {
    const { error: insertError } = await supabase
      .from('job_seeker_stage')
      .insert({
        job_id: jobId,
        stage_id: nextStageId,
        seeker_id: candidateId,
        is_pass: null,
        note: null,
        date_created: new Date().toISOString(),
      })
      .eq('job_id', jobId)
      .eq('seeker_id', candidateId)
      .eq('stage_id', stageId);

    if (insertError) {
      throw insertError;
    }
  }
}

export async function deleteStage({ stageId }: { stageId: number }) {
  const { error } = await supabase
    .from('job_interview_stages')
    .delete()
    .eq('interview_stage_id', stageId);

  if (error) {
    throw error;
  }
}

export async function deleteNote({ noteId }: { noteId: number }) {
  const { error } = await supabase
    .from('recruiter_seeker_notes')
    .delete()
    .eq('note_id', noteId);

  if (error) {
    throw error;
  }
}

// TODO: insert with REAL user_id, not hardcoded
export async function addMessage({
  jobId,
  text,
}: {
  jobId: number;
  text: string;
}) {
  const { error } = await supabase
    .from('recruiter_seeker_chat_messages')
    .insert({
      sender_user_id: '28ccb868-809a-4b02-91f3-ee400da115a7',
      job_id: jobId,
      is_recruiter: true,
      message_text: text,
      message_date: new Date().toISOString(),
      is_read: false,
    });

  if (error) {
    throw error;
  }
}

export async function addNote({
  candidateId,
  text,
}: {
  candidateId: number;
  text: string;
}) {
  const { error } = await supabase.from('recruiter_seeker_notes').insert({
    recruiter_id: 1,
    seeker_id: candidateId,
    note_text: text,
    note_date: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}

async function getAlternativeJobs(jobId: number) {
  const { data, error } = await supabase
    .from('jobs')
    .select(
      `
        company_id,
        companies!inner (
          jobs!inner (
            job_id,
            is_archived,
            is_active,
            job_titles_ref!inner (title)
          )
        )
      `,
    )
    .eq('job_id', jobId)
    .eq('companies.jobs.is_archived', false)
    .eq('companies.jobs.is_active', true)
    .single();

  if (error) {
    throw error;
  }

  const companyJobs = data?.companies?.jobs || [];

  return companyJobs.map(
    (j) =>
      ({
        jobId: j.job_id,
        title: j.job_titles_ref?.title,
      }) as unknown as AlternativeJobs,
  );
}

export const fetchAlternativeRoles = (
  jobId: number,
  currQueryClient?: QueryClient,
) =>
  queryOptions({
    queryKey: ['alternative-jobs', jobId],
    queryFn: async () => await getAlternativeJobs(jobId),
    initialData: () => {
      if (!currQueryClient) {
        return undefined;
      }

      return currQueryClient
        .getQueryData<any[]>(['chat', 'list'])
        ?.find((j) => j.jobId === jobId);
    },
  });

async function getSpecificChat(jobId: number, candidateId: number) {
  const { data, error } = await supabase
    .from('jobs')
    .select(
      `
        job_id,
        date_uploaded,
        job_titles_ref!inner (title),
        job_interview_stages!inner (
          interview_stage_id,
          interview_type, 
          stage_index, 
          note, 
          interview_date, 
          recent_update,
          job_seeker_stage (seeker_id)
        ),
        recruiter_seeker_swipes!inner (
          seekers!inner (
            seeker_id,
            linkedin_link,
            website_link,
            users!inner (
              first_name, 
              last_name, 
              profile_pic_url,
              phone_number,
              email_address
            ),
            job_titles_ref!inner (title),
            recruiter_seeker_notes (
              note_id, 
              note_text, 
              note_date
            ),
            job_seeker_status!inner (is_frozen, is_active, response_time_date)
          )
        ),
        recruiter_seeker_chat_messages!inner (
          message_text,
          message_date,
          is_recruiter,
          users!recruiter_seeker_chat_messages_sender_user_id_fkey (
            first_name, 
            last_name, 
            profile_pic_url
          )
        )
      `,
    )
    .eq('job_id', jobId)
    .eq('is_archived', false)
    .eq('is_active', true)
    .eq('job_interview_stages.is_active', true)
    .eq('recruiter_seeker_swipes.seekers.seeker_id', candidateId)
    .filter(
      'job_interview_stages.job_seeker_stage.seeker_id',
      'eq',
      candidateId,
    )
    .eq('recruiter_seeker_swipes.seekers.job_seeker_status.is_active', true)
    .single();

  if (error) {
    throw error;
  }

  // Navigate the data structure carefully
  const swipe = data.recruiter_seeker_swipes[0];
  const seeker = swipe.seekers;
  const user = (seeker as any).users;
  const rawMessages = data.recruiter_seeker_chat_messages || [];

  // Map Messages
  const messages: Message[] = rawMessages.map(
    (m: any) =>
      ({
        isRecruiter: m.is_recruiter,
        dateSent: new Date(m.message_date),
        dateSentStr: new Date(m.message_date).toLocaleDateString(
          'en-IL',
          DATE_OPTIONS_WITH_TIME,
        ),
        text: m.message_text,
        profileImageUrl: m.is_recruiter ? '' : user.profile_pic_url,
        senderFullName: m.is_recruiter
          ? 'Recruiter'
          : `${user.first_name} ${user.last_name}`,
      }) as Message,
  );

  // Map Stages
  const stages = (data.job_interview_stages as any[])
    .sort((a, b) => a.stage_index - b.stage_index)
    .map(
      (s) =>
        ({
          stageId: s.interview_stage_id,
          name: s.interview_type,
          stageDate: s.interview_date,
          numberInProcess: s.stage_index,
        }) as Stage,
    );
  // Calculate last update for stages
  const updateDateStages = (data.job_interview_stages as any[])
    .map((s) => s.recent_update)
    .filter(Boolean);

  const lastUpdatedStagesDate =
    updateDateStages.length > 0
      ? new Date(
          Math.max(...updateDateStages.map((d) => new Date(d).getTime())),
        )
      : new Date();
  const { text: lastUpdatedStagesText, isToday: isTodayStages } =
    getVerboseTimeDifference(lastUpdatedStagesDate.toString());
  const lastUpdatedStagesResponse = `${lastUpdatedStagesText}${
    isTodayStages
      ? ` at ${new Date(lastUpdatedStagesDate).toLocaleTimeString('en-IL', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        })}`
      : ''
  }`;
  // Calculate last update for messages
  const messageDates = messages.map((m) => m.dateSent).filter(Boolean);

  const firstMessageDate =
    messageDates.length > 0
      ? new Date(Math.min(...messageDates.map((d) => new Date(d).getTime())))
      : new Date();
  const { text: firstSentMessageText, isToday: isTodayMessage } =
    getVerboseTimeDifference(firstMessageDate.toString());
  const firstMessageResponse = `${firstSentMessageText}${
    isTodayMessage
      ? ` at ${new Date(firstMessageDate).toLocaleTimeString('en-IL', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        })}`
      : ''
  }`;

  const { days } = getTimeDifference(
    (seeker as any).job_seeker_status[0].response_time_date,
    'input',
  );

  return {
    chatId: `${data.job_id}_${(seeker as any).seeker_id}`,
    dateOpened: messages.length > 0 ? new Date() : data.date_uploaded,
    stages: stages,
    lastUpdatedStages: lastUpdatedStagesResponse,
    notes: ((seeker as any).recruiter_seeker_notes || []).map(
      (n: any) =>
        ({
          noteId: n.note_id,
          dateUploaded: n.note_date,
          text: n.note_text,
        }) as Note,
    ),
    candidate: {
      fullName: `${user.first_name} ${user.last_name}`,
      currentStage: (data.job_interview_stages as any[]).reduce((sum, s) => {
        // Check if it's an array with items OR a non-null object
        const hasProgress = Array.isArray(s.job_seeker_stage)
          ? s.job_seeker_stage.length > 0
          : s.job_seeker_stage !== null;

        return sum + (hasProgress ? 1 : 0);
      }, 0),
      candidateProfileImageUrl: user.profile_pic_url,
      jobTitle: (seeker as any).job_titles_ref.title,
      phoneNumber: user.phone_number,
      emailAddress: user.email_address,
      resumeId: 0, // TODO: add resume ID logic
      isFrozen: (seeker as any).job_seeker_status[0].is_frozen,
      responseTimeDays: days,
    } as CandidateInChat,
    messages: messages,
    firstMessageDate: firstMessageResponse,
  } as unknown as SpecificChatFlattened;
}

export const chatDetailQueryOptions = (
  jobId: number,
  candidateId: number,
  listQueryKey: any[],
) =>
  queryOptions({
    queryKey: ['chats', 'detail', jobId, candidateId],
    queryFn: async () => await getSpecificChat(jobId, candidateId),
    initialData: () => {
      // 1. Get the list from the cache using the dynamic key
      const allChats = queryClient.getQueryData<any[]>(listQueryKey);

      // 2. Find the chat in that list
      const chatFromList = allChats?.find(
        (c) => c.jobId === jobId && c.candidateId === candidateId,
      );

      // 3. Map the list item to the "SpecificChatFlattened" shape if they differ
      if (chatFromList) {
        return {
          chatId: chatFromList.chatId,
          dateOpened: chatFromList.dateOpened,
          stages: chatFromList.stages,
          lastUpdatedStages: chatFromList.lastUpdated,
          notes: chatFromList.notes,
          candidate: chatFromList.candidate,
          messages: chatFromList.messages,
        } as SpecificChatFlattened;
      }
      return undefined;
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(listQueryKey)?.dataUpdatedAt,
  });
