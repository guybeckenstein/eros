import { useMutation, useQueryClient } from '@tanstack/react-query';

interface GenericConfirmProps<TVariables> {
  // Data & Logic
  variables: TVariables;
  mutationFn: (variables: TVariables) => Promise<any>;
  queryKeysToInvalidate?: string[][]; // The key to invalidate on success

  // UI Customization
  title: string;
  idPrefix: string;

  // Callbacks from parent
  onCancel: () => void;
  close: () => void;
  onSuccessCustom?: () => void;
}

export function ConfirmAction<TVariables>({
  variables,
  mutationFn,
  queryKeysToInvalidate,
  title,
  idPrefix,
  onCancel,
  close,
  onSuccessCustom,
}: GenericConfirmProps<TVariables>) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryKeysToInvalidate?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      onSuccessCustom?.();
      close();
    },
  });

  // Pulling the ID for the HTML attribute safely
  const displayId =
    (variables as any)?.jobId || (variables as any)?.id || 'item';

  return (
    <div className="max-w-46 px-3 py-2 text-current">
      <h3 className="mb-4 text-center text-base">{title}</h3>
      <div className="mb-2 flex items-center justify-center gap-5 text-base font-semibold">
        <button
          id={`${idPrefix}_yes_${displayId}`}
          disabled={mutation.isPending}
          onClick={() => mutation.mutate(variables)}
          className="cursor-pointer rounded-md bg-neutral-200 px-3 py-1 disabled:opacity-30"
        >
          {mutation.isPending ? '...' : 'Yes'}
        </button>
        <button
          id={`${idPrefix}_no_${displayId}`}
          disabled={mutation.isPending}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
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
