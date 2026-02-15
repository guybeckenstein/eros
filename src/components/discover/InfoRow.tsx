import { ReactElement } from 'react';

interface InfoRowProps {
  icon: ReactElement;
  children: any;
}

export const InfoRow = ({ icon, children }: InfoRowProps) => {
  if (!children) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 rounded-full border border-neutral-400 bg-white">
        {icon}
      </div>
      <p className="font-semibold">{children}</p>
    </div>
  );
};
