import type { TextareaHTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

import { useFieldContext } from '@/components/hooks/form-context';

interface FormTextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'onChange'
> {
  label?: string;
  required?: boolean;
  labelClassName?: string;
}

export function FormTextArea({
  label,
  required,
  className,
  labelClassName,
  ...props
}: FormTextAreaProps) {
  const field = useFieldContext<string>();
  const error = field.state.meta.errors[0];
  const errorMessage =
    typeof error === 'string' ? error : error ? 'Invalid value' : '';

  return (
    <div className="flex flex-col gap-2 self-stretch">
      {label ? (
        <label
          className={twMerge(
            'text-base font-medium tracking-wide text-black',
            labelClassName,
          )}
        >
          {label}
          {required ? '*' : ''}
        </label>
      ) : null}

      <textarea
        {...props}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        className={twMerge(
          'h-full min-h-161.5 w-full resize-none rounded-lg border border-black p-2.5 text-lg tracking-wide text-black outline-none placeholder:text-[#B5B5B5]',
          errorMessage && 'border-red-500',
          className,
        )}
      />

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
