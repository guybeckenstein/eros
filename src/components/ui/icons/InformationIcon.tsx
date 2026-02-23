import { Info } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// TODO: implement
interface InformationIconProps {
  onClick: () => void;
  size?: string | number;
  className?: string;
}

export const InformationIcon = ({
  onClick,
  size = 24,
  className,
}: InformationIconProps) => {
  const baseClassName = 'cursor-pointer';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // This prevents the parent div's onClick from firing
    onClick();
  };

  return (
    <Info
      size={Number(size)}
      className={twMerge(baseClassName, className)}
      onClick={handleClick}
    />
  );
};
