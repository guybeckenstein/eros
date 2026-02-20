import { GraduationCap } from 'lucide-react';

import { InfoRow } from '@/components/discover/InfoRow';
import { Study } from '@/shared/types/general';

interface StudyRowsProps {
  studies: Study[];
}

export const StudyRows = ({ studies }: StudyRowsProps) => {
  return (
    <>
      {studies.map((s) => (
        <InfoRow
          key={s.level}
          icon={<GraduationCap size="22" className="m-auto" />}
        >
          {s.studyName}
        </InfoRow>
      ))}
    </>
  );
};
