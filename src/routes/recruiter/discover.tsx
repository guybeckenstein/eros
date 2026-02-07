import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { discoverCandidatesQueryOptions } from '@/server/recruiter/recruiter-api';

export const Route = createFileRoute('/recruiter/discover')({
  component: DiscoverPage,
  pendingComponent: DiscoverPageSkeleton,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(discoverCandidatesQueryOptions),
});

function DiscoverPage() {
  const { data: candidates } = useSuspenseQuery(discoverCandidatesQueryOptions);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Discover Candidates</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground"
          >
            <h2 className="text-xl font-semibold">{candidate.name}</h2>
            <p className="text-muted-foreground">{candidate.role}</p>
            <p className="text-sm mt-2">Experience: {candidate.experience}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscoverPageSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Discover Candidates</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 p-4 border rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
