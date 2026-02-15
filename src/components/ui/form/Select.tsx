import { forwardRef } from 'react';

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

export interface Option {
  value: string;
  label: string | React.ReactNode;
}

type SelectProps = React.ComponentProps<'select'> & {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ value, onChange, options, prefix, suffix, ...props }, ref) => {
    return (
      <Listbox as="div" value={value} onChange={onChange} ref={ref}>
        <ListboxButton className="inline-flex items-center justify-between self-stretch rounded-lg px-6 py-2.5 outline-1 -outline-offset-1 outline-black">
          <span>
            {prefix}
            {value}
            {suffix}
          </span>
          <ChevronDownIcon className="data-active:hidden" />
          <ChevronUpIcon className="hidden data-open:block" />
        </ListboxButton>
        <ListboxOptions anchor="bottom">
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="data-focus:bg-blue-100"
            >
              {option.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    );
  },
);
