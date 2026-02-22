import { useEffect, useRef, useState } from 'react';

import { LinearProgress, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Building2,
  Clock,
  Contact,
  Globe,
  Heart,
  Linkedin,
  MapPin,
  X,
} from 'lucide-react';

import { InfoRow } from '@/components/discover/InfoRow';
import { MatchButton } from '@/components/discover/MatchButton';
import { SocialLink } from '@/components/discover/SocialLink';
import { SectionHeader } from '@/components/headers/SectionHeader';
import { Experiences } from '@/components/seekers/Experiences';
import { LanguageScoreList } from '@/components/seekers/LanguageScoreList';
import { CandidateSkills } from '@/components/seekers/Skills';
import { StudyRows } from '@/components/seekers/Studies';
import { ResumeIcon } from '@/components/ui/icons/ResumeIcon';
import { FlattenCandidateDiscover } from '@/shared/types/candidates';

// Assuming these are your candidate types
interface CandidateCardProps {
  candidate: FlattenCandidateDiscover;
  matchScore?: number;
  // Swipe Props (Optional for static use)
  swipeDirection?: { x: number; rotate: number; opacity: number };
  onAnimationComplete?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onOpenResume?: (id: number) => void;
}

enum ClickedSection {
  WorkExperience = 'Work Experience',
  Education = 'Education',
  Skills = 'Skills',
}

