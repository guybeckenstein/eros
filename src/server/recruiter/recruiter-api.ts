import { queryOptions } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';

// Define the query options for discovering candidates
// We export this so it can be used in the component via useSuspenseQuery
export const discoverCandidatesQueryOptions = queryOptions({
  queryKey: ['recruiter', 'discover'],
  queryFn: async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock candidate data for now
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      name: `Candidate ${i + 1}`,
      role: i % 2 === 0 ? 'Frontend Developer' : 'Backend Developer',
      experience: `${Math.floor(Math.random() * 10) + 1} years`,
    }));
  },
});

export async function getDiscoverCandidates(context: {
  queryClient: QueryClient;
}) {
  return await context.queryClient.ensureQueryData(discoverCandidatesQueryOptions);
}
