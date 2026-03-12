import { SVGProps } from 'react';

import { Info } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// TODO: implement
interface InformationIconProps extends SVGProps<SVGSVGElement> {
  onClick?: () => void;
  size?: string | number;
  strokeWidth?: string | number;
  className?: string;
}

export const InformationIcon = ({
  onClick,
  size = 24,
  strokeWidth,
  className,
  ...props
}: InformationIconProps) => {
  const baseClassName = 'cursor-pointer';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // This prevents the parent div's onClick from firing
    onClick?.();
  };

  return (
    <Info
      size={Number(size)}
      strokeWidth={Number(strokeWidth)}
      className={twMerge(baseClassName, className)}
      onClick={handleClick}
      {...props}
    />
  );
};
