import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/recruiter/jobs')({
  component: JobsPage,
});

function JobsPage() {
  return <div>Hello "/recruiter/jobs"!</div>;
}
