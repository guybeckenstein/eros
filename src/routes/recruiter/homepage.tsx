import { createFileRoute } from '@tanstack/react-router';

import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.RECRUITER.HOMEPAGE)({
  component: Homepage,
});

function Homepage() {
  return <div>Hello "/recruiter/homepage"!</div>;
}
