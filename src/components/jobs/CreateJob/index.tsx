import { DescriptionStep } from './steps/DescriptionStep.tsx';
import { InterviewStagesStep } from './steps/InterviewStagesStep';
import { JobDetailsStep } from './steps/JobDetailsStep';
import { RequirementsStep } from './steps/RequirementsStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep.tsx';

export enum CreateJobSteps {
  JobDetails = 0,
  Requirements = 1,
  Description = 2,
  InterviewStages = 3,
  ReviewSubmit = 4,
}

export interface CreateJobStepsItemProps {
  step: CreateJobSteps;
  title: string;
  description: string;
  Component: React.ComponentType;
}

export const steps: CreateJobStepsItemProps[] = [
  {
    step: CreateJobSteps.JobDetails,
    title: 'Job Details',
    description: 'Define the interview process for this position',
    Component: JobDetailsStep,
  },
  {
    step: CreateJobSteps.Requirements,
    title: 'Requirements',
    description: 'Set required skills and qualifications',
    Component: RequirementsStep,
  },
  {
    step: CreateJobSteps.Description,
    title: 'Description',
    description: 'Provide detailed job description',
    Component: DescriptionStep,
  },
  {
    step: CreateJobSteps.InterviewStages,
    title: 'Interview Stages',
    description: 'Configure interview process',
    Component: InterviewStagesStep,
  },
  {
    step: CreateJobSteps.ReviewSubmit,
    title: 'Review & Submit',
    description: 'Review and publish the job',
    Component: ReviewSubmitStep,
  },
];

export * from './CreateJob';
