import { createFileRoute } from '@tanstack/react-router';

import { Archive, ChevronRight, Snowflake } from 'lucide-react';

export const Route = createFileRoute('/recruiter/jobs/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="w-full text-lg text-current">
        <div className="mx-auto mt-2 grid grid-cols-3 items-center">
          <div className="space-x-1 justify-self-start">
            <span>Jobs</span>
            <ChevronRight
              size={14}
              strokeWidth={4}
              className="inline text-current"
            />
            <span className="font-bold underline underline-offset-5">
              Product Manager
            </span>
          </div>
          <p className="justify-self-center font-light text-neutral-500">
            Job uploaded: 10/12/24
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
      </div>
    </>
  );
}
