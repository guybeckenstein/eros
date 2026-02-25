import * as React from 'react';
import { forwardRef } from 'react';

import { Field, Input as HeadlessInput, Label } from '@headlessui/react';
// import { cn } from '@/lib/utils';
import { twMerge } from 'tailwind-merge';

export type TextFieldProps = React.ComponentProps<'input'> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fieldClassName?: string;
  wrapperClassName?: string;
  label?: string;
  required?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      startIcon,
      endIcon,
      fieldClassName,
      wrapperClassName,
      label,
      required,
      ...props
    },
    ref,
  ) => {
    return (
      <Field
        className={twMerge(
          'inline-flex flex-col items-start justify-start gap-2 self-stretch',
          fieldClassName,
        )}
      >
        <Label className="justify-start text-base font-semibold tracking-wide text-black">
          {label}
          {required && '*'}
        </Label>
        <div
          className={twMerge(
            'inline-flex items-center justify-start gap-1.5 self-stretch rounded-md p-2.5 outline-1 -outline-offset-1 outline-black',
            wrapperClassName,
          )}
        >
          {startIcon}
          <HeadlessInput
            ref={ref}
            className={twMerge('flex-1 self-stretch outline-0', className)}
            {...props}
          />
          {endIcon}
        </div>
      </Field>
    );
  },
);
