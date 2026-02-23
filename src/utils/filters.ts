import { CandidateJobDetails } from '@/shared/types/candidates';
import { CandidateSearch } from '@/shared/types/jobs';

export const filterCandidates = (
  candidates: CandidateJobDetails[],
  searchValue: string,
  filterValue: CandidateSearch['filter'],
) => {
  const searchLower = searchValue.toLowerCase().trim();

  return candidates.filter((s) => {
    const matchesText =
      searchLower === '' || s.fullName.toLowerCase().includes(searchLower);

    const matchesCategory =
      filterValue === 'All' ||
      (filterValue === 'New' && s.currentStage === 1) ||
      (filterValue === 'Unread' && s.isMessagesUnread === true) ||
      (filterValue === 'Frozen' && s.isFrozen === true);

    return matchesText && matchesCategory;
  });
};
