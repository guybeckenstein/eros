import { ComponentPropsWithoutRef, ReactElement } from 'react';

import { twMerge } from 'tailwind-merge';

interface MatchButtonProps extends ComponentPropsWithoutRef<'div'> {
  icon: ReactElement;
}

export const MatchButton = ({
  icon,
  className,
  ...props
}: MatchButtonProps) => {
  return (
    <div
      {...props}
      className={twMerge(
        'flex size-14 cursor-pointer rounded-full border border-neutral-400 bg-white',
        className,
      )}
    >
      {icon}
    </div>
  );
};
