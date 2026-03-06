import { CandidateInChat } from './candidates';

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

export interface Stage {
  stageId: number;
  name: string;
  stageDate: string;
  numberInProcess: number;
}

export interface Note {
  noteId: number;
  dateUploaded: string;
  text: string;
}

export interface Message {
  isRecruiter: boolean;
  dateSent: Date;
  text: string;
  profileImageUrl: string;
  senderFullName: string;
}

export interface SpecificChatFlattened {
  chatId: number;
  dateOpened: string;
  stages: Stage[];
  lastUpdated: Date;
  notes: Note[];
  candidate: CandidateInChat;
  messages: Message[];
  seekers: CandidateJobDetails[];
}
