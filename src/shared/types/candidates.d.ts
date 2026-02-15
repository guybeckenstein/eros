import { SimpleUserData } from './auth';
import { Experience, Language, Study } from './general';
import { CityRef, CurrencyRef, JobTitleRef } from './table-references';

export type DiscoverCandidate = {
  seeker_id: number;
  users: SimpleUserData;
  job_titles_ref: JobTitleRef;
  city: CityRef;
  years_of_experience: number;
  work_availability: string;
  work_model: string;
  expected_salary_min: number;
  expected_salary_max: number;
  currencies_ref: CurrencyRef;
};

export interface FlattenCandidate {
  id: number;
  fullName: string;
  profilePicUrl: string;
  jobTitle: string;
  experience: Experience[];
  yearsOfExperience: number;
  workAvailability: string;
  workType: string;
  workModel: string;
  city: string;
  expectedSalary: number[2];
  currencyName: string;
  currencySymbol: string;
  linkedinLink: string;
  websiteLink: string;
  resumeId: number;
  currentStudies: Study[];
  skills: string[];
  languages: Language[];
}
