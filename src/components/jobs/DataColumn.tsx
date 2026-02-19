import { ReactElement } from 'react';

import { classNames } from '@/helpers/functions';

interface DataColumnProps {
  header: string;
  children: ReactElement;
  className: string | undefined;
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
      <h3 className={classNames('mb-2 text-xl', className)}>{header}</h3>
      {children}
    </div>
  );
};
