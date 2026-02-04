import { createFileRoute } from '@tanstack/react-router';

import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.AUTH.REGISTER)({
  component: RegisterPage,
});

function RegisterPage() {
  return <div>Hello "/auth/register"!</div>;
}
