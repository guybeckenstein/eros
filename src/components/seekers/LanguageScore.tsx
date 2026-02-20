import { StarIcon } from '@/assets/icons/StarIcon';

interface LanguageScoreProps {
  candidateLanguageScore: number;
}

export const LanguageScore = ({
  candidateLanguageScore,
}: LanguageScoreProps) => {
  const scoreList = [1, 2, 3, 4];

  return (
    <>
      {scoreList.map((number) => (
        <StarIcon
          key={number}
          color={
            candidateLanguageScore >= number ? 'neutral-900' : 'neutral-300'
          }
        />
      ))}
    </>
  );
};
