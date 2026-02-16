import { CandidateJobDetails } from './candidates';
import { JobTitleRef } from './table-references';

export interface RecruiterJobItem {
  job_id: number;
  date_uploaded: Date;
  is_active: boolean;
  job_titles_ref: JobTitleRef;
  job_seeker_status: { count: number }[];
}

export interface SpecificJobFlattened {
  jobId: number;
  dateUploaded: Date;
  title: string;
  seekers: CandidateJobDetails[];
}
