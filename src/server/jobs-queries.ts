import { queryOptions, useQuery } from '@tanstack/react-query';

import JobSearch from '@/shared/types/jobs';
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
