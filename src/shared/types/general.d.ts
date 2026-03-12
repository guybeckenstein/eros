import {
  CandidateInChat,
  CandidateJobDetails,
} from '@/shared/types/candidates';

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
  note: string;
  stageDate: string;
  numberInProcess: number;
  recentUpdateDate: Date;
}

export interface Note {
  noteId: number;
  dateUploaded: string;
  text: string;
}

export interface Message {
  isRecruiter: boolean;
  dateSent: Date;
  dateSentStr: string;
  text: string;
  profileImageUrl: string;
  senderFullName: string;
}

export interface SpecificChatFlattened {
  chatId: number;
  dateOpened: string;
  stages: Stage[];
  lastUpdatedStages: string;
  notes: Note[];
  candidate: CandidateInChat;
  messages: Message[];
  firstMessageDate: string;
}
