import { createContext, useContext, useState } from 'react';

import { CreateJobStepsItemProps, steps } from '.';

export interface CreateJobContextProps {
  currentStep: CreateJobStepsItemProps;
  setCurrentStep: React.Dispatch<React.SetStateAction<CreateJobStepsItemProps>>;
}

const CreateJobContext = createContext<CreateJobContextProps | null>(null);

interface CreateJobProviderProps {
  children: React.ReactNode;
}

export function CreateJobProvider({ children }: CreateJobProviderProps) {
  const [currentStep, setCurrentStep] = useState<CreateJobStepsItemProps>(
    steps[0],
  );
  return (
    <CreateJobContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </CreateJobContext.Provider>
  );
}

export function useCreateJobContext() {
  const context = useContext(CreateJobContext);
  if (!context) {
    throw new Error(
      'useCreateJobContext must be used within a CreateJobProvider',
    );
  }
  return context;
}
