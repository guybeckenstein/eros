import React from 'react';

import { twMerge } from 'tailwind-merge';

interface ClickShieldProps {
  children: React.ReactNode;
  className?: string;
  // Optional: allow clicking through if a certain condition is met
  enabled?: boolean;
  preventDefault?: boolean;
}

export const ClickShield = ({
  children,
  className = '',
  enabled = true,
  preventDefault = false,
}: ClickShieldProps) => {
  return (
    <div
      className={twMerge('size-max cursor-auto', className)}
      onClick={(e) => {
        if (enabled) {
          e.stopPropagation();
        }
        if (preventDefault) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </div>
  );
};
