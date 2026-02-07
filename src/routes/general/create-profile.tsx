import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/general/create-profile')({
  component: CreateProfilePage,
});

function CreateProfilePage() {
  return <div>Hello "/general/create-profile"!</div>;
}
