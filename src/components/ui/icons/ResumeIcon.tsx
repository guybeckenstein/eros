import clsx from 'clsx';
import { FileText } from 'lucide-react';

interface ResumeIconProps {
  isShow: boolean;
  onClick: () => void;
  size?: string | number;
  className?: string;
}

export const ResumeIcon = ({
  isShow,
  onClick,
  size = 24,
  className,
}: ResumeIconProps) => {
  const baseClassName = 'cursor-pointer';

  if (!isShow) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // This prevents the parent div's onClick from firing
    onClick();
  };

  return (
    <FileText
      size={Number(size)}
      className={clsx(baseClassName, className)}
      onClick={handleClick}
    />
  );
};
