import { useQuery } from '@tanstack/react-query';

import { candidateDetailQueryOptions } from '@/server/recruiter/discover-queries';

export function useCandidateDetails(candidateId?: number) {
  return useQuery({
    ...candidateDetailQueryOptions(candidateId!),
    enabled: !!candidateId, // Only fetch when we have an ID
  });
}
