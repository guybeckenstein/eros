import { createFileRoute } from '@tanstack/react-router';

import { Archive, Plus } from 'lucide-react';

import { ClickableButton } from '@/components/buttons/ClickableButton';
import { Dropdown } from '@/components/buttons/DropdownButton';
import { supabase } from '@/utils/supabase';

export const Route = createFileRoute('/recruiter/jobs')({
  loader: async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('job_id, date_uploaded, is_active, job_titles_ref (title)')
      .eq('is_active', true);

    if (error) {
      throw error;
    } else {
      return { data: data.length ? data : [] };
    }
  },
  component: JobsPage,
});

function JobsPage() {
  const { data } = Route.useLoaderData();

  return (
    <div className="flex-col">
      <div className="mt-4 flex justify-between">
        <div className="flex">
          <Dropdown label="Sort by: Default">
            <Dropdown.Item
              onClick={
                () => console.log('Sort by Status clicked')
                // TODO: get the sorted actual jobs from the supabase backend
              }
            >
              Sort by: Status
            </Dropdown.Item>
            <Dropdown.Item
              onClick={
                () => console.log('Sort by Date clicked')
                // TODO: get the sorted actual jobs from the supabase backend
              }
            >
              Sort by: Date
            </Dropdown.Item>
          </Dropdown>
        </div>
        <div className="flex items-center gap-4">
          <ClickableButton
            onClick={
              () => console.log('Add New Job clicked')
              // TODO: open dialog
            }
            label="Add New Job"
            svgIcon={<Plus size="24" className="text-white" />}
          />
          <Archive
            size="24"
            className="cursor-pointer text-neutral-900 transition-colors hover:text-neutral-600"
            onClick={() => console.log('Archive clicked')}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {data.length > 0 ? (
          data.map((job) => (
            <div
              key={job.job_id}
              className="flex items-center justify-between rounded-md border bg-white px-4 py-3"
            >
              <div>
                <h2 className="text-lg font-medium">
                  {job.job_titles_ref.title}
                </h2>
                <p className="text-sm text-neutral-500">
                  Uploaded on:{' '}
                  {new Date(job.date_uploaded).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => console.log(`Edit job ${job.job_id} clicked`)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() =>
                    console.log(`Delete job ${job.job_id} clicked`)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-neutral-500">No active jobs found.</p>
        )}
      </div>
    </div>
  );
}
