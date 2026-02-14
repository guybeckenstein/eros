import { queryOptions } from '@tanstack/react-query';

import { DeleteJob, JobSearch, UpdateJob } from '@/shared/types/jobs';
import RecruiterJobItem from '@/shared/types/recruiter';
import { supabase } from '@/utils/supabase';

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
