import { JobDetailsStep } from './steps/JobDetailsStep';

export enum CreateJobSteps {
  JobDetails = 'Job Details',
  Requirements = 'Requirements',
  Description = 'Description',
  InterviewStages = 'Interview Stages',
  ReviewSubmit = 'Review & Submit',
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
];

export * from './CreateJob';
