import * as React from 'react';

import {
  Popover as HeadlessPopover,
  PopoverButton as HeadlessPopoverButton,
  PopoverPanel as HeadlessPopoverPanel,
} from '@headlessui/react';

import { cn } from '@/lib/utils';

type PopoverProps = React.ComponentProps<typeof HeadlessPopover> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  wrapperClassName?: string;
  optionList?: OptionListItem[];
};

type PopoverButtonProps = React.ComponentProps<typeof HeadlessPopoverButton> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  wrapperClassName?: string;
};

type PopoverPanelProps = React.ComponentProps<typeof HeadlessPopoverPanel> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  wrapperClassName?: string;
};

type OptionListItem = {
  startIcon?: React.ReactNode;
  label: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
};

export function MyDropdown({
  className,
  startIcon,
  endIcon,
  wrapperClassName,
  optionList,
  ...props
}: PopoverProps) {
  return (
    <div className={cn('relative w-full', wrapperClassName)}>
      {startIcon ? (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400">
          {startIcon}
        </span>
      ) : null}
      <HeadlessPopover data-slot="dropdown" className="relative" {...props}>
        <HeadlessPopoverButton>Solutions</HeadlessPopoverButton>
        <HeadlessPopoverPanel anchor="bottom" className="flex flex-col">
          {optionList !== undefined
            ? optionList.map((item) => (
                <div className="flex">
                  {item.startIcon ? (
                    <span className="pointer-events-none text-neutral-900">
                      {item.startIcon}
                    </span>
                  ) : null}
                  <div onClick={item.onClick}>{item.label}</div>
                </div>
              ))
            : null}
        </HeadlessPopoverPanel>
      </HeadlessPopover>
      {endIcon ? (
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400">
          {endIcon}
        </span>
      ) : null}
    </div>
  );
}
