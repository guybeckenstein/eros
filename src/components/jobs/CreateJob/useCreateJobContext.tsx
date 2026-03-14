import { createContext, useContext, useState } from 'react';

import { CreateJobStepsItemProps, steps } from '.';

import { useAppForm } from '@/components/hooks/useAppForm';

export interface InterviewStage {
  id: number;
}

export interface CreateJobFormValues {
  jobTitle: string;
  yearsExperience: [number, number];
  location: string;
  employmentFullTime: boolean;
  employmentPartTime: boolean;
  employmentContract: boolean;
  employmentInternship: boolean;
  startImmediate: boolean;
  startWithinMonth: boolean;
  startWithinThreeMonths: boolean;
  workPlaceOnSite: boolean;
  workPlaceHybrid: boolean;
  workPlaceRemote: boolean;
  workPlaceInternship: boolean;
  salary: string;
  skills: string;
  languages: string;
  educationEnabled: boolean;
  degreeBs: boolean;
  degreeBa: boolean;
  levelBachelor: boolean;
  levelMaster: boolean;
  levelDoctoral: boolean;
  instUniversity: boolean;
  instCollege: boolean;
  instOther: boolean;
  jobDescription: string;
  [key: `stage${number}InterviewType`]: string | undefined;
  [key: `stage${number}Interviewer`]: string | undefined;
}

function useCreateJobProviderValue() {
  const [currentStep, setCurrentStep] = useState<CreateJobStepsItemProps>(
    steps[0],
  );

  const form = useAppForm({
    defaultValues: {
      jobTitle: '',
      yearsExperience: [0, 10],
      location: '',
      employmentFullTime: false,
      employmentPartTime: false,
      employmentContract: false,
      employmentInternship: false,
      startImmediate: false,
      startWithinMonth: false,
      startWithinThreeMonths: false,
      workPlaceOnSite: false,
      workPlaceHybrid: false,
      workPlaceRemote: false,
      workPlaceInternship: false,
      salary: '',
      skills: '',
      languages: '',
      educationEnabled: false,
      degreeBs: false,
      degreeBa: false,
      levelBachelor: false,
      levelMaster: false,
      levelDoctoral: false,
      instUniversity: false,
      instCollege: false,
      instOther: false,
      jobDescription: '',
      stage1InterviewType: '',
      stage1Interviewer: '',
    },
  });

  const [stages, setStages] = useState<InterviewStage[]>([{ id: 1 }]);

  const addStage = () => {
    setStages((prev) => {
      const nextId = Math.max(...prev.map((stage) => stage.id), 0) + 1;
      return [...prev, { id: nextId }];
    });
  };

  return {
    currentStep,
    setCurrentStep,
    form,
    stages,
    addStage,
    setStages,
  };
}

export type CreateJobContextProps = ReturnType<
  typeof useCreateJobProviderValue
>;

const CreateJobContext = createContext<CreateJobContextProps | null>(null);

interface CreateJobProviderProps {
  children: React.ReactNode;
}

export function CreateJobProvider({ children }: CreateJobProviderProps) {
  const value = useCreateJobProviderValue();

  return (
    <CreateJobContext.Provider value={value}>
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
