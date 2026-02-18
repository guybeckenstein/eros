import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useState } from 'react';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { BriefcaseBusiness, Ellipsis, SquarePen, Trash } from 'lucide-react';

import { VerticalDividerIcon } from '@/assets/icons/VerticalDividerIcon';
import { DeleteJob } from '@/components/jobs/DeleteJob';
import { NoJobs } from '@/components/jobs/NoJobs';
import { jobsQueryOptions, updateJob } from '@/server/recruiter/jobs-queries';
import DATE_OPTIONS from '@/shared/configurations/configuration';

export function ArchivedJobs() {
  const [deleteConfirmJobId, setDeleteConfirmJobId] = useState<number | null>(
    null,
  );
  const { data } = useSuspenseQuery(jobsQueryOptions({}, true));
  const queryClient = useQueryClient();
  const updateJobMutation = useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const JOB_DROPDOWN_OPTIONS = [
    {
      id: 'edit',
      startIcon: <SquarePen size="22" className="text-current" />,
      label: 'Edit',
      onClick: (jobId: number) =>
        console.log(`Edit job clicked for job ID ${jobId}`),
    },
    {
      id: 'restore',
      startIcon: <SquarePen size="22" className="text-current" />,
      label: 'Restore',
      onClick: (jobId: number) =>
        updateJobMutation.mutate({ jobId, isArchived: false }),
    },
    {
      id: 'delete',
      startIcon: <Trash size="22" className="text-current" />,
      label: 'Delete forever',
      onClick: (jobId: number) => setDeleteConfirmJobId(jobId),
    },
  ];

  return (
    <div className="mt-6 flex flex-col gap-4">
      {data.length > 0 ? (
        data.map((job) => (
          <div
            key={job.jobId}
            className="grid grid-cols-[0.5fr_1fr_max-content] items-center rounded-md border bg-white px-7 py-9"
          >
            <div className="flex items-center gap-4">
              <BriefcaseBusiness size="22" />
              <h2 className="mb-1 text-2xl font-bold text-current">
                {job.title}
              </h2>
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
                <PopoverButton>
                  <Ellipsis
                    size="24"
                    className="cursor-pointer text-neutral-500"
                  />
                </PopoverButton>
                <PopoverPanel
                  anchor="bottom end"
                  transition
                  className="original-top mt-2 rounded-sm border border-neutral-200 bg-white transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                >
                  {({ close }) => (
                    <>
                      {deleteConfirmJobId === job.jobId ? (
                        <DeleteJob
                          jobId={job.jobId}
                          onCancel={() => setDeleteConfirmJobId(0)}
                          close={close}
                        />
                      ) : (
                        JOB_DROPDOWN_OPTIONS.map((o) => (
                          <div
                            key={`${job.jobId}_${o.id}`}
                            className="grid cursor-pointer grid-cols-[max-content_auto] items-center gap-4 px-4 py-2 text-current transition-colors hover:bg-neutral-100"
                          >
                            <span className="pointer-events-none">
                              {o.startIcon}
                            </span>
                            <div
                              onClick={() => o.onClick(job.jobId)}
                              className="text-base"
                            >
                              {o.label}
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </PopoverPanel>
              </Popover>
            </div>
          </div>
        ))
      ) : (
        <NoJobs text="No archived jobs" />
      )}
    </div>
  );
}
