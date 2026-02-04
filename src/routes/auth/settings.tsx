import { createFileRoute } from '@tanstack/react-router';

import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.AUTH.SETTINGS)({
  component: SettingsPage,
});

function SettingsPage() {
  return <div>Hello "/auth/settings"!</div>;
}
