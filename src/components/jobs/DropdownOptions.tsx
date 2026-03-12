import * as React from 'react';

import { twMerge } from 'tailwind-merge';

export type DropdownOption = {
  id: string;
  label: string;
  startIcon: React.ReactNode;
  /** Called when the option is clicked. Receives the attributeId. */
  onClick: (attributeId: number) => void;
};

type DropdownOptionsProps = {
  /** The options to render. */
  options: DropdownOption[];
  /** The attributeId to pass into each option's onClick. */
  attributeId: number;

  /**
   * Optional close callback (e.g., PopoverPanel's `close` function).
   * If provided, it will be called after the option's onClick handler.
   */
  close?: () => void;

  /** Optional container role for better semantics; defaults to 'menu'. */
  role?: React.AriaRole;

  /** Optional className overrides. */
  className?: string;
  itemClassName?: string;

  /**
   * Optional hook that runs after the option's onClick (and after close, if provided).
   * Useful for analytics or additional side effects.
   */
  onAfterSelect?: (option: DropdownOption) => void;
};

export const DropdownOptions: React.FC<DropdownOptionsProps> = React.memo(
  ({
    options,
    attributeId,
    close,
    role = 'menu',
    className,
    itemClassName,
    onAfterSelect,
  }) => {
    const baseItemClass =
      'grid cursor-pointer grid-cols-[max-content_auto] items-center gap-4 px-4 py-2 text-current transition-colors hover:bg-neutral-100';

    const handleClick = (option: DropdownOption) => {
      option.onClick(attributeId);
      // Close popover if provided
      close?.();
      onAfterSelect?.(option);
    };

    const handleKeyDown =
      (option: DropdownOption) => (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(option);
        }
      };

    return (
      <div role={role} className={className}>
        {options.map((o) => (
          <div
            key={`${attributeId}_${o.label}`}
            role={role === 'menu' ? 'menuitem' : undefined}
            tabIndex={0}
            className={twMerge(baseItemClass, itemClassName)}
            onClick={() => handleClick(o)}
            onKeyDown={handleKeyDown(o)}
          >
            <span className="pointer-events-none">{o.startIcon}</span>
            <div className="text-base">{o.label}</div>
          </div>
        ))}
      </div>
    );
  },
);

DropdownOptions.displayName = 'DropdownOptions';
