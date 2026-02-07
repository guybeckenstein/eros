import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
  // pendingComponent: RouteComponent,
});

function ForgotPasswordPage() {
  return <div>Hello "/auth/forgot-password"!</div>;
}
