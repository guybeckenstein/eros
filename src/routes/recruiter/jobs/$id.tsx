import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';

import { Archive, Briefcase, ChevronRight, Lightbulb, MapPin, Snowflake, Timer } from 'lucide-react';

import { jobDetailQueryOptions } from '@/server/recruiter/jobs-queries';
import DATE_OPTIONS from '@/shared/configurations/configuration';
import { CandidateJobDetails } from '@/shared/types/candidates';
import { JSX } from 'react';

export const Route = createFileRoute('/recruiter/jobs/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const jobId = Number(id);
  const { data } = useSuspenseQuery(
    jobDetailQueryOptions(jobId, ['jobs', 'list', { text: '', sort: 'desc' }]),
  );

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
          {data.seekers.map((s: CandidateJobDetails) => (
            <div key={s.id} className="grid grid-cols-[4fr_4fr_2fr] items-start">
              <div className="flex gap-2">
                <input type="radio" name="TODO: add generic radio button" />
                <div className="relative flex size-16">
                  {s.profilePicUrl && s.profilePicUrl.length > 0 ? (
                    <img
                      className="object-fit m-auto size-12 rounded-full border"
                      alt={`${s.fullName} profile pic`}
                      src={s.profilePicUrl}
                    />
                  ) : (
                    <div className="m-auto size-12 rounded-full border bg-neutral-700" />
                  )}
                  <div className="absolute right-0 -bottom-2 flex size-8 place-items-center justify-center gap-0.5 rounded-full border-blue-950 bg-blue-950 text-white">
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
                  <div className="space-x-1 text-xs text-neutral-400 flex items-center">
                    <MapPin size={14} className='inline' />
                    <span>{s.city}</span>
                    <Briefcase size={14} className='inline' />
                    <span>{s.jobType}</span>
                    <Lightbulb size={14} className='inline' />
                    <span>{s.yearsOfExperience} years exp.</span>
                  </div>
                  <div className="flex items-center justify-between rounded-tl-xl rounded-r-lg bg-neutral-200 px-2 py-1 text-xs">
                    <span>Looking forward to our meet next week</span>
                    <span className="flex size-5 place-items-center justify-center rounded-full bg-neutral-300 text-sm font-semibold">
                      2
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                {/* Stage status */}
                <div className='text-blue-800 w-30 space-y-1'>
                  <div className='flex items-center gap-2'>
                    <p className='font-bold text-sm'>Stage {s.currentStage}/4</p>
                  </div>
                  <div className='bg-blue-800 w-full h-2 flex gap-2 items-center'>
                    {
                      
  const itemsList: JSX.Element[] = []; // Type the array as JSX.Element[]

  for (let i = 0; i < 4; i++) {
    itemsList.push(
      i ===
      <li key={i} className='size-full bg-blue-800'></li> // Remember to add a unique 'key' prop for each item
    );
  }
                    }
                  </div>
                </div>
                {/* Time left to reply */}
                <div className='text-emerald-600 w-30 space-y-1'>
                  <div className='flex items-center gap-2'>
                    <Timer size={14} strokeWidth={3} />
                    <p className='font-bold text-sm'>{s.daysUntilRespond} days left</p>
                  </div>
                  <div className='bg-emerald-600 w-full h-2 rounded-lg'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
