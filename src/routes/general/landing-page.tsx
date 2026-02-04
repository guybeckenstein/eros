import { createFileRoute } from '@tanstack/react-router';

import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.GENERAL.LANDING_PAGE)({
  component: LandingPage,
});

function LandingPage() {
  return <div>Hello "/general/landing-page"!</div>;
}
