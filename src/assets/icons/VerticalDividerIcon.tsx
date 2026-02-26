import { SVGProps } from 'react';

import { twMerge } from 'tailwind-merge';

interface VerticalDividerIconProps extends SVGProps<SVGSVGElement> {
  pathClassName?: string;
}

export function VerticalDividerIcon({
  pathClassName,
  ...props
}: VerticalDividerIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="7 2 1 11"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 2.5C7 2.22386 7.22386 2 7.5 2Z"
        className={twMerge('fill-neutral-200', pathClassName)}
      />
    </svg>
  );
}
