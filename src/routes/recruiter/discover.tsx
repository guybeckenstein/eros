import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { discoverCandidatesQueryOptions } from '@/server/recruiter/discover-queries';

export const Route = createFileRoute('/recruiter/discover')({
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(discoverCandidatesQueryOptions()),
  component: DiscoverPage,
});

function DiscoverPage() {
  const { data } = useSuspenseQuery(discoverCandidatesQueryOptions());

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Discover Candidates</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm"
          >
            <h2 className="text-xl font-semibold">{`${candidate.full_name}`}</h2>
            <p className="text-muted-foreground">{candidate.job_title}</p>
            <p className="text-muted-foreground text-sm">{candidate.city}</p>
            <p className="mt-2 text-sm">
              Experience: {candidate.years_of_experience} years
            </p>
            <p className="text-sm">
              <span>Salary:</span>{' '}
              <span>
                {candidate.expected_salary_min}
                {candidate.currency_symbol}-{candidate.expected_salary_max}
                {candidate.currency_symbol}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
