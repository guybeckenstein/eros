import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/seeker/placeholder')({
  component: PlaceholderPage,
});

function PlaceholderPage() {
  return <div>Hello "/seeker/placeholder"!</div>;
}
