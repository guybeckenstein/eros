import { useAppForm } from '@/components/hooks/useAppForm';
import { InformationIcon } from '@/components/ui/icons';

export function DescriptionStep() {
  const form = useAppForm({
    defaultValues: {
      jobDescription: '',
    },
  });

  return (
    <form className="flex h-full flex-col">
      <form.AppField
        name="jobDescription"
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

            <textarea
              aria-label="Job Description"
              className="h-full min-h-161.5 w-full resize-none rounded-lg border border-black p-2.5 text-lg tracking-wide text-black outline-none placeholder:text-[#B5B5B5]"
              placeholder="Enter job description"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </div>
        )}
      />
    </form>
  );
}
