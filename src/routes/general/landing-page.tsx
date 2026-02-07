import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/general/landing-page')({
  component: LandingPage,
});

function LandingPage() {
  return <div>Hello "/general/landing-page"!</div>;
}
