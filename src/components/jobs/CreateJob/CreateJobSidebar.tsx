import { twMerge } from 'tailwind-merge';

import { CreateJobSteps } from './CreateJob';

export interface CreateJobSidebarProps {
  currentStep: CreateJobSteps;
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
  isLast,
}: {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  isLast: boolean;
}) {
  return (
    <div className="relative flex flex-col">
      {/* Connecting line */}
      {!isLast && (
        <div className="absolute top-8.75 left-1/2 h-10 w-px -translate-x-1/2 bg-gray-300" />
      )}

      {/* Step content */}
      <div className="flex gap-3">
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
      </div>

      {/* Spacing between steps */}
      <div className="h-10" />
    </div>
  );
}

export function CreateJobSidebar({ currentStep }: CreateJobSidebarProps) {
  const steps = [
    {
      step: CreateJobSteps.JobDetails,
      title: 'Job Details',
      description: 'Define the interview process for this position',
    },
    {
      step: CreateJobSteps.Requirements,
      title: 'Requirements',
      description: 'Set required skills and qualifications',
    },
    {
      step: CreateJobSteps.Description,
      title: 'Description',
      description: 'Provide detailed job description',
    },
    {
      step: CreateJobSteps.InterviewStages,
      title: 'Interview Stages',
      description: 'Configure interview process',
    },
    {
      step: CreateJobSteps.ReviewSubmit,
      title: 'Review & Submit',
      description: 'Review and publish the job',
    },
  ];

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
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
