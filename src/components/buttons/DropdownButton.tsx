import { MouseEventHandler, ReactNode } from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  label: ReactNode;
  children: ReactNode;
}

interface ItemProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  variant?: 'default' | 'danger';
}

export const Dropdown = ({ label, children }: DropdownProps) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <button className="inline-flex w-56 min-w-36 items-center justify-between gap-2 rounded-md border-2 border-neutral-900 bg-white px-5 py-3 text-base font-medium transition-colors hover:bg-neutral-50">
        {label}
        <ChevronDown size={20} className="text-neutral-900" />
      </button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className="z-50 w-56 min-w-36 rounded-md bg-white p-2 text-base shadow-lg ring-1 ring-black/5 focus:outline-none"
        sideOffset={5}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

Dropdown.Item = ({ children, onClick, variant = 'default' }: ItemProps) => (
  <DropdownMenu.Item
    onClick={onClick}
    className={`flex cursor-pointer items-center rounded-sm px-3 py-2 text-base transition-colors outline-none ${
      variant === 'danger'
        ? 'text-red-600 focus:bg-red-50'
        : 'text-neutral-700 focus:bg-blue-50'
    }`}
  >
    {children}
  </DropdownMenu.Item>
);
