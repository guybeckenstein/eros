import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/recruiter/homepage')({
  component: Homepage,
});

function Homepage() {
  return <div>Hello "/recruiter/homepage"!</div>;
}