export const CandidateCard = ({
  candidate,
  matchScore = 80,
  swipeDirection = { x: 0, rotate: 0, opacity: 1 },
  onAnimationComplete,
  onSwipeLeft,
  onSwipeRight,
  onOpenResume,
}: CandidateCardProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // section the user has manually clicked (used to drive scrollIntoView)
  const [clickedSection, setClickedSection] = useState<ClickedSection>(
    ClickedSection.WorkExperience,
  );
  // section that is currently visible in the viewport – used for highlighting
  const [activeSection, setActiveSection] = useState<ClickedSection>(
    ClickedSection.WorkExperience,
  );

  // scroll to the section that was clicked; does not fire when activeSection
  // is updated by scrolling so we don’t fight the user
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const sectionIds: Record<ClickedSection, string> = {
      [ClickedSection.WorkExperience]: 'work-experience',
      [ClickedSection.Education]: 'education',
      [ClickedSection.Skills]: 'skills',
    };
    const element = scrollContainerRef.current.querySelector(
      `#${sectionIds[clickedSection]}`,
    );
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [clickedSection]);

  // set up observer once to update activeSection on manual scroll
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;

    const sectionIds: Record<ClickedSection, string> = {
      [ClickedSection.WorkExperience]: 'work-experience',
      [ClickedSection.Education]: 'education',
      [ClickedSection.Skills]: 'skills',
    };

    // create intersection observer with root = scroll container
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matched = (
              Object.entries(sectionIds) as [ClickedSection, string][]
            ).find(([, id]) => id === entry.target.id);
            if (matched) {
              setActiveSection(matched[0]);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      },
    );

    Object.values(sectionIds).forEach((id) => {
      const el = container.querySelector(`#${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className="absolute inset-0 grid size-full grid-cols-[0.5fr_1fr]"
      initial={{ x: 0, rotate: 0, opacity: 1 }}
      animate={swipeDirection}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      onAnimationComplete={onAnimationComplete}
    >
      {/* LEFT PANEL */}
      <div className="flex size-full flex-col justify-between gap-2 rounded-l-[8.5px] bg-neutral-200 p-4">
        <div>
          <header className="items-top flex justify-between">
            <div className="items-top flex gap-2 border-b border-neutral-200 pb-4">
              {candidate.profilePicUrl ? (
                <img
                  className="object-fit size-12 rounded-full border"
                  alt={`${candidate.fullName} profile pic`}
                  src={candidate.profilePicUrl}
                />
              ) : (
                <div className="size-12 rounded-full border bg-neutral-700" />
              )}
              <div>
                <h2 className="text-2xl font-semibold text-current">
                  {candidate.fullName}
                </h2>
                <small className="text-sm font-medium text-neutral-600">
                  {candidate.jobTitle}
                </small>
              </div>
            </div>
            <div className="mt-1 flex gap-2">
              <SocialLink
                href={candidate.websiteLink}
                icon={<Globe size="20" />}
                title="Website"
              />
              <SocialLink
                href={candidate.linkedinLink}
                icon={<Linkedin size="20" />}
                title="LinkedIn"
              />
              {!!onOpenResume && (
                <ResumeIcon
                  isShow={Number(candidate.resumeId) !== 0}
                  size="20"
                  onClick={() => onOpenResume(candidate.resumeId)}
                />
              )}
            </div>
          </header>

          <div className="mt-16 mb-6">
            <div className="relative">
              <Tooltip
                title={
                  <>
                    <h3 className="text-center text-xs text-neutral-600">
                      Match
                    </h3>
                    <h4 className="text-center text-sm font-bold text-current">
                      {matchScore}%
                    </h4>
                  </>
                }
                open={true}
                placement="top"
                arrow
                slotProps={{
                  popper: {
                    disablePortal: true,
                    modifiers: [
                      { name: 'offset', options: { offset: [0, -8] } },
                    ],
                  },
                  tooltip: {
                    className:
                      'bg-white! border border-neutral-200 text-current! rounded-b-lg! rounded-t-md!',
                  },
                  arrow: {
                    className:
                      'text-white! before:border before:border-neutral-200',
                  },
                }}
              >
                <div
                  className="absolute h-full w-0 -translate-x-1/2"
                  style={{ left: `${matchScore}%` }}
                />
              </Tooltip>
              <LinearProgress
                variant="determinate"
                value={matchScore}
                className="h-2! rounded-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 text-current">
            {candidate.yearsOfExperience && (
              <InfoRow icon={<Contact size="22" className="m-auto" />}>
                {candidate.yearsOfExperience}{' '}
                {candidate.yearsOfExperience === 1 ? 'year' : 'years'}{' '}
                experience
              </InfoRow>
            )}
            <InfoRow icon={<MapPin size="22" className="m-auto" />}>
              {candidate.city}
            </InfoRow>
            <InfoRow icon={<Clock size="22" className="m-auto" />}>
              {candidate.workType} job
            </InfoRow>
            <InfoRow icon={<Clock size="22" className="m-auto" />}>
              Availability: {candidate.workAvailability}
            </InfoRow>
            <InfoRow icon={<Building2 size="22" className="m-auto" />}>
              {candidate.workModel}
            </InfoRow>
            <StudyRows studies={candidate.currentStudies} />
          </div>
        </div>

        {!!onSwipeLeft && !!onSwipeRight && (
          <div className="mx-auto flex gap-4">
            <MatchButton
              onClick={onSwipeLeft}
              icon={<X size="22" className="m-auto" />}
            />
            <MatchButton
              onClick={onSwipeRight}
              icon={<Heart size="22" className="m-auto" />}
            />
          </div>
        )}
      </div>

      {/* RIGHT PANEL (Scrollable) */}
      <div
        ref={scrollContainerRef}
        id="discover-scrollbar"
        className="relative size-full overflow-y-scroll rounded-r-[8.5px] bg-white px-4 pb-4"
      >
        <div className="sticky top-0 z-20 -mx-4 flex w-[calc(100%+2rem)] justify-between bg-white px-4 pt-4 pb-4">
          <header className="flex w-80 justify-between">
            {Object.values(ClickedSection).map((value) => (
              <SectionHeader
                key={value}
                text={value}
                isActive={activeSection === value}
                onClick={() => {
                  setClickedSection(value);
                  setActiveSection(value);
                }}
              />
            ))}
          </header>
          <X size="24" className="cursor-pointer" />
        </div>

        <main className="mb-12 space-y-12">
          <section id="work-experience" className="scroll-mt-14 space-y-6">
            <h1 className="text-2xl font-semibold">Work Experience</h1>
            <Experiences experiences={candidate.experience} />
          </section>

          <section id="education" className="scroll-mt-14 space-y-6">
            <h1 className="text-2xl font-semibold">Education</h1>
            <Experiences experiences={candidate.currentStudies} />
          </section>

          <section id="skills" className="scroll-mt-14 space-y-6">
            <h1 className="text-2xl font-semibold">Skills</h1>
            <div className="flex flex-wrap gap-4">
              <CandidateSkills skills={candidate.skills} />
            </div>
            <div className="mt-16 space-y-4">
              <LanguageScoreList languages={candidate.languages} />
            </div>
          </section>
        </main>
      </div>
    </motion.div>
  );
};
