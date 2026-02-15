import { ReactElement } from 'react';

interface MatchButtonProps {
  icon: ReactElement;
}

export const MatchButton = ({ icon }: MatchButtonProps) => {
  return (
    <div className="flex size-14 cursor-pointer rounded-full border border-neutral-400 bg-white">
      {icon}
    </div>
  );
};
