import { createFileRoute } from '@tanstack/react-router';

import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.AUTH.PROFILE)({
  component: ProfilePage,
});

function ProfilePage() {
  return <div>Hello "/auth/profile"!</div>;
}
