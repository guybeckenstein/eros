import * as React from 'react';
import { forwardRef } from 'react';

import {
  Field,
  Checkbox as HeadlessCheckbox,
  CheckboxProps as HeadlessCheckboxProps,
  Label,
} from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/16/solid';
import { twMerge } from 'tailwind-merge';

export type CheckboxProps = HeadlessCheckboxProps & {
  label?: React.ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
  setChecked?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      wrapperClassName,
      labelClassName,
      checked,
      setChecked,
      ...props
    },
    ref,
  ) => {
    // Ensure className is always a string or undefined for twMerge
    const resolvedClassName =
      typeof className === 'function' ? undefined : className;
    return (
      <Field
        className={twMerge(
          'inline-flex items-center justify-start gap-2 self-stretch',
          wrapperClassName,
        )}
      >
        <HeadlessCheckbox
          ref={ref}
          checked={checked}
          onChange={setChecked}
          className={twMerge(
            'group size-6 rounded-md bg-black/10 p-1 ring-1 ring-black/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-black data-focus:outline data-focus:outline-offset-2 data-focus:outline-black',
            resolvedClassName,
          )}
          {...props}
        >
          <CheckIcon className="hidden size-4 fill-white group-data-checked:block" />
        </HeadlessCheckbox>
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
