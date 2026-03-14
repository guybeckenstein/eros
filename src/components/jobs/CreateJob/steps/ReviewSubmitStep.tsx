import { useState } from 'react';
import type { ComponentType, ReactNode } from 'react';

import {
  ClipboardList,
  FileText,
  ListChecks,
  Pencil,
  Users,
} from 'lucide-react';

import { useCreateJobContext } from '../useCreateJobContext';

interface SummarySectionProps {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}

interface ActionProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
}

interface EditableTextRowProps {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  multiline?: boolean;
}

interface EditableListRowProps {
  label: string;
  values: string[];
  onChange: (nextValues: string[]) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  placeholder?: string;
}

type BooleanFieldName =
  | 'employmentFullTime'
  | 'employmentPartTime'
  | 'employmentContract'
  | 'employmentInternship'
  | 'startImmediate'
  | 'startWithinMonth'
  | 'startWithinThreeMonths'
  | 'workPlaceOnSite'
  | 'workPlaceHybrid'
  | 'workPlaceRemote'
  | 'workPlaceInternship'
  | 'degreeBs'
  | 'degreeBa'
  | 'levelBachelor'
  | 'levelMaster'
  | 'levelDoctoral'
  | 'instUniversity'
  | 'instCollege'
  | 'instOther';

interface BooleanOption {
  name: BooleanFieldName;
  label: string;
}

interface EditableBooleanOptionsRowProps {
  label: string;
  options: BooleanOption[];
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
}

function RowAction({ isEditing, onEdit, onSave }: ActionProps) {
  if (isEditing) {
    return (
      <button
        type="button"
        onClick={onSave}
        className="text-xl tracking-[0.6px] text-black underline decoration-black underline-offset-3"
      >
        Save
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Edit field"
      onClick={onEdit}
      className="grid size-7 place-content-center rounded-md text-black transition hover:bg-[#F5F5F5]"
    >
      <Pencil size={18} strokeWidth={1.9} />
    </button>
  );
}

function EditableTextRow({
  label,
  value,
  onChange,
  isEditing,
  onEdit,
  onSave,
  multiline = false,
}: EditableTextRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-1 flex-col gap-3">
        <p className="text-base leading-none font-medium tracking-[0.64px] text-black">
          {label}
        </p>

        {isEditing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="min-h-28 w-full resize-none rounded-lg border border-black p-3 text-lg tracking-[0.72px] text-black outline-none"
            />
          ) : (
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="h-11 w-full rounded-lg border border-black px-3.5 text-lg tracking-[0.72px] text-black outline-none"
            />
          )
        ) : (
          <p className="text-lg leading-none font-medium tracking-[0.72px] text-black">
            {value || '-'}
          </p>
        )}
      </div>

      <RowAction isEditing={isEditing} onEdit={onEdit} onSave={onSave} />
    </div>
  );
}

