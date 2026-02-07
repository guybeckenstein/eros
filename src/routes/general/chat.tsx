import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/general/chat')({
  component: ChatPage,
});

function ChatPage() {
  return <div>Hello "/general/chat"!</div>;
}
