import { forwardRef } from 'react';

import { Select as HeadlessSelect } from '@headlessui/react';

import { classNames } from '@/helpers/functions';

export interface Option {
  value: string;
  label: string | React.ReactNode;
}

type SelectProps = React.ComponentProps<'select'> & {
  options: Option[];
};

export const SelectButton = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <div
        className={classNames(
          'inline-flex items-center justify-between self-stretch rounded-lg px-6 py-2.5 outline-1 -outline-offset-1 outline-black',
          className,
        )}
      >
        <HeadlessSelect {...props} ref={ref}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </HeadlessSelect>
      </div>
    );
  },
);
