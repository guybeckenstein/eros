import { createFileRoute } from '@tanstack/react-router';

import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.RECRUITER.JOBS.INDEX)({
  component: JobsPage,
});

function JobsPage() {
  return <div>Hello "/recruiter/jobs"!</div>;
}
