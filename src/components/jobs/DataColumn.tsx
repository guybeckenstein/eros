import { ReactElement } from 'react';

import { twMerge } from 'tailwind-merge';

interface DataColumnProps {
  header: string;
  children: ReactElement;
  className?: string;
}

export const DataColumn = ({
  header,
  children,
  className,
}: DataColumnProps) => {
  if (!children) {
    return null;
  }

  return (
    <div>
      <h3 className={twMerge('mb-2 text-xl', className)}>{header}</h3>
      {children}
    </div>
  );
};
