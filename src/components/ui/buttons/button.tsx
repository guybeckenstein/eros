import { Button as HeadlessButton } from '@headlessui/react';

import { classNames } from '@/helpers/functions';

type ButtonProps = React.ComponentProps<typeof HeadlessButton> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;

  children: React.ReactNode;
};

export function Button({
  className,
  startIcon,
  endIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <HeadlessButton
      className={classNames(
        className,
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#222222] px-5 py-2.25 text-white',
      )}
      {...props}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </HeadlessButton>
  );
}
