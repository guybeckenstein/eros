import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, SquarePen, Trash } from 'lucide-react';

import { ChatPopover } from '@/components/chat/ChatPopover';
import { Stage } from '@/shared/types/general';

interface SortableStageProps {
  stage: Stage;
  currentStageNumber: number;
  deleteStage: () => Promise<void>;
  removeStageId: number;
  setRemoveStageId: (value: React.SetStateAction<number>) => void;
  detailQueryKey: (string | number)[];
}
export function SortableStage({
  stage,
  currentStageNumber,
  deleteStage,
  removeStageId,
  setRemoveStageId,
  detailQueryKey,
}: SortableStageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.stageId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative flex h-15 w-45 cursor-grab rounded-md border border-neutral-400 bg-white active:cursor-grabbing"
    >
      <div className="my-auto ms-2 flex items-center gap-2">
        <ChatPopover
          variables={{ stageId: stage.stageId }}
          mutationFn={deleteStage}
          queryKeysToInvalidate={[detailQueryKey.map((x) => x.toString())]}
          isConfirmAction={removeStageId === stage.stageId}
          title="Are you sure you want to delete this stage?"
          idPrefix="delete"
          onCancel={() => setRemoveStageId(0)}
          menuOptions={[
            {
              id: 'edit',
              label: 'Edit',
              startIcon: <SquarePen size="20" className="text-current" />,
              onClick: (stageId: number) =>
                console.log('TODO: edit stage text', stageId),
            },
            {
              id: 'delete',
              label: 'Delete Forever',
              startIcon: <Trash size="20" className="cursor-pointer" />,
              onClick: (stageId: number) => setRemoveStageId(stageId),
            },
          ]}
          attributeId={stage.stageId}
          className="absolute top-0 right-1 text-neutral-500"
          ellipsisType="Horizontal"
        />
        {stage.numberInProcess <= currentStageNumber ? (
          <div className="flex size-10 rounded-full bg-black">
            <Check size="24" strokeWidth="3" className="m-auto text-white" />
          </div>
        ) : (
          <div className="flex size-10 rounded-full border border-neutral-400 bg-white">
            <p className="m-auto text-xl text-current">
              {stage.numberInProcess}
            </p>
          </div>
        )}
        <p className="max-w-20 text-base font-semibold">{stage.name}</p>
      </div>
    </div>
  );
}
