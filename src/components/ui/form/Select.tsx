import { twMerge } from 'tailwind-merge';

import { useFieldContext } from '@/components/hooks/form-context';

import { Select, SelectProps } from '../inputs';

export function FormSelect(props: SelectProps) {
  const field = useFieldContext<string>();
  const error = field.state.meta.errors[0];
  const errorMessage =
    typeof error === 'string' ? error : error ? 'Invalid value' : '';

  return (
    <div className="flex flex-col gap-1.5 self-stretch">
      <Select
        {...props}
        value={field.state.value ?? ''}
        inputClassName={twMerge(
          props.inputClassName,
          errorMessage && 'outline-red-500',
        )}
        onChange={(value) => {
          let newValue: string;
          if (typeof value === 'string') {
            newValue = value;
          } else if (value && typeof value === 'object' && 'target' in value) {
            newValue = value.target.value;
          } else {
            newValue = '';
          }
          field.handleChange(newValue);
          // Call props.onChange with the normalized value if expected, otherwise skip
          if (props.onChange) {
            props.onChange(newValue);
          }
        }}
      />

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
