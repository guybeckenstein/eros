import { CreateJobSteps, steps } from '.';

import { Button } from '@/components/ui/buttons';

import { CreateJobSidebar } from './CreateJobSidebar';
import { useCreateJobContext } from './useCreateJobContext';

export function CreateJob() {
  const { currentStep, setCurrentStep, form, stages } = useCreateJobContext();
  const lastStep = steps[steps.length - 1];
  const firstStep = steps[0];

  const handleSidebarStepClick = (step: CreateJobSteps) => {
    if (step >= currentStep.step) {
      return;
    }

    const targetStep = steps.find((item) => item.step === step);
    if (targetStep) {
      setCurrentStep(targetStep);
    }
  };

  const canProceedToNextStep = async () => {
    if (currentStep.step === CreateJobSteps.JobDetails) {
      await form.validateField('workPlaceOnSite', 'submit');
      const workPlaceMeta = form.getFieldMeta('workPlaceOnSite');
      return !workPlaceMeta?.errors.length;
    }

    if (currentStep.step === CreateJobSteps.Description) {
      await form.validateField('jobDescription', 'submit');
      const descriptionMeta = form.getFieldMeta('jobDescription');
      return !descriptionMeta?.errors.length;
    }

    if (currentStep.step === CreateJobSteps.InterviewStages) {
      for (const stage of stages) {
        const fieldName = `stage${stage.id}InterviewType` as const;
        await form.validateField(fieldName as any, 'submit');
      }

      return stages.every((stage) => {
        const fieldName = `stage${stage.id}InterviewType` as any;
        const fieldMeta = form.getFieldMeta(fieldName);
        return !fieldMeta?.errors.length;
      });
    }

    return true;
  };

  const handleNextClick = async () => {
    const isValidStep = await canProceedToNextStep();
    if (!isValidStep) {
      return;
    }

    setCurrentStep(steps[currentStep.step + 1]);
  };

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex min-h-212.5">
        {/* Sidebar */}
        <CreateJobSidebar
          currentStep={currentStep.step}
          onStepClick={handleSidebarStepClick}
        />
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <currentStep.Component />
        </div>
      </div>
      <div className="bg-1 flex items-center justify-between gap-2 self-stretch rounded-b-lg border-t border-[#B1B1B1] px-6 py-4.75">
        {currentStep.step > firstStep.step && (
          <Button
            type="button"
            className="h-12 w-32.5 justify-self-end bg-[#222222] text-white"
            onClick={() => setCurrentStep(steps[currentStep.step - 1])}
          >
            Back
          </Button>
        )}
        {currentStep.step === firstStep.step && <div />}
        {currentStep.step < lastStep.step && (
          <Button
            type="button"
            className="h-12 w-32.5 justify-self-end bg-[#222222] text-white"
            onClick={handleNextClick}
          >
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
