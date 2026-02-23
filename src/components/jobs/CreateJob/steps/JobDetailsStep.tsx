import { useAppForm } from '@/components/hooks/useAppForm';
import { RangeSlider, TextField } from '@/components/ui/inputs';

export function JobDetailsStep() {
  const form = useAppForm({});

  return (
    <form className="flex flex-col gap-6">
      <form.AppField
        name="jobTitle"
        children={(field) => <field.TextField label="Job Title" />}
      />
      <RangeSlider label="Experience Level" min={0} max={10} step={1} />
      <TextField label="Location" required />
      <TextField label="Employment Type" required />
    </form>
  );
}
