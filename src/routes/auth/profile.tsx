import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  return <div>Hello "/auth/profile"!</div>;
}
