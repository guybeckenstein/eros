import { DATE_OPTIONS } from '../configurations/configuration';
import { RawJobRow, RecruiterJobItem } from '../types/recruiter';

export function toRecruiterJobItem(row: RawJobRow): RecruiterJobItem {
  // Convert date safely
  const dateUploaded = row.date_uploaded
    ? new Date(row.date_uploaded)
    : new Date(NaN);

  // Extract title from related table
  const title = row.job_titles_ref?.title ?? '';

  // Sum counts safely in case it’s an array or a single object
  let seekers_number = 0;
  if (Array.isArray(row.job_seeker_status)) {
    seekers_number = row.job_seeker_status.reduce(
      (sum, x) => sum + (x?.count ?? 0),
      0,
    );
  } else if (
    row.job_seeker_status &&
    typeof row.job_seeker_status === 'object'
  ) {
    seekers_number = row.job_seeker_status.count ?? 0;
  }

  return {
    jobId: row.job_id,
    dateUploaded: dateUploaded.toLocaleDateString('en-IL', DATE_OPTIONS),
    isActive: row.is_active,
    title,
    seekersNumber: seekers_number,
  };
}
