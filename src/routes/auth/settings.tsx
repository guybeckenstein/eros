import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  return <div>Hello "/auth/settings"!</div>;
}
