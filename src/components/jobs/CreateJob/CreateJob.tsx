import { steps } from '.';

import { Button } from '@/components/ui/buttons';

import { CreateJobSidebar } from './CreateJobSidebar';
import { useCreateJobContext } from './useCreateJobContext';

export function CreateJob() {
  const { currentStep, setCurrentStep } = useCreateJobContext();

  return (
    <>
      <div className="flex h-212.5">
        {/* Sidebar */}
        <CreateJobSidebar currentStep={currentStep.step} />
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <currentStep.Component />
        </div>
      </div>
      <div className="bg-1 flex items-center justify-end gap-2 self-stretch rounded-b-lg border-t border-[#B1B1B1] px-6 py-4.75">
        <Button
          className="h-12 w-32.5 bg-[#222222] text-white"
          onClick={() => setCurrentStep(steps[steps.indexOf(currentStep) + 1])}
        >
          Next
        </Button>
      </div>
    </>
  );
}
