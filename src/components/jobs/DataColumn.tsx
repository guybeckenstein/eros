import { ReactElement } from 'react';

interface DataColumnProps {
  header: string;
  children: ReactElement;
}

export const DataColumn = ({ header, children }: DataColumnProps) => {
  if (!children) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-2 text-xl">{header}</h3>
      {children}
    </div>
  );
};
