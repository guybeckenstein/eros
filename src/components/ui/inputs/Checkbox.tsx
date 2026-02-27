import * as React from 'react';
import { forwardRef } from 'react';

import { Field, Input as HeadlessInput, Label } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export type CheckboxProps = React.ComponentProps<'input'> & {
  label?: React.ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, wrapperClassName, labelClassName, ...props }, ref) => {
    return (
      <Field
        className={twMerge(
          'inline-flex items-center justify-start gap-2 self-stretch',
          wrapperClassName,
        )}
      >
        <HeadlessInput
          ref={ref}
          type="checkbox"
          className={twMerge(
            'h-4 w-4 rounded border-2 border-black text-black outline-0 transition-colors',
            '[&:checked]:border-black [&:checked]:bg-black',
            className,
          )}
          {...props}
        />
        {label && (
          <Label
            className={twMerge(
              'text-base tracking-wide text-black',
              labelClassName,
            )}
          >
            {label}
          </Label>
        )}
      </Field>
    );
  },
);
