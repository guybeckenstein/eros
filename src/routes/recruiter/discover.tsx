import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

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

import { discoverCandidatesQueryOptions } from '@/server/recruiter/discover-queries';

export const Route = createFileRoute('/recruiter/discover')({
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(discoverCandidatesQueryOptions()),
  component: DiscoverPage,
});

function DiscoverPage() {
  const { data } = useSuspenseQuery(discoverCandidatesQueryOptions());
  // const exampleCandidate = data[0];
  const matchScore = 80;

  return (
    <div className="relative space-y-4">
      <h1 className="text-2xl font-bold">I'm looking for:</h1>
      <div className="absolute right-0 left-0 h-180 w-3/5 rounded-lg border border-neutral-300">
        <div className="grid h-full grid-cols-[0.5fr_1fr]">
          <div className="flex size-full flex-col justify-between gap-2 rounded-l-[8.5px] bg-neutral-200 p-4">
            <div>
              <header className="items-top flex justify-between">
                <div className="items-top flex gap-2 border-b border-neutral-200 pb-4">
                  <div className="max-h-12 min-h-12 max-w-12 min-w-12 rounded-full border bg-neutral-700" />
                  <div>
                    <h2 className="text-xl font-semibold">Bar Simon</h2>
                    <small className="text-sm font-medium text-neutral-600">
                      Product Manager
                    </small>
                  </div>
                </div>
                <div className="mt-1 flex gap-2">
                  <Globe size="20" className="cursor-pointer" />
                  <Linkedin size="20" className="cursor-pointer" />
                  <FileText size="20" className="cursor-pointer" />
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
                <div className="flex items-center gap-3">
                  <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                    <Contact size="22" className="m-auto" />
                  </div>
                  <p className="font-medium">9 years experience</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                    <MapPin size="22" className="m-auto" />
                  </div>
                  <p className="font-medium">Tel Aviv, Israel</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                    <Clock size="22" className="m-auto" />
                  </div>
                  <p className="font-medium">Full-Time</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                    <Clock size="22" className="m-auto" />
                  </div>
                  <p className="font-medium">Availability: Now</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                    <Building2 size="22" className="m-auto" />
                  </div>
                  <p className="font-medium">Hybrid</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                    <GraduationCap size="22" className="m-auto" />
                  </div>
                  <p className="font-medium">Bachelor's Degree</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
                    <GraduationCap size="22" className="m-auto" />
                  </div>
                  <p className="font-medium">Master's Degree</p>
                </div>
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
          <div className="relative size-full p-4">
            <div className="flex justify-between">
              <div className="flex gap-10">
                <h3 className="cursor-pointer font-semibold text-current underline underline-offset-3">
                  Work Experience
                </h3>
                <h3 className="cursor-pointer font-medium text-neutral-600">
                  Education
                </h3>
                <h3 className="cursor-pointer font-medium text-neutral-600">
                  Skills
                </h3>
              </div>
              <X size="24" className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
