import { CandidateJobDetails } from './candidates';
import { JobTitleRef } from './table-references';

export interface RecruiterJobItem {
  jobId: number;
  dateUploaded: string;
  isActive: boolean;
  title: string;
  seekersNumber: number;
}

export type RawJobRow = {
  job_id: number;
  date_uploaded: string | null; // Supabase returns strings for timestamps
  is_active: boolean;
  job_titles_ref: JobTitleRef | null;
  // Depending on relationship, this can come back as an array of objects with { count }
  // or a single object. We’ll handle both cases safely below.
  job_seeker_status:
    | { count: number | null }[]
    | { count: number | null }
    | null;
};

export interface SpecificJobFlattened {
  jobId: number;
  dateUploaded: string;
  stages: number;
  title: string;
  seekers: CandidateJobDetails[];
}
