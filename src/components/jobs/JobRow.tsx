import * as React from 'react';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { BriefcaseBusiness, Ellipsis } from 'lucide-react';

import { VerticalDividerIcon } from '@/assets/icons/VerticalDividerIcon';
import { DeleteJob } from '@/components/jobs/DeleteJob';

import { DropdownOptions } from './DropdownOptions';

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
  // Add more fields if you need them in the future
};

type JobRowProps = {
  job: MinimalJob;
  /**
   * Whether the delete confirmation UI should be shown for this job.
   */
  isConfirmingDelete: boolean;
  /**
   * Called when user cancels delete in the confirmation panel.
   */
  onCancelDelete: () => void;
  /**
   * Options to render inside the actions popover (Edit / Restore / Delete...).
   * The onClick will receive jobId.
   */
  menuOptions: JobMenuOption[];
};

export function JobRow({
  job,
  isConfirmingDelete,
  onCancelDelete,
  menuOptions,
}: JobRowProps) {
  return (
    <div
      className="grid grid-cols-[0.5fr_1fr_max-content] items-center rounded-md border bg-white px-7 py-9"
      data-testid={`job-row-${job.jobId}`}
    >
      <div className="flex items-center gap-4">
        <BriefcaseBusiness size="22" />
        <h2 className="mb-1 text-2xl font-bold text-current">{job.title}</h2>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-medium text-current">
          Date Uploaded:
        </h3>
        <p className="font-medium text-current">{job.dateUploaded}</p>
      </div>

      <div className="flex items-center gap-24">
        <VerticalDividerIcon className="h-12 w-0.5 fill-none" />

        <Popover data-slot="dropdown">
          <PopoverButton aria-label="Open job row actions">
            <Ellipsis size="24" className="cursor-pointer text-neutral-500" />
          </PopoverButton>

          <PopoverPanel
            anchor="bottom end"
            transition
            className="original-top mt-2 rounded-sm border border-neutral-200 bg-white transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
          >
            {({ close }) => (
              <>
                {isConfirmingDelete === true && (
                  <DeleteJob
                    jobId={job.jobId}
                    onCancel={onCancelDelete}
                    close={close}
                  />
                )}
                {isConfirmingDelete === false && (
                  <DropdownOptions options={menuOptions} jobId={job.jobId} />
                )}
              </>
            )}
          </PopoverPanel>
        </Popover>
      </div>
    </div>
  );
}
