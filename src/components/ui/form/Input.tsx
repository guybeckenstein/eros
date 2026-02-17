import * as React from 'react';
import { forwardRef } from 'react';

import { Input as HeadlessInput } from '@headlessui/react';

// import { cn } from '@/lib/utils';
import { classNames } from '@/helpers/functions';

type InputProps = React.ComponentProps<'input'> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  wrapperClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, startIcon, endIcon, wrapperClassName, ...props }, ref) => {
    return (
      <div
        className={classNames(
          'inline-flex items-center justify-start gap-1.5 self-stretch rounded-md p-2.5 outline-1 -outline-offset-1 outline-black',
          wrapperClassName,
        )}
      >
        {startIcon}
        <HeadlessInput
          ref={ref}
          className={classNames('flex-1 self-stretch outline-0', className)}
          {...props}
        />
        {endIcon}
      </div>
    );
  },
);
