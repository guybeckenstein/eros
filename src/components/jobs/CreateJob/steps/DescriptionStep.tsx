import { InformationIcon } from '@/components/ui/icons';

import { useCreateJobContext } from '../useCreateJobContext';

export function DescriptionStep() {
  const { form } = useCreateJobContext();

  return (
    <section className="flex h-full flex-col">
      <form.AppField
        name="jobDescription"
        validators={{
          onChange: ({ value }) =>
            value.trim().length > 0
              ? undefined
              : 'Job description is required.',
          onSubmit: ({ value }) =>
            value.trim().length > 0
              ? undefined
              : 'Job description is required.',
        }}
        children={(field) => (
          <div className="flex h-full flex-col gap-1.75">
            <div className="flex items-center gap-2.75">
              <label className="text-base font-medium tracking-wide text-black">
                Job Description*
              </label>
              <InformationIcon
                size={20}
                strokeWidth={1.75}
                className="cursor-default"
              />
            </div>

            <field.TextArea
              aria-label="Job Description"
              placeholder="Enter job description"
              className="h-full min-h-161.5"
            />
          </div>
        )}
      />
    </section>
  );
}
