import { createFileRoute } from '@tanstack/react-router';

import { ROUTE_PATHS } from '@/shared/constants/route-paths';

export const Route = createFileRoute(ROUTE_PATHS.GENERAL.CHAT.INDEX)({
  component: ChatPage,
});

function ChatPage() {
  return <div>Hello "/general/chat"!</div>;
}
