import { useState } from 'react';

import { useAppForm } from '@/components/hooks/useAppForm';
import { Toggle } from '@/components/ui/inputs';

export function RequirementsStep() {
  const form = useAppForm({});
  const [educationEnabled, setEducationEnabled] = useState(false);

  return (
    <form className="flex flex-col gap-9.5">
      {/* skills input */}
      <form.AppField
        name="skills"
        children={(field) => (
          <field.TextField label="Skills & Tools" placeholder="+ Add Skill" />
        )}
      />

      {/* languages input */}
      <form.AppField
        name="languages"
        children={(field) => (
          <field.TextField label="Language" placeholder="+ Add Language" />
        )}
      />

      {/* education toggle */}
      <div className="flex items-center gap-2">
        <Toggle
          checked={educationEnabled}
          onChange={setEducationEnabled}
          label="Education"
        />
      </div>

      {educationEnabled && (
        <>
          {/* education type */}
          <div className="flex flex-col gap-2">
            <span className="font-medium">Education Type</span>
            <div className="flex flex-col gap-2 pl-2">
              <form.AppField
                name="degreeBs"
                children={(field) => (
                  <field.Checkbox label="Bachelor of Science (B.S)" />
                )}
              />
              <form.AppField
                name="degreeBa"
                children={(field) => (
                  <field.Checkbox label="Bachelor of Art (B.A)" />
                )}
              />
            </div>
          </div>

          {/* educational level */}
          <div className="flex flex-col gap-2">
            <span className="font-medium">Educational Level</span>
            <div className="flex flex-col gap-2 pl-2">
              <form.AppField
                name="levelBachelor"
                children={(field) => (
                  <field.Checkbox label="Bachelor's degree" />
                )}
              />
              <form.AppField
                name="levelMaster"
                children={(field) => <field.Checkbox label="Master's degree" />}
              />
              <form.AppField
                name="levelDoctoral"
                children={(field) => <field.Checkbox label="Doctoral" />}
              />
            </div>
          </div>

          {/* institution */}
          <div className="flex flex-col gap-2">
            <span className="font-medium">Educational Institution</span>
            <div className="flex flex-col gap-2 pl-2">
              <form.AppField
                name="instUniversity"
                children={(field) => <field.Checkbox label="University" />}
              />
              <form.AppField
                name="instCollege"
                children={(field) => <field.Checkbox label="College" />}
              />
              <form.AppField
                name="instOther"
                children={(field) => <field.Checkbox label="Other" />}
              />
            </div>
          </div>
        </>
      )}
    </form>
  );
}
