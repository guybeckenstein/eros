import { ExperienceItem } from '@/components/discover/ExperienceItem';
import { Experience, Study } from '@/shared/types/general';

interface ExperiencesProps {
  experiences: (Experience | Study)[];
}

export const Experiences = ({ experiences }: ExperiencesProps) => {
  // Type guard function
  const isStudy = (item: Experience | Study): item is Study => {
    return (item as Study).institution !== undefined;
  };

  return (
    <>
      {experiences.map((item) => {
        if (isStudy(item)) {
          return (
            <ExperienceItem
              key={item.institution + item.studyName} // Unique key
              title={item.institution}
              subtitle={item.studyName}
              description={item.studyDescription}
              period={item.period}
              logoUrl={item.institutionLogoUrl}
            />
          );
        }

        return (
          <ExperienceItem
            key={item.companyName}
            title={item.companyName}
            subtitle={item.jobTitle}
            description={item.jobDescription}
            period={item.period}
            logoUrl={item.companyLogoUrl}
          />
        );
      })}
    </>
  );
};
