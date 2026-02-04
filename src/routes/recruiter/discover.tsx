import type { QueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { getDiscoverCandidates } from '@/server/recruiter/recruiter-api';
import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.RECRUITER.DISCOVER.INDEX)({
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
