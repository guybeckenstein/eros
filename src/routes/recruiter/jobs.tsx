import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useDeferredValue, useEffect, useState } from 'react';

import { TextField } from '@radix-ui/themes';
import {
  Archive,
  BriefcaseBusiness,
  Ellipsis,
  Plus,
  Search,
} from 'lucide-react';

import { VerticalDividerIcon } from '@/assets/icons/VerticalDividerIcon';
import { ClickableButton } from '@/components/buttons/ClickableButton';
import { Dropdown } from '@/components/buttons/DropdownButton';
import { StatusButton } from '@/components/buttons/StatusButton';
import { Input } from '@/components/ui/form/Input';
import { jobsQueryOptions } from '@/server/jobs-queries';
import DATE_OPTIONS from '@/shared/configurations/configuration';
import JobSearch from '@/shared/types/jobs';

export const Route = createFileRoute('/recruiter/jobs')({
  validateSearch: (search: Record<string, unknown>): JobSearch => {
    return {
      text: (search.text as string) || '',
      sort: search.sort as JobSearch['sort'],
    };
  },
  loaderDeps: ({ search }: { search: JobSearch }) => ({ search }),
  loader: async ({ context: { queryClient }, deps: { search } }) =>
    queryClient.ensureQueryData(jobsQueryOptions(search)),
  component: JobsPage,
});

function JobsPage() {
  const { text, sort } = Route.useSearch();
  const { data } = useSuspenseQuery(jobsQueryOptions({ text, sort }));
  const navigate = useNavigate({ from: Route.fullPath });
  const [searchValue, setSearchValue] = useState(text);

  const deferredSearchValue = useDeferredValue(searchValue);

  useEffect(() => {
    setSearchValue(text);
  }, [text]);

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

  const handleSort = (
    newText: JobSearch['text'],
    newSort: JobSearch['sort'],
  ) => {
    if (newText === text && newSort === sort) return; // Skip if already selected
    navigate({
      search: (prev) => ({ ...prev, text: newText, sort: newSort }),
    });
  };

  return (
    <div className="flex-col">
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Input
            value={deferredSearchValue}
            placeholder="Search jobs..."
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-96 rounded-full border p-2"
          />
          <TextField.Root
            placeholder="Search jobs..."
            value={deferredSearchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            radius="large"
            className="h-full w-96"
          >
            <TextField.Slot gap={'9'}>
              <Search size="18" />
            </TextField.Slot>
          </TextField.Root>
          <Dropdown label={`Sort by: ${sort}`}>
            <Dropdown.Item onClick={() => handleSort(text, 'Date')}>
              Sort by: Date
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort(text, 'Name')}>
              Sort by: Name
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort(text, 'Status')}>
              Sort by: Status
            </Dropdown.Item>
          </Dropdown>
        </div>
        <div className="flex items-center gap-4">
          <ClickableButton
            onClick={() =>
              console.log(
                'TODO: add popup for adding new job. URL: https://itzikmish135.atlassian.net/browse/EROS-55',
              )
            }
            label="Add New Job"
            svgIcon={<Plus size="24" className="text-white" />}
          />
          <Archive
            size="24"
            className="cursor-pointer text-neutral-900 transition-colors hover:text-neutral-600"
            onClick={() =>
              console.log(
                'TODO: add archive functionality for jobs. URL: https://itzikmish135.atlassian.net/browse/EROS-57',
              )
            }
          />
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {data.length > 0 ? (
          data.map((job) => (
            <div
              key={job.job_id}
              className="grid grid-cols-[0.75fr_2.5fr_max-content] items-center rounded-md border bg-white px-7 py-9"
            >
              <div className="flex items-center gap-4">
                <BriefcaseBusiness size="22" className="mt-1" />
                <h2 className="text-2xl font-bold text-neutral-900">
                  {job.job_titles_ref.title}
                </h2>
              </div>
              <div className="flex gap-16">
                <div>
                  <h3 className="mb-2 text-xl font-medium text-neutral-900">
                    Status:
                  </h3>
                  <StatusButton isActive={job.is_active} />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-medium text-neutral-900">
                    Date Uploaded:
                  </h3>
                  <p className="font-medium text-neutral-900">
                    {new Date(job.date_uploaded).toLocaleDateString(
                      'en-IL',
                      DATE_OPTIONS,
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-medium text-neutral-900">
                    Total Applicants:
                  </h3>
                  <p className="font-medium text-neutral-900">
                    {job.job_seeker_status[0]?.count ?? 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-24">
                <VerticalDividerIcon className="h-12 w-0.5 fill-none" />
                <div className="relative">
                  <Ellipsis
                    size="24"
                    className="cursor-pointer text-neutral-500"
                    onClick={() =>
                      console.log(
                        `TODO: add edit and delete ${job.job_titles_ref.title}. URL: https://itzikmish135.atlassian.net/browse/EROS-61`,
                      )
                    }
                  />

                  <Dropdown label="">
                    <Dropdown.Item onClick={() => handleSort(text, 'Date')}>
                      Sort by: Date
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSort(text, 'Name')}>
                      Sort by: Name
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSort(text, 'Status')}>
                      Sort by: Status
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-20 flex-col justify-items-center space-y-8 self-center">
            <svg
              width="204"
              height="204"
              viewBox="0 0 204 204"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="102" cy="102" r="102" fill="#E0E0E0"></circle>

              <rect x="59" y="59" width="86" height="86" fill="#BDBDBD"></rect>

              <polygon
                points="70,135 85,110 100,135"
                fill="rgb(235, 235, 235)"
              ></polygon>

              <polygon
                points="92,135 112,101.4 132,135"
                fill="rgb(235, 235, 235)"
              ></polygon>
            </svg>
            <p className="text-center text-3xl font-bold text-neutral-400">
              No jobs found. Let's make it happen!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
