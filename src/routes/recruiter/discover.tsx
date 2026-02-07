import type { QueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { getDiscoverCandidates } from '@/server/recruiter/recruiter-api';

export const Route = createFileRoute('/recruiter/discover')({
  component: DiscoverPage,
  pendingComponent: DiscoverPageSkeleton,
  loader: async ({ context, params }) => {
    console.log(params);
    await getDiscoverCandidates(context as { queryClient: QueryClient });
  },
});

function DiscoverPage() {
  return <div>Hello "/recruiter/discover"!</div>;
}

function DiscoverPageSkeleton() {
  return <div>Loading "/recruiter/discover"...</div>;
}
