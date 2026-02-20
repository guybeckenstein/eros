import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { useState } from 'react';

import { CandidateCard } from '@/components/seekers/CandidateCard';
import { PdfPreview } from '@/components/seekers/PdfPreview';
import { Option, Select } from '@/components/ui/form';
import { Modal } from '@/components/ui/overylays/Modal';
import {
  discoverCandidatesQueryOptions,
  recruiterJobTitlesQueryOptions,
} from '@/server/recruiter/discover-queries';
import { FlattenCandidateDiscover } from '@/shared/types/candidates';
import { getCandidateMatchScore } from '@/utils/transformers';

export const Route = createFileRoute('/recruiter/discover')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(discoverCandidatesQueryOptions());
    queryClient.ensureQueryData(recruiterJobTitlesQueryOptions());
  },
  component: DiscoverPage,
});

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
  const [filterJobTitle, setFilterJobTitle] = useState<string>('');
  const [index, setIndex] = useState(0);
  const candidate = data.filter((c: FlattenCandidateDiscover) => {
    return (
      filterJobTitle === '' ||
      filterJobTitle.toLowerCase().trim() === c.jobTitle.toLowerCase().trim()
    );
  })[index];

  const [seekerResumeModalOpen, setSeekerResumeModalOpen] = useState(0);

  // Swipe
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirectionProps>({
    x: 0,
    rotate: 0,
    opacity: 1,
  });

  return (
    <div className="flex flex-1">
      {/* Filter */}
      <div className="absolute">
        <h1 className="text-3xl font-bold">I'm looking for:</h1>
        <Select
          inputClassName="border-b outline-0! min-w-60"
          value={filterJobTitle}
          onChange={(value) => {
            setIndex(0);
            const selectedJob = jobTitles.find((job) => job.id === value);
            setFilterJobTitle(selectedJob?.title ?? '');
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
      {candidate && (
        <>
          <div className="relative mx-auto flex h-full w-5/6">
            {/* Actual content */}
            <div className="relative z-10 m-auto h-6/7 w-3/5 overflow-hidden rounded-lg border border-neutral-300">
              <CandidateCard
                candidate={candidate}
                matchScore={getCandidateMatchScore()}
                swipeDirection={swipeDirection}
                onOpenResume={setSeekerResumeModalOpen}
                onSwipeLeft={() =>
                  setSwipeDirection({ x: -800, rotate: -20, opacity: 0 })
                }
                onSwipeRight={() =>
                  setSwipeDirection({ x: 800, rotate: 20, opacity: 0 })
                }
                onAnimationComplete={() => {
                  if (swipeDirection.x !== 0) {
                    setSwipeDirection({ x: 0, rotate: 0, opacity: 1 });
                    if (index < data.length - 1) setIndex(index + 1);
                  }
                }}
              />
            </div>
            {/* Design */}
            <div className="absolute top-1/2 left-1/2 h-6/7 w-3/5 -translate-1/2 -rotate-2 rounded-lg border border-neutral-300">
              <div className="grid h-full grid-cols-[0.5fr_1fr]">
                <div className="size-full gap-2 rounded-l-[8.5px] bg-neutral-200 p-4"></div>
                <div className="size-full rounded-r-[9px] bg-white p-4"></div>
              </div>
            </div>
          </div>
          <Modal
            open={seekerResumeModalOpen !== 0}
            onClose={() => setSeekerResumeModalOpen(0)}
            title="Resume"
            className={'h-5/6 w-3/5'}
          >
            <PdfPreview />
          </Modal>
        </>
      )}
    </div>
  );
}
