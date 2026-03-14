import { twMerge } from 'tailwind-merge';

import { useFieldContext } from '@/components/hooks/form-context';

import { TextField, TextFieldProps } from '../inputs';

type FormTextFieldProps = TextFieldProps;

export function FormTextField(props: FormTextFieldProps) {
  const field = useFieldContext<string>();
  const error = field.state.meta.errors[0];
  const errorMessage =
    typeof error === 'string' ? error : error ? 'Invalid value' : '';

  return (
    <div className="flex flex-col gap-1.5 self-stretch">
      <TextField
        {...props}
        value={field.state.value ?? ''}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        wrapperClassName={twMerge(
          props.wrapperClassName,
          errorMessage && 'outline-red-500',
        )}
      />

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
