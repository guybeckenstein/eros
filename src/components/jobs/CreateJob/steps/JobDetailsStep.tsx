import { useAppForm } from '@/components/hooks/useAppForm';
import { RangeSlider, TextField } from '@/components/ui/inputs';

export function JobDetailsStep() {
  const form = useAppForm({});

  return (
    <form className="flex flex-col gap-9.5">
      <form.AppField
        name="jobTitle"
        children={(field) => <field.TextField label="Job Title" />}
      />
      <RangeSlider label="Yers of Experience" min={0} max={10} step={1} />
      <form.AppField
        name="location"
        children={(field) => <field.TextField label="Location" />}
      />
    </form>
  );
}
