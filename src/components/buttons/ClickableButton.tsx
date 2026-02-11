import { ComponentProps, ReactNode } from 'react';

import { classNames } from '@/helpers/functions';

interface ClickableButtonProps extends ComponentProps<'button'> {
  label: string;
  svgIcon?: ReactNode;
}

export function ClickableButton({
  className,
  label,
  svgIcon,
  ...props
}: ClickableButtonProps) {
  return (
    <button
      className={classNames(
        'flex w-56 min-w-36 cursor-pointer items-center justify-center gap-3 rounded-md bg-neutral-900 px-9 py-4 transition hover:bg-neutral-800',
        className,
      )}
      {...props}
    >
      {svgIcon}
      <label className="cursor-pointer font-medium text-white">{label}</label>
    </button>
  );
}
