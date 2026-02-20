import { CandidateCard } from '@/components/seekers/CandidateCard';
import { useCandidateDetails } from '@/hooks/use-candidate-details';
import { getCandidateMatchScore } from '@/utils/transformers';

export function CandidateDetailsWrapper({ id }: { id: number }) {
  const { data, isLoading } = useCandidateDetails(id);

  if (isLoading) {
    return <div>Loading Profile...</div>;
  } else if (!data) {
    return <div>Error loading profile.</div>;
  } else {
    return (
      <CandidateCard candidate={data} matchScore={getCandidateMatchScore()} />
    );
  }
}
