import { useNavigate } from '@tanstack/react-router';

import * as React from 'react';

import { BriefcaseBusiness } from 'lucide-react';

import { VerticalDividerIcon } from '@/assets/icons/VerticalDividerIcon';
import { JobsPopover } from '@/components/jobs/JobsPopover';
import { deleteOrUpdateJob } from '@/server/recruiter/jobs-queries';

import { ClickShield } from '../ui/utils/ClickShield';

export type MenuOption = {
  label: string;
  startIcon: React.ReactNode;
  onClick: (jobId: number) => void;
};

type MinimalJob = {
  jobId: number;
  title: string;
  dateUploaded: string;
};

type JobRowProps = {
  job: MinimalJob;
  isConfirmingDelete: boolean;
  onCancelDelete: () => void;
  menuOptions: MenuOption[];
  children?: React.ReactNode;
};

export function JobRow({
  job,
  isConfirmingDelete,
  onCancelDelete,
  menuOptions,
  children,
}: JobRowProps) {
  const navigate = useNavigate();
  return (
    <div
      className="grid cursor-pointer grid-cols-[0.5fr_1fr_max-content] items-center rounded-md border bg-white px-7 py-9 text-current"
      data-testid={`job-row-${job.jobId}`}
      onClick={() => {
        navigate({
          to: '/recruiter/jobs/$id',
          params: { id: job.jobId.toString() },
        });
      }}
    >
      <div className="flex items-center gap-4">
        <BriefcaseBusiness size="22" />
        <ClickShield>
          <h2 className="mb-1 text-2xl font-bold text-current">{job.title}</h2>
        </ClickShield>
      </div>

      <ClickShield>
        <div>{children}</div>
      </ClickShield>

      <div className="flex items-center gap-24">
        <VerticalDividerIcon className="h-12 w-0.5 fill-none" />

        <ClickShield>
          <JobsPopover
            variables={{ jobId: job.jobId }}
            mutationFn={deleteOrUpdateJob}
            queryKeysToInvalidate={[['jobs']]}
            isConfirmAction={isConfirmingDelete}
            title="Are you sure you want to delete this job?"
            idPrefix="delete"
            onCancel={onCancelDelete}
            menuOptions={menuOptions}
            attributeId={job.jobId}
          />
        </ClickShield>
      </div>
    </div>
  );
}
