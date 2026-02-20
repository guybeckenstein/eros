import { LanguageScore } from '@/components/seekers/LanguageScore';
import { Language } from '@/shared/types/general';

interface LanguageScoreListProps {
  languages: Language[];
}

export const LanguageScoreList = ({ languages }: LanguageScoreListProps) => {
  return (
    <>
      {languages.map((l) => (
        <div
          key={l.name}
          className="grid grid-cols-[1fr_3fr] items-center text-lg"
        >
          <h3 className="font-bold">{l.name}</h3>
          <div className="space-x-3">
            <span className="inline-flex gap-0.5">
              <LanguageScore candidateLanguageScore={l.score} />
            </span>
            <span>({l.rank})</span>
          </div>
        </div>
      ))}
    </>
  );
};
