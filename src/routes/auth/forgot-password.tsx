import { createFileRoute } from '@tanstack/react-router';

import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.AUTH.FORGOT_PASSWORD)({
  component: ForgotPasswordPage,
  // pendingComponent: RouteComponent,
});

function ForgotPasswordPage() {
  return <div>Hello "/auth/forgot-password"!</div>;
}
