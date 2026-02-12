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
        is_active
      )
    ),
    years_of_experience,
    seeking_job_type,
    seeking_job_availability,
    expected_salary_min,
    expected_salary_max,
    currencies_ref!inner(
      name,
      symbol
    )
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
    full_name: `${seeker.users.first_name} ${seeker.users.last_name}`,
    profile_pic_url: `${seeker.users.profile_pic_url}`,
    job_title: seeker.job_titles_ref.title,
    years_of_experience: seeker.years_of_experience,
    work_availability: seeker.work_availability,
    work_type: seeker.work_model,
    city: seeker.cities_ref.name,
    expected_salary_min: seeker.expected_salary_min,
    expected_salary_max: seeker.expected_salary_max,
    currency_name: seeker.currencies_ref.name,
    currency_symbol: seeker.currencies_ref.symbol,
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
