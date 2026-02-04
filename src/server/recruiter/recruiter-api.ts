import type { QueryClient } from '@tanstack/react-query';

export async function getDiscoverCandidates(context: {
  queryClient: QueryClient;
}) {
  return await context.queryClient.ensureQueryData(
    await JSON.parse('{"TO DO":"CREATE DATA FETCHING LOGIC HERE"}'),
  );
}
