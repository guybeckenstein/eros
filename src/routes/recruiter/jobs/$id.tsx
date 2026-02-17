import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';

import { useState } from 'react';

import {
  Archive,
  Briefcase,
  ChevronRight,
  EllipsisVertical,
  FileText,
  Lightbulb,
  MapPin,
  Search,
  Snowflake,
  Timer,
  User,
} from 'lucide-react';

import { Input } from '@/components/ui/form/Input';
import { Select } from '@/components/ui/form/Select';
import { jobDetailQueryOptions } from '@/server/recruiter/jobs-queries';
import DATE_OPTIONS from '@/shared/configurations/configuration';
import { CandidateJobDetails } from '@/shared/types/candidates';
import { CandidateSearch } from '@/shared/types/jobs';

export const Route = createFileRoute('/recruiter/jobs/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const jobId = Number(id);
  const { data } = useSuspenseQuery(
    jobDetailQueryOptions(jobId, ['jobs', 'list', { text: '', sort: 'desc' }]),
  );
  const [searchValue, setSearchValue] = useState<CandidateSearch['text']>('');
  const [filterValue, setFilterValue] =
    useState<CandidateSearch['filter']>('All');

  return (
    <>
      <div className="w-full space-y-3 text-lg text-current">
        <div className="mx-auto mt-2 grid grid-cols-3 items-center">
          <div className="space-x-1 justify-self-start">
            <Link to="..">Jobs</Link>
            <ChevronRight
              size={14}
              strokeWidth={4}
              className="inline text-current"
            />
            <span className="font-bold underline underline-offset-5">
              {data.title}
            </span>
          </div>
          <p className="justify-self-center font-light text-neutral-500">
            Job uploaded:{' '}
            {new Date(data.dateUploaded).toLocaleDateString(
              'en-IL',
              DATE_OPTIONS,
            )}
          </p>
          <div className="space-x-6 justify-self-end">
            <Snowflake
              size="24"
              className="inline cursor-pointer transition-colors hover:text-neutral-600"
            />
            <Archive
              size="24"
              className="inline cursor-pointer transition-colors hover:text-neutral-600"
            />
          </div>
        </div>
        <div className="mx-auto w-19/20 space-y-3">
          <div className="flex items-center justify-between rounded bg-white px-5 py-3">
            <Input
              value={searchValue}
              placeholder="Search candidates"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchValue(e.target.value)
              }
              startIcon={<Search size="20" className="text-neutral-500" />}
              className="w-96 text-base text-current"
            />
            <Select
              value={filterValue}
              onChange={(value) =>
                setFilterValue(value as CandidateSearch['filter'])
              }
              prefix={'Filter by: '}
              options={[
                { value: 'All', label: 'All' },
                { value: 'New', label: 'New' },
                { value: 'Frozen', label: 'Frozen' },
                { value: 'Unread', label: 'Unread' },
              ]}
              className="text-base"
            />
          </div>
          {data.seekers
            // TODO: filter seekers by text and filter values
            .filter((s) => true)
            .map((s: CandidateJobDetails) => (
              <div
                key={s.id}
                className="relative grid grid-cols-[4fr_4fr_2fr] items-start rounded bg-white px-2 py-3"
              >
                <div className="flex gap-2">
                  <input
                    type="radio"
                    name="TODO: add generic radio button"
                    className="absolute top-2 left-2"
                  />
                  <div className="relative ml-8 flex size-16">
                    {s.profilePicUrl && s.profilePicUrl.length > 0 ? (
                      <img
                        className="object-fit m-auto size-12 rounded-full border"
                        alt={`${s.fullName} profile pic`}
                        src={s.profilePicUrl}
                      />
                    ) : (
                      <div className="m-auto size-12 rounded-full border bg-neutral-700" />
                    )}
                    <div className="absolute right-0 -bottom-2 flex size-8 place-items-center justify-center gap-0.5 rounded-full bg-sky-950 text-white">
                      <span className="text-xs font-semibold">
                        {s.matchScore}
                      </span>
                      <small className="text-[8px]">%</small>
                    </div>
                  </div>
                  <div className="flex max-w-110 flex-col gap-1">
                    <p className="space-x-1">
                      <b>{s.fullName}</b>{' '}
                      <small className="text-neutral-500">{s.jobTitle}</small>
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-neutral-400">
                      <MapPin size={14} className="inline" />
                      <span>{s.city}</span>
                      <Briefcase size={14} className="inline" />
                      <span>{s.jobType}</span>
                      <Lightbulb size={14} className="inline" />
                      <span>{s.yearsOfExperience} years exp.</span>
                    </div>
                    {/* TODO: add actual data from chat */}
                    <div className="flex items-center justify-between rounded-tl-xl rounded-r-lg bg-neutral-200 px-2 py-1 text-xs">
                      <span>Looking forward to our meet next week</span>
                      <span className="flex size-5 place-items-center justify-center rounded-full bg-neutral-300 text-sm font-semibold">
                        2
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Stage status */}
                  <div className="w-30 space-y-1 text-sky-950">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {/* TODO: get number of stages from jobs_stages table */}
                        STAGE {s.currentStage}/4
                      </p>
                    </div>
                    <div className="flex h-2 w-full items-center gap-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 rounded-lg ${
                            i < s.currentStage ? 'bg-sky-950' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Time left to reply */}
                  <div className="w-30 space-y-1 text-emerald-600">
                    <div className="flex items-center gap-2">
                      <Timer size={14} strokeWidth={3} />
                      <p className="text-sm font-bold">
                        {s.daysUntilRespond} days left
                      </p>
                    </div>
                    <div className="h-2 w-full rounded-lg bg-emerald-600"></div>
                  </div>
                </div>
                <div className="flex gap-2 justify-self-end">
                  <FileText size={20} />
                  <User size={20} />
                  <EllipsisVertical size={20} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
