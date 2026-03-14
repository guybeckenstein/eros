import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus } from 'lucide-react';

import { Button } from '@/components/ui/buttons';

import { useCreateJobContext } from '../useCreateJobContext';

interface SortableInterviewStageProps {
  stageId: number;
  index: number;
  form: ReturnType<typeof useCreateJobContext>['form'];
}

const INTERVIEW_TYPE_OPTIONS = [
  { value: '', label: 'Choose type' },
  { value: 'Phone Screening', label: 'Phone Screening' },
  { value: 'Technical Interview', label: 'Technical Interview' },
  { value: 'Take Home Task', label: 'Take Home Task' },
  { value: 'HR Interview', label: 'HR Interview' },
];

function SortableInterviewStage({
  stageId,
  index,
  form,
}: SortableInterviewStageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: stageId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.92 : 1,
    zIndex: isDragging ? 20 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4.25 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="grid size-6 place-content-center rounded-full bg-[#F3F4F6] text-sm font-medium text-[#09090B]">
          {index + 1}
        </div>

        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] text-[#6B7280] transition outline-none hover:bg-[#F9FAFB] active:cursor-grabbing"
          aria-label={`Drag stage ${index + 1}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} className="cursor-grab" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-[15px] font-medium tracking-[0.6px] text-black">
            Interview Type*
          </label>
          <form.AppField
            name={`stage${stageId}InterviewType` as any}
            validators={{
              onChange: ({ value }) =>
                value ? undefined : 'Interview type is required.',
              onSubmit: ({ value }) =>
                value ? undefined : 'Interview type is required.',
            }}
            children={(field) => (
              <field.Select
                className="w-full"
                options={INTERVIEW_TYPE_OPTIONS}
                inputClassName="h-12 w-full rounded-lg border border-black px-3.5 py-2.5 text-lg tracking-[0.72px] text-[#B5B5B5] outline-none"
                dropdownClassName="rounded-lg border border-[#E5E7EB] p-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base font-medium tracking-wide text-black">
            Interviewer
          </label>
          <form.AppField
            name={`stage${stageId}Interviewer` as any}
            children={(field) => (
              <field.TextField
                className="px-0.5"
                wrapperClassName="h-12 w-full rounded-lg border border-black px-2.5 py-2.5"
                placeholder="e.g. John Smith"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function InterviewStagesStep() {
  const { form, stages, addStage, setStages } = useCreateJobContext();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setStages((prev) => {
      const oldIndex = prev.findIndex((stage) => stage.id === active.id);
      const newIndex = prev.findIndex((stage) => stage.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return prev;
      }

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-base font-medium tracking-wide text-black">
            Interview Stages
          </h3>
          <p className="text-[15px] tracking-[0.6px] text-black">
            Define the interview process for this position
          </p>
        </div>

        <Button
          type="button"
          className="h-9 border border-[#E4E4E7] bg-white px-3.25 py-0.5 text-sm font-medium text-[#09090B]"
          onClick={addStage}
        >
          <Plus size={16} />
          Add Stage
        </Button>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={stages.map((stage) => stage.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {stages.map((stage, index) => (
              <SortableInterviewStage
                key={stage.id}
                stageId={stage.id}
                index={index}
                form={form}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
