import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { TextField } from '@radix-ui/themes';
import { Root, Slot } from '@radix-ui/themes/components/text-field';
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
import DATE_OPTIONS from '@/shared/configurations/configuration';
import RecruiterJobItem from '@/shared/types/recruiter';
import { supabase } from '@/utils/supabase';

type JobSearch = {
  text: string;
  sort: 'Date' | 'Name' | 'Status';
};

export const Route = createFileRoute('/recruiter/jobs')({
  validateSearch: (search: Record<string, unknown>): JobSearch => {
    return {
      text: (search.text as string) || '',
      sort: (search.sort as JobSearch['sort']) || 'Date',
    };
  },
  loaderDeps: ({ search: { text, sort } }: { search: JobSearch }) => ({
    text,
    sort,
  }),
  loader: async ({ deps }) => {
    const { text, sort } = deps;
    const query = supabase.from('jobs').select(`
        job_id, 
        date_uploaded, 
        is_active, 
        job_titles_ref!inner (title),
        job_seeker_status(count)
        `);

    if (text) {
      query.ilike('job_titles_ref.title', `%${deps.text}%`);
    }

    if (sort === 'Name') {
      query.order('title', {
        referencedTable: 'job_titles_ref',
        ascending: true,
      });
    } else if (sort === 'Status') {
      query.order('is_active', { ascending: false });
    } else {
      query.order('date_uploaded', { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return { data: data as unknown as RecruiterJobItem[] };
  },
  component: JobsPage,
});

function JobsPage() {
  const { text, sort } = Route.useSearch();
  const { data } = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

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
          <TextField.Root
            placeholder="Search jobs..."
            value={text}
            onChange={(e) => {
              navigate({
                search: (prev) => ({ ...prev, text: e.target.value }),
              });
            }}
            className="relative flex w-96 items-center gap-2 rounded-md border border-neutral-900 bg-white px-8 py-3 text-base font-medium transition-colors hover:bg-neutral-50"
          >
            <TextField.Slot>
              <Search
                size="18"
                className="absolute top-1/2 left-2 -translate-y-1/2 text-neutral-400"
              />
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
                <Ellipsis
                  size="24"
                  className="cursor-pointer text-neutral-500"
                  onClick={() =>
                    console.log(
                      `TODO: add edit and delete ${job.job_titles_ref.title}. URL: https://itzikmish135.atlassian.net/browse/EROS-61`,
                    )
                  }
                />
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
