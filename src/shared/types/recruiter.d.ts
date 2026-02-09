export default interface RecruiterJobItem {
  job_id: number;
  date_uploaded: Date;
  is_active: boolean;
  job_titles_ref: JobTitleRef;
  job_seeker_status: { count: number }[];
}
