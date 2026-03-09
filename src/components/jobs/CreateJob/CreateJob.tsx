import { useState } from 'react';

import { CreateJobSidebar } from '@/components/jobs/CreateJob/CreateJobSidebar';
import { JobDetailsStep } from '@/components/jobs/CreateJob/steps/JobDetailsStep';
import { Button } from '@/components/ui/buttons';

export enum CreateJobSteps {
  JobDetails = 'Job Details',
  Requirements = 'Requirements',
  Description = 'Description',
  InterviewStages = 'Interview Stages',
  ReviewSubmit = 'Review & Submit',
}

interface CreateJobStepsItemProps {
  step: CreateJobSteps;
  Component: React.ComponentType;
}

const steps: CreateJobStepsItemProps[] = [
  {
    step: CreateJobSteps.JobDetails,
    Component: JobDetailsStep,
  },
];

export function CreateJob() {
  const [currentStep, setCurrentStep] = useState<CreateJobStepsItemProps>(
    steps[0],
  );

  return (
    <>
      <div className="flex h-212.5">
        {/* Sidebar */}
        <CreateJobSidebar currentStep={currentStep.step} />
        {/* Main Content */}
        <div className="flex-1 p-6">
          <currentStep.Component />
        </div>
      </div>
      <div className="bg-1 flex items-center justify-end gap-2 self-stretch rounded-lg px-5 py-3.5">
        <Button>Next</Button>
      </div>
    </>
  );
}
