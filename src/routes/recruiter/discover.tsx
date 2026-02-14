import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';

import { useEffect, useRef, useState } from 'react';

import { LinearProgress } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
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
import { ExperienceItem } from '@/components/discover/DiscoverItem';
import { SectionHeader } from '@/components/headers/SectionHeader';
import { discoverCandidatesQueryOptions } from '@/server/recruiter/discover-queries';

export const Route = createFileRoute('/recruiter/discover')({
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(discoverCandidatesQueryOptions()),
  component: DiscoverPage,
});

enum ClickedSection {
  WorkExperience = 'Work Experience',
  Education = 'Education',
  Skills = 'Skills',
}

function DiscoverPage() {
  const { data } = useSuspenseQuery(discoverCandidatesQueryOptions());
  const exampleCandidate = data[0];
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

  return (
    exampleCandidate && (
      <>
        {/* Filter */}
        <div className="absolute top-4 left-6">
          <h1 className="text-3xl font-bold">I'm looking for:</h1>
          <div>TODO: dropdown</div>
        </div>
        {/* Content */}
        <div className="relative flex size-full">
          {/* Actual content */}
          <div className="relative z-10 m-auto h-6/7 w-3/5 rounded-lg border border-neutral-300">
            <div className="grid size-full grid-cols-[0.5fr_1fr]">
              <div className="flex size-full flex-col justify-between gap-2 rounded-l-[8.5px] bg-neutral-200 p-4">
                <div>
                  <header className="items-top flex justify-between">
                    <div className="items-top flex gap-2 border-b border-neutral-200 pb-4">
                      {exampleCandidate.profilePicUrl &&
                      exampleCandidate.profilePicUrl.length > 0 ? (
                        <img
                          className="object-fit max-h-12 min-h-12 max-w-12 min-w-12 rounded-full border"
                          alt={`${exampleCandidate.fullName} profile pic`}
                          src={exampleCandidate.profilePicUrl}
                        />
                      ) : (
                        <div className="max-h-12 min-h-12 max-w-12 min-w-12 rounded-full border bg-neutral-700" />
                      )}
                      <div>
                        <h2 className="text-2xl font-semibold text-current">
                          {exampleCandidate.fullName}
                        </h2>
                        <small className="text-sm font-medium text-neutral-600">
                          {exampleCandidate.jobTitle}
                        </small>
                      </div>
                    </div>
                    <div className="mt-1 flex gap-2">
                      {exampleCandidate.websiteLink.length && (
                        <Link
                          to={exampleCandidate.websiteLink}
                          title="Website link"
                        >
                          <Globe size="20" className="cursor-pointer" />
                        </Link>
                      )}
                      {exampleCandidate.linkedinLink.length && (
                        <Link
                          to={exampleCandidate.linkedinLink}
                          title="LinkedIn link"
                        >
                          <Linkedin size="20" className="cursor-pointer" />
                        </Link>
                      )}

                      {exampleCandidate.resumeId && (
                        // TODO: add download file logic
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
                    {exampleCandidate.yearsOfExperience && (
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                          <Contact size="22" className="m-auto" />
                        </div>
                        <p className="font-semibold">
                          {exampleCandidate.yearsOfExperience}{' '}
                          {exampleCandidate.yearsOfExperience === 1
                            ? 'year'
                            : 'years'}{' '}
                          experience
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                        <MapPin size="22" className="m-auto" />
                      </div>
                      <p className="font-semibold">{exampleCandidate.city}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                        <Clock size="22" className="m-auto" />
                      </div>
                      <p className="font-semibold">
                        {exampleCandidate.workType} job
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                        <Clock size="22" className="m-auto" />
                      </div>
                      <p className="font-semibold">
                        Availability: {exampleCandidate.workAvailability}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                        <Building2 size="22" className="m-auto" />
                      </div>
                      <p className="font-semibold">
                        {exampleCandidate.workModel}
                      </p>
                    </div>
                    {exampleCandidate.currentStudies.map((s) => (
                      <div key={s.level} className="flex items-center gap-3">
                        <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                          <GraduationCap size="22" className="m-auto" />
                        </div>
                        <p className="font-semibold">{s.studyName}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mx-auto flex gap-4">
                  <div className="flex size-14 cursor-pointer rounded-full border border-neutral-400 bg-white">
                    <X size="22" className="m-auto" />
                  </div>
                  <div className="flex size-14 cursor-pointer rounded-full border border-neutral-400 bg-white">
                    <Heart size="22" className="m-auto" />
                  </div>
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
                    {exampleCandidate.experience.map((e) => (
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
                    {exampleCandidate.currentStudies.map((s) => (
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
                      {exampleCandidate.skills.map((s) => (
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
                    {exampleCandidate.languages.map((l) => (
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
            </div>
          </div>
          {/* Design */}
          <div className="absolute top-1/2 left-1/2 h-6/7 w-3/5 -translate-1/2 -rotate-2 rounded-lg border border-neutral-300">
            <div className="grid h-full grid-cols-[0.5fr_1fr]">
              <div className="size-full gap-2 rounded-l-[8.5px] bg-neutral-200 p-4"></div>
              <div className="size-full rounded-r-[9px] bg-white p-4"></div>
            </div>
          </div>
        </div>
      </>
    )
  );
}
