import { JobDetailsStep } from './steps/JobDetailsStep';
import { RequirementsStep } from './steps/RequirementsStep';

export enum CreateJobSteps {
  JobDetails = 0,
  Requirements = 1,
  Description = 2,
  InterviewStages = 3,
  ReviewSubmit = 4,
}

export interface CreateJobStepsItemProps {
  step: CreateJobSteps;
  Component: React.ComponentType;
}

export const steps: CreateJobStepsItemProps[] = [
  {
    step: CreateJobSteps.JobDetails,
    Component: JobDetailsStep,
  },
  {
    step: CreateJobSteps.Requirements,
    Component: RequirementsStep,
  },
];

export * from './CreateJob';
