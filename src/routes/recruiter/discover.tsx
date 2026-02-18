import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';

import { useEffect, useRef, useState } from 'react';

import { LinearProgress } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { motion } from 'framer-motion';
import {
  Building2,
  Clock,
  Contact,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Linkedin,
  MapPin,
  X,
} from 'lucide-react';

import { StarIcon } from '@/assets/icons/StarIcon';
import { ExperienceItem } from '@/components/discover/ExperienceItem';
import { InfoRow } from '@/components/discover/InfoRow';
import { MatchButton } from '@/components/discover/MatchButton';
import { SocialLink } from '@/components/discover/SocialLink';
import { SectionHeader } from '@/components/headers/SectionHeader';
import { Option, Select } from '@/components/ui/form';
import {
  discoverCandidatesQueryOptions,
  recruiterJobTitlesQueryOptions,
} from '@/server/recruiter/discover-queries';

export const Route = createFileRoute('/recruiter/discover')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(discoverCandidatesQueryOptions());
    queryClient.ensureQueryData(recruiterJobTitlesQueryOptions());
  },
  component: DiscoverPage,
});

enum ClickedSection {
  WorkExperience = 'Work Experience',
  Education = 'Education',
  Skills = 'Skills',
}

interface SwipeDirectionProps {
  x: number;
  rotate: number;
  opacity: number;
}

