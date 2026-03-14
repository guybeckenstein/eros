import { useCreateJobContext } from '../useCreateJobContext';

export function JobDetailsStep() {
  const { form } = useCreateJobContext();

  return (
    <section className="flex flex-col gap-9.5">
      <form.AppField
        name="jobTitle"
        children={(field) => (
          <field.TextField placeholder="Type here" label="Job Title" />
        )}
      />

      <form.AppField
        name="yearsExperience"
        children={(field) => (
          <field.RangeSlider
            label="Years of Experience"
            min={0}
            max={10}
            step={1}
          />
        )}
      />

      <form.AppField
        name="location"
        children={(field) => (
          <field.TextField placeholder="Type here" label="Location" />
        )}
      />

      {/* Employment Type checkboxes */}
      <div className="flex flex-col gap-2">
        <span className="font-medium">Employment Type</span>
        <div className="flex flex-col gap-2 pl-2">
          <form.AppField
            name="employmentFullTime"
            children={(field) => <field.Checkbox label="Full-time" />}
          />
          <form.AppField
            name="employmentPartTime"
            children={(field) => <field.Checkbox label="Part-time" />}
          />
          <form.AppField
            name="employmentContract"
            children={(field) => <field.Checkbox label="Contract" />}
          />
          <form.AppField
            name="employmentInternship"
            children={(field) => <field.Checkbox label="Internship" />}
          />
        </div>
      </div>

      {/* Start Time checkboxes */}
      <div className="flex flex-col gap-2">
        <span className="font-medium">Start Time</span>
        <div className="flex flex-col gap-2 pl-2">
          <form.AppField
            name="startImmediate"
            children={(field) => <field.Checkbox label="Immediate start" />}
          />
          <form.AppField
            name="startWithinMonth"
            children={(field) => <field.Checkbox label="Within a month" />}
          />
          <form.AppField
            name="startWithinThreeMonths"
            children={(field) => (
              <field.Checkbox label="Within the next 3 months" />
            )}
          />
        </div>
      </div>
      {/* Start Time checkboxes */}
      <div className="flex flex-col gap-2">
        <span className="font-medium">Work Place*</span>
        <div className="flex flex-col gap-2 pl-2">
          <form.AppField
            name="workPlaceOnSite"
            validators={{
              onChange: ({ fieldApi }) => {
                const hasWorkPlaceSelection =
                  Boolean(fieldApi.form.getFieldValue('workPlaceOnSite')) ||
                  Boolean(fieldApi.form.getFieldValue('workPlaceHybrid')) ||
                  Boolean(fieldApi.form.getFieldValue('workPlaceRemote')) ||
                  Boolean(fieldApi.form.getFieldValue('workPlaceInternship'));

                return hasWorkPlaceSelection
                  ? undefined
                  : 'Please select at least one workplace option.';
              },
              onChangeListenTo: [
                'workPlaceHybrid',
                'workPlaceRemote',
                'workPlaceInternship',
              ],
              onSubmit: ({ fieldApi }) => {
                const hasWorkPlaceSelection =
                  Boolean(fieldApi.form.getFieldValue('workPlaceOnSite')) ||
                  Boolean(fieldApi.form.getFieldValue('workPlaceHybrid')) ||
                  Boolean(fieldApi.form.getFieldValue('workPlaceRemote')) ||
                  Boolean(fieldApi.form.getFieldValue('workPlaceInternship'));

                return hasWorkPlaceSelection
                  ? undefined
                  : 'Please select at least one workplace option.';
              },
            }}
            children={(field) => <field.Checkbox label="On-Site" />}
          />
          <form.AppField
            name="workPlaceHybrid"
            children={(field) => <field.Checkbox label="Hybrid" />}
          />
          <form.AppField
            name="workPlaceRemote"
            children={(field) => <field.Checkbox label="Remote" />}
          />
          <form.AppField
            name="workPlaceInternship"
            children={(field) => <field.Checkbox label="Internship" />}
          />

          <form.AppField
            name="workPlaceOnSite"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const errorMessage =
                typeof error === 'string'
                  ? error
                  : error
                    ? 'Invalid value'
                    : '';

              return errorMessage ? (
                <p className="text-sm text-red-600">{errorMessage}</p>
              ) : null;
            }}
          />
        </div>
      </div>
      <form.AppField
        name="salary"
        children={(field) => (
          <field.TextField
            placeholder="e.g 10,000 NIS"
            label="Salary (up to)"
          />
        )}
      />
    </section>
  );
}
