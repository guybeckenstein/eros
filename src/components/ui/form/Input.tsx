import * as React from 'react';

import { Input as HeadlessInput } from '@headlessui/react';

import { cn } from '@/lib/utils';

type InputProps = React.ComponentProps<typeof HeadlessInput> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  wrapperClassName?: string;
};

export function Input({
  className,
  startIcon,
  endIcon,
  wrapperClassName,
  ...props
}: InputProps) {
  return (
    <div className={cn('relative w-full', wrapperClassName)}>
      {startIcon ? (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400">
          {startIcon}
        </span>
      ) : null}
      <HeadlessInput
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          startIcon ? 'pl-10' : null,
          endIcon ? 'pr-10' : null,
          className,
        )}
        {...props}
      />
      {endIcon ? (
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400">
          {endIcon}
        </span>
      ) : null}
    </div>
  );
}
