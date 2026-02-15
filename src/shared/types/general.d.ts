export interface Study {
  institution: string;
  institutionLogoUrl: string;
  level: string;
  studyName: string;
  studyDescription: string;
  period: string;
}

export interface Experience {
  companyName: string;
  companyLogoUrl: string;
  jobTitle: string;
  jobDescription: string;
  startMonth: number;
  startYear: number;
  endMonth?: number;
  endYear?: number;
  period: string;
  isCurrentlyWorking: boolean;
}

type LanguageRank = 'Elementary' | 'Intermediate' | 'Fluent' | 'Native Speaker';

export interface Language {
  name: string;
  score: 1 | 2 | 3 | 4;
  rank: LanguageRank;
}
