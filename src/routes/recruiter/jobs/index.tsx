import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useDeferredValue, useEffect, useState } from 'react';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import {
  Archive,
  BriefcaseBusiness,
  Ellipsis,
  Plus,
  Search,
  SquarePen,
  Trash,
  Users,
} from 'lucide-react';

import { VerticalDividerIcon } from '@/assets/icons/VerticalDividerIcon';
import { ArchivedJobs } from '@/components/jobs/ArchivedJobs';
import { CreateJob } from '@/components/jobs/CreateJob/CreateJob';
import { DataColumn } from '@/components/jobs/DataColumn';
import { DeleteJob } from '@/components/jobs/DeleteJob';
import { DropdownOptions } from '@/components/jobs/DropdownOptions';
import { EditJob } from '@/components/jobs/EditJob';
import { NoJobs } from '@/components/jobs/NoJobs';
import { Button, StatusButton } from '@/components/ui/Buttons';
import { Select, TextField } from '@/components/ui/inputs';
import { Modal } from '@/components/ui/overylays/Modal';
import { jobsQueryOptions } from '@/server/recruiter/jobs-queries';
import { JobSearch } from '@/shared/types/jobs';
import { mapToOptions } from '@/utils/transformers';

export const Route = createFileRoute('/recruiter/jobs/')({
  validateSearch: (search: Record<string, unknown>): JobSearch => {
    return {
      text: (search.text as string) || undefined,
      sort: search.sort as JobSearch['sort'] | undefined,
    };
  },
  loaderDeps: ({ search }: { search: JobSearch }) => ({ search }),
  loader: async ({ context: { queryClient }, deps: { search } }) =>
    queryClient.ensureQueryData(jobsQueryOptions(search)),
  component: JobsPage,
});

function JobsPage() {
  const { text = '', sort = 'Date' } = Route.useSearch();
  const { data } = useSuspenseQuery(jobsQueryOptions({ text, sort }));
  const navigate = useNavigate({ from: Route.fullPath });
  const [sortValue, setSortValue] = useState<JobSearch['sort']>(sort);
  const [searchValue, setSearchValue] = useState(text);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(0);
  const [deleteConfirmJobId, setDeleteConfirmJobId] = useState(0);

  const deferredSearchValue = useDeferredValue(searchValue);

  useEffect(() => setSearchValue(text), [text]);
  useEffect(() => setSortValue(sort), [sort]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue === text) return;
      navigate({
        search: (prev) => ({ ...prev, text: searchValue }),
        replace: true,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [navigate, searchValue, text]);

  useEffect(() => {
    if (sortValue === sort) return;
    navigate({
      search: (prev) => ({ ...prev, sort: sortValue }),
      replace: true,
    });
  }, [navigate, sortValue, sort]);

  const handleSort = (
    newText: JobSearch['text'],
    newSort: JobSearch['sort'],
  ) => {
    if (newText === text && newSort === sort) return; // Skip if already selected
    navigate({
      search: (prev) => ({ ...prev, text: newText, sort: newSort }),
    });
  };

  const JOB_DROPDOWN_OPTIONS = [
    {
      id: 'candidates',
      startIcon: <Users size="22" className="text-current" />,
      label: 'Candidates',
      onClick: (jobId: number) => {
        navigate({
          to: '/recruiter/jobs/$id',
          params: { id: jobId.toString() },
        });
      },
    },
    {
      id: 'edit',
      startIcon: <SquarePen size="22" className="text-current" />,
      label: 'Edit',
      onClick: (jobId: number) => setEditModalOpen(jobId),
    },
    {
      id: 'delete',
      startIcon: <Trash size="22" className="text-current" />,
      label: 'Delete',
      onClick: (jobId: number) => setDeleteConfirmJobId(jobId),
    },
  ];

  return (
    <>
      <div className="w-full">
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <TextField
              value={deferredSearchValue}
              placeholder="Search jobs..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchValue(e.target.value)
              }
              startIcon={
                <span className="mr-2">
                  <Search size="22" className="text-current" />
                </span>
              }
              wrapperClassName="bg-white"
              className="w-96"
            />
            <Select
              inputClassName="bg-white"
              value={sortValue}
              onChange={(value) => setSortValue(value as JobSearch['sort'])}
              prefix={'Sort by: '}
              options={mapToOptions([
                'Date',
                'Name',
                'Status',
              ] as JobSearch['sort'][])}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              className={'h-12 w-56 bg-neutral-900 text-white'}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size="24" className="text-white" />
              Add New Job
            </Button>
            <Archive
              size="24"
              className="cursor-pointer text-current transition-colors hover:text-neutral-600"
              onClick={() => setIsArchiveModalOpen(true)}
            />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {(data &&
            data.map((job) => (
              <div
                key={job.jobId}
                className="grid grid-cols-[0.5fr_1fr_max-content] items-center rounded-md border bg-white px-7 py-9 text-current"
              >
                <div className="flex h-full items-center gap-4">
                  <BriefcaseBusiness size="22" />
                  <h2 className="text-2xl font-bold">{job.title}</h2>
                </div>
                <div className="flex gap-16 font-medium">
                  <DataColumn header="Status:">
                    <StatusButton isActive={job.isActive} />
                  </DataColumn>
                  <DataColumn header="Date Uploaded:">
                    <span>{job.dateUploaded}</span>
                  </DataColumn>
                  <DataColumn header="Total Applicants:">
                    <span>{job.seekersNumber}</span>
                  </DataColumn>
                </div>
                <div className="flex items-center gap-24">
                  <VerticalDividerIcon className="h-12 w-0.5 fill-none" />
                  <Popover data-slot="dropdown">
                    <PopoverButton>
                      <Ellipsis
                        size="24"
                        className="cursor-pointer text-neutral-500"
                      />
                    </PopoverButton>
                    <PopoverPanel
                      anchor="bottom end"
                      transition
                      className="original-top mt-2 rounded-sm border border-neutral-200 bg-white transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                    >
                      {({ close }) => (
                        <>
                          {deleteConfirmJobId === job.jobId && (
                            <DeleteJob
                              jobId={job.jobId}
                              onCancel={() => setDeleteConfirmJobId(0)}
                              close={close}
                            />
                          )}
                          {deleteConfirmJobId !== job.jobId && (
                            <DropdownOptions
                              options={JOB_DROPDOWN_OPTIONS}
                              jobId={job.jobId}
                            />
                          )}
                        </>
                      )}
                    </PopoverPanel>
                  </Popover>
                </div>
              </div>
            ))) || <NoJobs text="No jobs found. Let's make it happen!" />}
        </div>
      </div>
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Job"
        className={'h-5/6 w-3/5'}
        childrenClassName="p-0! h-[850px]"
      >
        <CreateJob />
      </Modal>
      <Modal
        open={editModalOpen !== 0}
        onClose={() => setEditModalOpen(0)}
        title="Edit Existing Job"
        className={'h-5/6 w-3/5'}
      >
        <EditJob />
      </Modal>
      <Modal
        open={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        title="Archive"
        className={'h-5/6 w-3/5'}
      >
        <ArchivedJobs />
      </Modal>
    </>
  );
}
