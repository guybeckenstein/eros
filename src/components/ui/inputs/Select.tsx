import { forwardRef } from 'react';

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface Option {
  value: string;
  label: string | React.ReactNode;
}

export type SelectProps = React.ComponentProps<'select'> & {
  options: Option[];
  dropdownClassName?: string;
  inputClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      dropdownClassName,
      inputClassName,
      value,
      onChange,
      options,
      prefix,
      suffix,
    },
    ref,
  ) => {
    const optionsSize = options.length;
    return (
      <Listbox
        as="div"
        className={className}
        value={value}
        onChange={onChange}
        ref={ref}
      >
        <ListboxButton
          className={twMerge(
            'flex w-full cursor-pointer items-center justify-between rounded-lg px-6 py-2.5 outline-1 -outline-offset-1 outline-black',
            inputClassName,
          )}
        >
          {({ open }) => (
            <>
              <div>
                {prefix}
                {value}
                {suffix}
              </div>
              <ChevronDownIcon
                className={twMerge(
                  'transition-transform duration-400',
                  open && 'rotate-180',
                )}
              />
            </>
          )}
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className={twMerge(
            'z-50 mt-2 w-(--button-width) self-stretch rounded-lg bg-white p-6 shadow-[0px_4px_15px_1px_rgba(0,0,0,0.09)] outline-none',
            dropdownClassName,
          )}
        >
          {options.map((option, index) => (
            <div>
              <ListboxOption
                key={option.value}
                value={option.value}
                className="cursor-pointer rounded-md px-4 py-2 hover:bg-zinc-200"
              >
                {option.label}
              </ListboxOption>
              {index < optionsSize - 1 && (
                <div className="my-2.5 h-0.5 self-stretch bg-zinc-100"></div>
              )}
            </div>
          ))}
        </ListboxOptions>
      </Listbox>
    );
  },
);
