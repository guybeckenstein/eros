import { forwardRef } from 'react';

import {
  Field,
  Switch as HeadlessSwitch,
  SwitchProps as HeadlessSwitchProps,
  Label,
} from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export type ToggleProps = HeadlessSwitchProps & {
  wrapperClassName?: string;
  trackClassName?: string;
  thumbClassName?: string;
  label?: React.ReactNode;
  checked?: boolean;
  setChecked?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      wrapperClassName,
      trackClassName,
      thumbClassName,
      label,
      checked,
      setChecked,
      ...props
    },
    ref,
  ) => {
    return (
      <Field className={twMerge('flex gap-3', wrapperClassName)}>
        <HeadlessSwitch
          ref={ref}
          checked={checked}
          onChange={setChecked}
          className={twMerge(
            'group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-[#333333]',
            trackClassName,
          )}
          {...props}
        >
          <span
            className={twMerge(
              'size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6',
              thumbClassName,
            )}
          />
        </HeadlessSwitch>
        {label && <Label>{label}</Label>}
      </Field>
    );
  },
);