function EditableListRow({
  label,
  values,
  onChange,
  isEditing,
  onEdit,
  onSave,
  placeholder = 'Comma separated values',
}: EditableListRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-1 flex-col gap-3">
        <p className="text-base leading-none font-medium tracking-[0.64px] text-black">
          {label}
        </p>

        {isEditing ? (
          <input
            value={values.join(', ')}
            placeholder={placeholder}
            onChange={(event) => {
              const next = event.target.value
                .split(',')
                .map((entry) => entry.trim())
                .filter(Boolean);
              onChange(next);
            }}
            className="h-11 w-full rounded-lg border border-black px-3.5 text-lg tracking-[0.72px] text-black outline-none placeholder:text-[#9CA3AF]"
          />
        ) : (
          <div className="flex flex-wrap items-center gap-2.5">
            {values.length === 0 ? (
              <p className="text-lg leading-none font-medium tracking-[0.72px] text-black">
                -
              </p>
            ) : (
              values.map((entry) => (
                <SkillTag key={`${label}-${entry}`} value={entry} />
              ))
            )}
          </div>
        )}
      </div>

      <RowAction isEditing={isEditing} onEdit={onEdit} onSave={onSave} />
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-[#DEDEDE]" />;
}

function SkillTag({ value }: { value: string }) {
  return (
    <span className="rounded-full border border-[#BDBDBD] bg-[#F0F0F0] px-3 py-1 text-sm font-medium tracking-[0.56px] text-black">
      {value}
    </span>
  );
}

function SummarySection({ title, icon: Icon, children }: SummarySectionProps) {
  return (
    <section className="overflow-hidden rounded-[7px] border border-[#DEDEDE] bg-white">
      <header className="flex items-center gap-2 px-11 py-8">
        <Icon className="size-6 text-black" />
        <h3 className="text-xl leading-none font-medium tracking-[0.8px] text-black">
          {title}
        </h3>
      </header>
      <div className="border-t border-[#DEDEDE] px-11 py-4">{children}</div>
    </section>
  );
}

function EditableBooleanOptionsRow({
  label,
  options,
  isEditing,
  onEdit,
  onSave,
}: EditableBooleanOptionsRowProps) {
  const { form } = useCreateJobContext();

  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-1 flex-col gap-3">
        <p className="text-base leading-none font-medium tracking-[0.64px] text-black">
          {label}
        </p>

        <div className="grid gap-2 md:grid-cols-2">
          {options.map((option) => (
            <form.AppField
              key={`${label}-${option.name}`}
              name={option.name}
              children={(field) => (
                <label className="inline-flex items-center gap-2 text-lg tracking-[0.72px] text-black">
                  <input
                    type="checkbox"
                    checked={Boolean(field.state.value)}
                    disabled={!isEditing}
                    onChange={(event) =>
                      field.handleChange(event.target.checked)
                    }
                    className="size-5 accent-black disabled:cursor-not-allowed disabled:opacity-70"
                  />
                  {option.label}
                </label>
              )}
            />
          ))}
        </div>
      </div>

      <RowAction isEditing={isEditing} onEdit={onEdit} onSave={onSave} />
    </div>
  );
}

