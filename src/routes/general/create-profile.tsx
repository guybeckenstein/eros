import { createFileRoute } from '@tanstack/react-router';

import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.GENERAL.CREATE_PROFILE)({
  component: CreateProfilePage,
});

function CreateProfilePage() {
  return <div>Hello "/general/create-profile"!</div>;
}
