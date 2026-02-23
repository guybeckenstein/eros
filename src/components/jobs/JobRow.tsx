import * as React from 'react';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { BriefcaseBusiness, Ellipsis } from 'lucide-react';

import { VerticalDividerIcon } from '@/assets/icons/VerticalDividerIcon';
import { JobsPopover } from '@/components/jobs//JobsPopover';
import { ConfirmAction } from '@/components/jobs/ConfirmAction';
import { DropdownOptions } from '@/components/jobs/DropdownOptions';
import { deleteOrUpdateJob } from '@/server/recruiter/jobs-queries';

export type JobMenuOption = {
  id: string;
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
  menuOptions: JobMenuOption[];
  children?: React.ReactNode;
};

export function JobRow({
  job,
  isConfirmingDelete,
  onCancelDelete,
  menuOptions,
  children,
}: JobRowProps) {
  return (
    <div
      className="grid grid-cols-[0.5fr_1fr_max-content] items-center rounded-md border bg-white px-7 py-9 text-current"
      data-testid={`job-row-${job.jobId}`}
    >
      <div className="flex items-center gap-4">
        <BriefcaseBusiness size="22" />
        <h2 className="mb-1 text-2xl font-bold text-current">{job.title}</h2>
      </div>

      <div>{children}</div>

      <div className="flex items-center gap-24">
        <VerticalDividerIcon className="h-12 w-0.5 fill-none" />

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
      </div>
    </div>
  );
}
