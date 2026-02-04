import { createFileRoute } from '@tanstack/react-router';

import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.AUTH.LOGIN)({
  component: LoginPage,
});

function LoginPage() {
  return <div>Hello "/auth/login"!</div>;
}
