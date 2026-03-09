import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';

import { useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import { ChevronRight, Search, Trash } from 'lucide-react';

import { CandidateJobCard } from '@/components/jobs/CandidateJobCard';
import { CandidateDetailsWrapper } from '@/components/seekers/CandidateWrapper';
import { PdfPreview } from '@/components/seekers/PdfPreview';
import { Button } from '@/components/ui/buttons';
import { Select } from '@/components/ui/inputs/Select';
import { TextField } from '@/components/ui/inputs/TextField';
import { Modal } from '@/components/ui/overylays/Modal';
import {
  jobDetailQueryOptions,
  removeCandidateFromJob,
} from '@/server/recruiter/jobs-queries';
import { CandidateSearch } from '@/shared/types/jobs';
import { filterCandidates } from '@/utils/filters';
import { mapToOptions } from '@/utils/transformers';

export const Route = createFileRoute('/recruiter/jobs/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const jobId = Number(id);
  const { data } = useSuspenseQuery(
    jobDetailQueryOptions(jobId, ['jobs', 'list', { text: '', sort: 'desc' }]),
  );
  const queryClient = useQueryClient();
  const bulkRemoveMutation = useMutation({
    mutationFn: removeCandidateFromJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      setSelectedSeekerIds([]); // Clear selection after deletion
    },
  });
  const [searchValue, setSearchValue] = useState<CandidateSearch['text']>('');
  const [filterValue, setFilterValue] =
    useState<CandidateSearch['filter']>('All');
  const [seekerResumeModalOpen, setSeekerResumeModalOpen] = useState(0);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(
    null,
  );
  const [removeCandidateId, setRemoveCandidateId] = useState<number | null>(
    null,
  );
  const [selectedCandidateIds, setSelectedSeekerIds] = useState<number[]>([]);

  const toggleSeekerSelection = (currId: number) => {
    setSelectedSeekerIds((prev) =>
      prev.includes(currId)
        ? prev.filter((seekerId) => seekerId !== currId)
        : [...prev, currId],
    );
  };

  const handleBulkDelete = () => {
    if (selectedCandidateIds.length === 0) return;

    // You could also wrap this in a confirm() call if you don't want a full modal
    if (
      window.confirm(
        `Are you sure you want to remove ${selectedCandidateIds.length} candidates?`,
      )
    ) {
      bulkRemoveMutation.mutate({ candidateIdList: selectedCandidateIds });
    }
  };

  const CANDIDATE_DROPDOWN_OPTIONS = [
    {
      id: 'remove',
      startIcon: <Trash size="22" className="text-current" />,
      label: 'Remove Candidate',
      onClick: (candidateId: number) => setRemoveCandidateId(candidateId),
    },
  ];

  const filteredCandidates = useMemo(
    () => filterCandidates(data.seekers, searchValue, filterValue),
    [data.seekers, searchValue, filterValue],
  );
  useEffect(() => setSelectedSeekerIds([]), [searchValue, filterValue]);

  return (
    <>
      <div className="w-full space-y-3 text-lg text-current">
        <div className="mx-auto mt-2 grid grid-cols-3 items-center">
          <div className="space-x-1 justify-self-start">
            <Link to="..">Jobs</Link>
            <ChevronRight
              size="20"
              strokeWidth="4"
              className="inline text-current"
            />
            <span className="font-bold underline underline-offset-5">
              {data.title}
            </span>
          </div>
          <p className="justify-self-center font-light text-neutral-500">
            Job uploaded: {data.dateUploaded}
          </p>
          <div className="space-x-6 justify-self-end"></div>
        </div>
        <div className="mx-auto w-19/20 space-y-3">
          <div className="flex items-center justify-between rounded bg-white px-5 py-3">
            <TextField
              value={searchValue}
              placeholder="Search candidates"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchValue(e.target.value)
              }
              startIcon={<Search size="20" className="text-neutral-500" />}
              className="w-96 text-base text-current"
            />
            <Select
              value={filterValue}
              onChange={(value) =>
                setFilterValue(value as CandidateSearch['filter'])
              }
              prefix={'Filter by: '}
              options={mapToOptions([
                'All',
                'New',
                'Unread',
                'Frozen',
              ] as CandidateSearch['filter'][])}
              className="text-base"
              inputClassName="w-60"
            />
          </div>
          {selectedCandidateIds.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex w-full items-center gap-4 bg-neutral-200 py-3 pl-2"
            >
              <div className="space-x-2 text-sm">
                <input
                  type="checkbox"
                  className="align-middle"
                  checked={true}
                  onChange={() => setSelectedSeekerIds([])} // Deselect all
                />
                <span className="align-text-top text-slate-600">
                  {selectedCandidateIds.length} Selected{' '}
                  {selectedCandidateIds.length ===
                    filteredCandidates.length && <>(All)</>}
                </span>
              </div>
              <Button
                className="gap-0 bg-neutral-300 text-base text-current transition-colors hover:bg-red-300 disabled:opacity-50"
                startIcon={<Trash size="20" />}
                onClick={handleBulkDelete}
                disabled={bulkRemoveMutation.isPending}
              >
                {bulkRemoveMutation.isPending
                  ? 'Removing...'
                  : 'Remove selected candidates'}
              </Button>
            </motion.div>
          )}
          {filteredCandidates.map((s) => (
            <CandidateJobCard
              key={s.id}
              candidate={s}
              jobId={data.jobId}
              stages={data.stages}
              isSelected={selectedCandidateIds.includes(s.id)}
              onToggleSelection={() => toggleSeekerSelection(s.id)}
              isConfirmingDelete={removeCandidateId === s.id}
              onSetRemoveId={setRemoveCandidateId}
              onViewResume={setSeekerResumeModalOpen}
              onViewProfile={setSelectedCandidateId}
              dropdownOptions={CANDIDATE_DROPDOWN_OPTIONS}
            />
          ))}
        </div>
        <Modal
          open={seekerResumeModalOpen !== 0}
          onClose={() => setSeekerResumeModalOpen(0)}
          title="Resume"
          className={'h-5/6 w-3/5'}
        >
          <PdfPreview />
        </Modal>
        <Modal
          open={!!selectedCandidateId}
          onClose={() => setSelectedCandidateId(null)}
          title="Profile"
          className={'h-5/6 w-3/5'}
        >
          {selectedCandidateId && (
            <CandidateDetailsWrapper id={selectedCandidateId} />
          )}
        </Modal>
      </div>
    </>
  );
}
