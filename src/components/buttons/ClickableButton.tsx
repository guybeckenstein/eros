import { ComponentProps, ReactNode } from 'react';

interface ClickableButtonProps extends ComponentProps<'button'> {
  label: string;
  svgIcon?: ReactNode;
}

export function ClickableButton({
  label,
  svgIcon,
  ...rest
}: ClickableButtonProps) {
  return (
    <button
      className="flex w-56 min-w-36 cursor-pointer items-center justify-center gap-3 rounded-md bg-neutral-900 px-9 py-4 transition hover:bg-neutral-800"
      {...rest}
    >
      {svgIcon}
      <label className="cursor-pointer font-medium text-white">{label}</label>
    </button>
  );
}
