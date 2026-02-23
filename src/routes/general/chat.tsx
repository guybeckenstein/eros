import { createFileRoute } from '@tanstack/react-router';

import { InformationIcon } from '@/components/ui/icons';

export const Route = createFileRoute('/general/chat')({
  component: ChatPage,
});

function ChatPage() {
  return <div>Hello "/general/chat"!</div>;
}
