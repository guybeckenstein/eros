export type JobSearch = {
  text?: string;
  sort?: 'Date' | 'Name' | 'Status';
};

export type DeleteJob = {
  jobId: number;
};

export type UpdateJob = {
  jobId: number;
  isArchived: boolean;
};

export type CandidateSearch = {
  text?: string;
  filter?: 'All' | 'New' | 'Frozen' | 'Unread';
};
