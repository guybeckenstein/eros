import { createFileRoute } from '@tanstack/react-router';

import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.SEEKER.PLACEHOLDER)({
  component: PlaceholderPage,
});

function PlaceholderPage() {
  return <div>Hello "/seeker/placeholder"!</div>;
}