function DiscoverPage() {
  const { data } = useSuspenseQuery(discoverCandidatesQueryOptions());
  const { data: jobTitles } = useSuspenseQuery(
    recruiterJobTitlesQueryOptions(),
  );
  console.log(
    jobTitles.map((job) => ({
      label: job.title,
      value: job.id,
    })),
  );
  const [filterJobTitle, setFilterJobTitle] = useState<string>();
  const [index, setIndex] = useState(0);
  const candidate = data[index];
  const matchScore = 80;

  // Create the ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [clickedSection, setClickedSection] = useState<ClickedSection>(
    ClickedSection.WorkExperience,
  );
  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    // Map the enum values to the IDs you already have in your HTML
    const sectionIds: Record<ClickedSection, string> = {
      [ClickedSection.WorkExperience]: 'work-experience',
      [ClickedSection.Education]: 'education',
      [ClickedSection.Skills]: 'skills',
    };

    const targetId = sectionIds[clickedSection];
    const element = scrollContainerRef.current.querySelector(`#${targetId}`);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [clickedSection]);

  const scoreList = [1, 2, 3, 4];
  // Swipe
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirectionProps>({
    x: 0,
    rotate: 0,
    opacity: 1,
  });

  return (
    candidate && (
      <div className="flex flex-1">
        {/* Filter */}
        <div>
          <h1 className="text-3xl font-bold">I'm looking for:</h1>
          <Select
            inputClassName="border-b outline-0! min-w-60"
            value={filterJobTitle}
            onChange={(value) => {
              const selectedJob = jobTitles.find((job) => job.id === value);
              setFilterJobTitle(selectedJob ? selectedJob.title : undefined);
            }}
            options={jobTitles.map(
              (job) =>
                ({
                  label: job.title,
                  value: job.id,
                }) as Option,
            )}
          />
        </div>
        {/* Content */}
        <div className="relative flex h-full w-5/6">
          {/* Actual content */}
          <div className="relative z-10 m-auto h-6/7 w-3/5 overflow-hidden rounded-lg border border-neutral-300">
            <motion.div
              className="absolute inset-0 grid size-full grid-cols-[0.5fr_1fr]"
              initial={{ x: 0, rotate: 0, opacity: 1 }}
              animate={{ ...swipeDirection }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              onAnimationComplete={() => {
                if (swipeDirection.x !== 0) {
                  setSwipeDirection({ x: 0, rotate: 0, opacity: 1 }); // reset animation state
                  // move to next candidate if exists
                  if (index < data.length - 1) {
                    setIndex(index + 1);
                  }
                }
              }}
            >
              <div className="flex size-full flex-col justify-between gap-2 rounded-l-[8.5px] bg-neutral-200 p-4">
                <div>
                  <header className="items-top flex justify-between">
                    <div className="items-top flex gap-2 border-b border-neutral-200 pb-4">
                      {candidate.profilePicUrl &&
                      candidate.profilePicUrl.length > 0 ? (
                        <img
                          className="object-fit max-h-12 min-h-12 max-w-12 min-w-12 rounded-full border"
                          alt={`${candidate.fullName} profile pic`}
                          src={candidate.profilePicUrl}
                        />
                      ) : (
                        <div className="max-h-12 min-h-12 max-w-12 min-w-12 rounded-full border bg-neutral-700" />
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
                        icon={<Globe size="20" className="cursor-pointer" />}
                        title="Website link"
                      />
                      <SocialLink
                        href={candidate.linkedinLink}
                        icon={<Linkedin size="20" className="cursor-pointer" />}
                        title="LinkedIn link"
                      />

                      {candidate.resumeId && (
                        // TODO: add PDF preview popup logic
                        <FileText size="20" className="cursor-pointer" />
                      )}
                    </div>
                  </header>
                  <div className="mt-16 mb-6">
                    <div className="relative">
                      <Tooltip
                        title={
                          <div className="flex flex-col">
                            <h3 className="text-xs text-neutral-600">Match</h3>
                            <h4 className="text-sm font-bold text-current">
                              {matchScore}%
                            </h4>
                          </div>
                        }
                        open={true}
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            disablePortal: true,
                            modifiers: [
                              {
                                name: 'offset',
                                options: {
                                  offset: [0, -8],
                                },
                              },
                            ],
                          },
                          tooltip: {
                            // 2. background color to white + shadow/border for visibility
                            className:
                              'bg-white! text-center border border-neutral-200 text-current! rounded-b-lg! rounded-t-md!',
                          },
                          arrow: {
                            // Ensures the arrow matches the white background
                            className:
                              'text-white! before:border before:border-neutral-200',
                          },
                        }}
                      >
                        <div
                          className="absolute translate-x-1/2"
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
                  {/* Data about the seeker */}
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
                    {candidate.currentStudies.map((s) => (
                      <InfoRow
                        key={s.level}
                        icon={<GraduationCap size="22" className="m-auto" />}
                      >
                        {s.studyName}
                      </InfoRow>
                    ))}
                  </div>
                </div>
                <div className="mx-auto flex gap-4">
                  <MatchButton
                    icon={
                      <X
                        size="22"
                        className="m-auto"
                        onClick={() =>
                          setSwipeDirection({
                            x: -800,
                            rotate: -20,
                            opacity: 0,
                          })
                        }
                      />
                    }
                  />
                  <MatchButton
                    icon={
                      <Heart
                        size="22"
                        className="m-auto"
                        onClick={() =>
                          setSwipeDirection({ x: 800, rotate: 20, opacity: 0 })
                        }
                      />
                    }
                  />
                </div>
              </div>
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
                        isActive={clickedSection === value}
                        onClick={() => setClickedSection(value)}
                      />
                    ))}
                  </header>
                  <X size="24" className="cursor-pointer" />
                </div>
                <main className="space-y-12">
                  <section
                    id="work-experience"
                    className="scroll-mt-14 space-y-6"
                  >
                    <h1 className="text-2xl font-semibold text-current">
                      Work Experience
                    </h1>
                    {candidate.experience.map((e) => (
                      <ExperienceItem
                        key={e.companyName}
                        title={e.companyName}
                        subtitle={e.jobTitle}
                        description={e.jobDescription}
                        period={e.period}
                        logoUrl={e.companyLogoUrl}
                      />
                    ))}
                  </section>
                  <section id="education" className="scroll-mt-14 space-y-6">
                    <h1 className="text-2xl font-semibold text-current">
                      Education
                    </h1>
                    {candidate.currentStudies.map((s) => (
                      <ExperienceItem
                        key={s.level}
                        title={s.institution}
                        subtitle={s.studyName}
                        description={s.studyDescription}
                        period={s.period}
                        logoUrl={s.institutionLogoUrl}
                      />
                    ))}
                  </section>
                  <section id="skills" className="scroll-mt-14 space-y-6">
                    <h1 className="text-2xl font-semibold text-current">
                      Skills
                    </h1>
                    <div className="flex flex-wrap items-start gap-4">
                      {candidate.skills.map((s) => (
                        <div
                          key={s}
                          className="rounded-2xl bg-neutral-200 px-2 py-1 text-xs"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </section>
                  <div className="space-y-4">
                    {candidate.languages.map((l) => (
                      <div
                        key={l.name}
                        className="grid grid-cols-[1fr_3fr] items-center text-lg"
                      >
                        <h3 className="font-bold">{l.name}</h3>
                        <div className="space-x-3">
                          <span className="inline-flex gap-0.5">
                            {scoreList.map((number) => (
                              <StarIcon
                                key={number}
                                color={
                                  l.score >= number
                                    ? 'neutral-900'
                                    : 'neutral-300'
                                }
                              />
                            ))}
                          </span>
                          <span>({l.rank})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </main>
              </div>
            </motion.div>
          </div>
          {/* Design */}
          <div className="absolute top-1/2 left-1/2 h-6/7 w-3/5 -translate-1/2 -rotate-2 rounded-lg border border-neutral-300">
            <div className="grid h-full grid-cols-[0.5fr_1fr]">
              <div className="size-full gap-2 rounded-l-[8.5px] bg-neutral-200 p-4"></div>
              <div className="size-full rounded-r-[9px] bg-white p-4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