function toTagValues(value: unknown) {
  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function ReviewSubmitStep() {
  const { form, stages } = useCreateJobContext();
  const [editing, setEditing] = useState<Record<string, boolean>>({});

  const setEditMode = (key: string, value: boolean) => {
    setEditing((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isEditing = (key: string) => Boolean(editing[key]);

  return (
    <div className="flex flex-col gap-7.5 px-px">
      <p className="text-xl leading-normal tracking-[0.8px] text-black">
        This is a summary of all the steps in filling the position. You can
        review the details and edit them if necessary.
      </p>

      <SummarySection title="Job Details" icon={ClipboardList}>
        <form.AppField
          name="jobTitle"
          children={(field) => (
            <EditableTextRow
              label="Job Title"
              value={String(field.state.value ?? '')}
              onChange={(nextValue) => field.handleChange(nextValue)}
              isEditing={isEditing('jobTitle')}
              onEdit={() => setEditMode('jobTitle', true)}
              onSave={() => setEditMode('jobTitle', false)}
            />
          )}
        />
        <Divider />

        <form.AppField
          name="yearsExperience"
          children={(field) => {
            const [minYears, maxYears] = (field.state.value as [
              number,
              number,
            ]) ?? [0, 0];

            return (
              <div className="flex items-start justify-between gap-4 py-3">
                <div className="flex flex-1 flex-col gap-3">
                  <p className="text-base leading-none font-medium tracking-[0.64px] text-black">
                    Years of Experience
                  </p>

                  {isEditing('yearsExperience') ? (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={minYears}
                        onChange={(event) =>
                          field.handleChange([
                            Number(event.target.value),
                            Math.max(Number(event.target.value), maxYears),
                          ])
                        }
                        className="h-11 w-full rounded-lg border border-black px-3.5 text-lg tracking-[0.72px] text-black outline-none"
                      />
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={maxYears}
                        onChange={(event) =>
                          field.handleChange([
                            Math.min(minYears, Number(event.target.value)),
                            Number(event.target.value),
                          ])
                        }
                        className="h-11 w-full rounded-lg border border-black px-3.5 text-lg tracking-[0.72px] text-black outline-none"
                      />
                    </div>
                  ) : (
                    <p className="text-lg leading-none font-medium tracking-[0.72px] text-black">
                      {minYears} - {maxYears} years
                    </p>
                  )}
                </div>

                <RowAction
                  isEditing={isEditing('yearsExperience')}
                  onEdit={() => setEditMode('yearsExperience', true)}
                  onSave={() => setEditMode('yearsExperience', false)}
                />
              </div>
            );
          }}
        />
        <Divider />

        <EditableBooleanOptionsRow
          label="Employment Type"
          options={[
            { name: 'employmentFullTime', label: 'Full-time' },
            { name: 'employmentPartTime', label: 'Part-time' },
            { name: 'employmentContract', label: 'Contract' },
            { name: 'employmentInternship', label: 'Internship' },
          ]}
          isEditing={isEditing('employmentType')}
          onEdit={() => setEditMode('employmentType', true)}
          onSave={() => setEditMode('employmentType', false)}
        />
        <Divider />

        <form.AppField
          name="location"
          children={(field) => (
            <EditableTextRow
              label="Location"
              value={String(field.state.value ?? '')}
              onChange={(nextValue) => field.handleChange(nextValue)}
              isEditing={isEditing('location')}
              onEdit={() => setEditMode('location', true)}
              onSave={() => setEditMode('location', false)}
            />
          )}
        />
        <Divider />

        <EditableBooleanOptionsRow
          label="Start Time"
          options={[
            { name: 'startImmediate', label: 'Immediate start' },
            { name: 'startWithinMonth', label: 'Within a month' },
            {
              name: 'startWithinThreeMonths',
              label: 'Within the next 3 months',
            },
          ]}
          isEditing={isEditing('startTime')}
          onEdit={() => setEditMode('startTime', true)}
          onSave={() => setEditMode('startTime', false)}
        />
        <Divider />

        <EditableBooleanOptionsRow
          label="Work Place"
          options={[
            { name: 'workPlaceOnSite', label: 'On-Site' },
            { name: 'workPlaceHybrid', label: 'Hybrid' },
            { name: 'workPlaceRemote', label: 'Remote' },
            { name: 'workPlaceInternship', label: 'Internship' },
          ]}
          isEditing={isEditing('workPlace')}
          onEdit={() => setEditMode('workPlace', true)}
          onSave={() => setEditMode('workPlace', false)}
        />
        <Divider />

        <form.AppField
          name="salary"
          children={(field) => (
            <EditableTextRow
              label="Salary (up to)"
              value={String(field.state.value ?? '')}
              onChange={(nextValue) => field.handleChange(nextValue)}
              isEditing={isEditing('salary')}
              onEdit={() => setEditMode('salary', true)}
              onSave={() => setEditMode('salary', false)}
            />
          )}
        />
      </SummarySection>

      <SummarySection title="Requirements" icon={ListChecks}>
        <form.AppField
          name="skills"
          children={(field) => (
            <EditableListRow
              label="Skills & Tools"
              values={toTagValues(field.state.value)}
              onChange={(nextValues) =>
                field.handleChange(nextValues.join(', '))
              }
              isEditing={isEditing('skills')}
              onEdit={() => setEditMode('skills', true)}
              onSave={() => setEditMode('skills', false)}
            />
          )}
        />
        <Divider />

        <form.AppField
          name="languages"
          children={(field) => (
            <EditableListRow
              label="Language"
              values={toTagValues(field.state.value)}
              onChange={(nextValues) =>
                field.handleChange(nextValues.join(', '))
              }
              isEditing={isEditing('languages')}
              onEdit={() => setEditMode('languages', true)}
              onSave={() => setEditMode('languages', false)}
            />
          )}
        />
        <Divider />

        <form.AppField
          name="educationEnabled"
          children={(field) => (
            <div className="flex items-start justify-between gap-4 py-3">
              <div className="flex flex-1 flex-col gap-3">
                <p className="text-base leading-none font-medium tracking-[0.64px] text-black">
                  Education
                </p>

                <label className="inline-flex items-center gap-2 text-lg tracking-[0.72px] text-black">
                  <input
                    type="checkbox"
                    checked={Boolean(field.state.value)}
                    onChange={(event) =>
                      field.handleChange(event.target.checked)
                    }
                    className="size-5 accent-black"
                  />
                  Require education
                </label>
              </div>
            </div>
          )}
        />
        <Divider />

        <EditableBooleanOptionsRow
          label="Education Type"
          options={[
            { name: 'degreeBs', label: 'Bachelor of Science (B.S)' },
            { name: 'degreeBa', label: 'Bachelor of Art (B.A)' },
          ]}
          isEditing={isEditing('educationType')}
          onEdit={() => setEditMode('educationType', true)}
          onSave={() => setEditMode('educationType', false)}
        />
        <Divider />

        <EditableBooleanOptionsRow
          label="Educational Level"
          options={[
            { name: 'levelBachelor', label: "Bachelor's degree" },
            { name: 'levelMaster', label: "Master's degree" },
            { name: 'levelDoctoral', label: 'Doctoral' },
          ]}
          isEditing={isEditing('educationLevel')}
          onEdit={() => setEditMode('educationLevel', true)}
          onSave={() => setEditMode('educationLevel', false)}
        />
        <Divider />

        <EditableBooleanOptionsRow
          label="Educational Institution"
          options={[
            { name: 'instUniversity', label: 'University' },
            { name: 'instCollege', label: 'College' },
            { name: 'instOther', label: 'Other' },
          ]}
          isEditing={isEditing('institution')}
          onEdit={() => setEditMode('institution', true)}
          onSave={() => setEditMode('institution', false)}
        />
      </SummarySection>

      <SummarySection title="Description" icon={FileText}>
        <form.AppField
          name="jobDescription"
          children={(field) => (
            <EditableTextRow
              label="Job Description"
              value={String(field.state.value ?? '')}
              onChange={(nextValue) => field.handleChange(nextValue)}
              isEditing={isEditing('description')}
              onEdit={() => setEditMode('description', true)}
              onSave={() => setEditMode('description', false)}
              multiline
            />
          )}
        />
      </SummarySection>

      <SummarySection title="Interview Stages" icon={Users}>
        <div className="flex flex-col gap-3 py-2">
          {stages.map((stage, index) => (
            <div key={stage.id}>
              <div className="flex items-start justify-between gap-4 rounded-lg border border-[#E5E7EB] p-4">
                <div className="grid flex-1 gap-2 md:grid-cols-2 md:gap-8">
                  <div className="flex flex-col gap-2">
                    <span className="text-base font-medium tracking-[0.64px] text-black">
                      {index + 1}. Interview Type
                    </span>
                    <form.AppField
                      name={`stage${stage.id}InterviewType` as any}
                      children={(field) =>
                        isEditing(`stage-${stage.id}`) ? (
                          <select
                            value={String(field.state.value ?? '')}
                            onChange={(event) =>
                              field.handleChange(event.target.value as any)
                            }
                            className="h-11 w-full rounded-lg border border-black px-3 text-lg tracking-[0.72px] text-black outline-none"
                          >
                            {[
                              { value: '', label: 'Choose type' },
                              {
                                value: 'Phone Screening',
                                label: 'Phone Screening',
                              },
                              {
                                value: 'Technical Interview',
                                label: 'Technical Interview',
                              },
                              {
                                value: 'Take Home Task',
                                label: 'Take Home Task',
                              },
                              { value: 'HR Interview', label: 'HR Interview' },
                            ].map((option) => (
                              <option
                                key={`${stage.id}-${option.value || 'empty'}`}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-lg font-medium tracking-[0.72px] text-black">
                            {String(field.state.value ?? '') || '-'}
                          </span>
                        )
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-base font-medium tracking-[0.64px] text-black">
                      Interviewer
                    </span>
                    <form.AppField
                      name={`stage${stage.id}Interviewer` as any}
                      children={(field) =>
                        isEditing(`stage-${stage.id}`) ? (
                          <input
                            value={String(field.state.value ?? '')}
                            onChange={(event) =>
                              field.handleChange(event.target.value as any)
                            }
                            className="h-11 w-full rounded-lg border border-black px-3 text-lg tracking-[0.72px] text-black outline-none"
                          />
                        ) : (
                          <span className="text-lg font-medium tracking-[0.72px] text-black">
                            {String(field.state.value ?? '') || '-'}
                          </span>
                        )
                      }
                    />
                  </div>
                </div>

                <RowAction
                  isEditing={isEditing(`stage-${stage.id}`)}
                  onEdit={() => setEditMode(`stage-${stage.id}`, true)}
                  onSave={() => setEditMode(`stage-${stage.id}`, false)}
                />
              </div>

              {index < stages.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </SummarySection>
    </div>
  );
}
