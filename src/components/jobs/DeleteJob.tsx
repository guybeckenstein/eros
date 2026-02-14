import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteOrUpdateJob } from '@/server/recruiter/jobs-queries';

interface DeleteJobInput {
  jobId: number;
  onCancel: () => void;
  close: () => void;
}

export function DeleteJob({ jobId, onCancel, close }: DeleteJobInput) {
  const queryClient = useQueryClient();
  const deleteJobMutation = useMutation({
    mutationFn: deleteOrUpdateJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      close();
    },
  });

  return (
    <div className="max-w-46 px-3 py-2 text-current">
      <h3 className="mb-4 text-center text-base">
        Are you sure you want to delete this job?
      </h3>
      <div className="mb-2 flex items-center justify-center gap-5 text-base font-semibold">
        <button
          id={`delete_yes_${jobId}`}
          onClick={() => {
            deleteJobMutation.mutate({ jobId });
            onCancel();
            close();
          }}
          className="cursor-pointer rounded-md bg-neutral-200 px-3 py-1"
        >
          Yes
        </button>
        <button
          id={`delete_no_${jobId}`}
          onClick={() => {
            onCancel();
            close();
          }}
          className="cursor-pointer rounded-md bg-neutral-200 px-3 py-1"
        >
          No
        </button>
      </div>
    </div>
  );
}
