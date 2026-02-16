import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  loader: async () => {},
  component: Home,
});

function Home() {
  return <div>Nothing to show here</div>;
}
