import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useState } from 'react';

import { SquarePen, Trash } from 'lucide-react';

import { NoJobs } from '@/components/jobs/NoJobs';
import { jobsQueryOptions, updateJob } from '@/server/recruiter/jobs-queries';

import { EditJob } from './EditJob';
import { JobRow } from './JobRow';

import { Modal } from '../ui/overylays/Modal';

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
  const [editModalOpen, setEditModalOpen] = useState(0);

  const JOB_DROPDOWN_OPTIONS = [
    {
      id: 'edit',
      startIcon: <SquarePen size="22" className="text-current" />,
      label: 'Edit',
      onClick: (jobId: number) => setEditModalOpen(jobId),
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
    <>
      <div className="mt-6 flex flex-col gap-4">
        {data.length > 0 ? (
          data.map((job) => (
            <JobRow
              key={job.jobId}
              job={job}
              menuOptions={JOB_DROPDOWN_OPTIONS}
              isConfirmingDelete={deleteConfirmJobId === job.jobId}
              onCancelDelete={() => setDeleteConfirmJobId(null)}
            />
          ))
        ) : (
          <NoJobs text="No archived jobs" />
        )}
      </div>
      <Modal
        open={editModalOpen !== 0}
        onClose={() => setEditModalOpen(0)}
        title="Edit Existing Job"
        className={'h-5/6 w-3/5'}
      >
        <EditJob />
      </Modal>
    </>
  );
}
