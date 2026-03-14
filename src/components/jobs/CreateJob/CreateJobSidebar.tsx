import { CreateJobSteps, steps } from '.';
import { twMerge } from 'tailwind-merge';

export interface CreateJobSidebarProps {
  currentStep: CreateJobSteps;
  onStepClick: (step: CreateJobSteps) => void;
}

function StepIndicator({
  number,
  isActive,
}: {
  number: number;
  isActive: boolean;
}) {
  return (
    <div
      className={twMerge(
        'flex size-8.75 items-center justify-center rounded-full text-center',
        isActive
          ? 'bg-black font-medium text-white'
          : 'border-2 border-gray-300 bg-white font-normal text-black',
      )}
    >
      <span className="text-sm font-medium">{number}</span>
    </div>
  );
}

function StepItem({
  number,
  title,
  description,
  isActive,
  isClickable,
  onClick,
  isLast,
}: {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  isClickable: boolean;
  onClick: () => void;
  isLast: boolean;
}) {
  return (
    <div className="relative flex flex-col">
      {/* Connecting line */}
      {!isLast && (
        <div className="absolute top-8.75 left-1/2 h-10 w-px -translate-x-1/2 bg-gray-300" />
      )}

      {/* Step content */}
      <button
        type="button"
        disabled={!isClickable}
        onClick={onClick}
        className={twMerge(
          'flex gap-3 text-left',
          isClickable ? 'cursor-pointer' : 'cursor-default',
        )}
      >
        <StepIndicator number={number} isActive={isActive} />
        <div className="flex flex-col justify-center pt-1">
          <p
            className={twMerge(
              'text-sm font-semibold',
              isActive ? 'text-black' : 'text-gray-600',
            )}
          >
            {title}
          </p>
          {isActive && (
            <p className="mt-1 w-35 text-xs text-gray-500">{description}</p>
          )}
        </div>
      </button>

      {/* Spacing between steps */}
      <div className="h-10" />
    </div>
  );
}

export function CreateJobSidebar({
  currentStep,
  onStepClick,
}: CreateJobSidebarProps) {
  return (
    <div className="flex h-full w-72 flex-col bg-[#EAEAEA]/60 p-6">
      <div className="flex flex-col gap-0">
        {steps.map((item, index) => (
          <StepItem
            key={item.step}
            number={index + 1}
            title={item.title}
            description={item.description}
            isActive={currentStep === item.step}
            isClickable={item.step < currentStep}
            onClick={() => onStepClick(item.step)}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
