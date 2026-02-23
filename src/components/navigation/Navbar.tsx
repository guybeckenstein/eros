import { Link } from '@tanstack/react-router';

import { useMemo } from 'react';

import { AlertsIcon, ProfileIcon } from '@/assets/icons';
import { navigationItems } from '@/data/navigation/navigation';
import { classNames } from '@/helpers/functions';
import type { NavigationItem } from '@/models/navigation/interfaces';

interface NavItemProps {
  item: NavigationItem;
}

function NavItem({ item }: NavItemProps) {
  return (
    <Link
      to={item.href}
      activeOptions={{ includeChildren: true }}
      className="inline-flex h-full flex-col items-center justify-end px-3.5 pb-2.5"
      activeProps={{
        className: 'shadow-[inset_0_-3px_0_0_rgba(0,0,0,1)]',
      }}
    >
      {({ isActive }) => (
        <>
          <div className="relative size-6 overflow-hidden">{item.icon}</div>
          <div
            className={classNames(
              'text-center text-lg tracking-wide text-black transition-all',
              'after:block after:h-0 after:overflow-hidden after:font-semibold after:content-[attr(data-text)]',
              isActive ? 'font-semibold' : 'font-normal',
            )}
            data-text={item.name}
          >
            {item.name}
          </div>
        </>
      )}
    </Link>
  );
}

export default function Navbar({
  onProfileClick,
}: {
  onProfileClick?: () => void;
}) {
  const navigationItemsMemoed = useMemo(() => {
    return navigationItems;
  }, [navigationItems]);

  return (
    <nav className="relative z-1 flex h-18 w-full items-stretch justify-between bg-white px-6 shadow-lg">
      <Link to="/" className="flex flex-1 items-center gap-2">
        {/* TODO: use updated logo */}
        <img src="/logo.png" alt="TanStack Logo" />
        <img src="/logo-words.png" alt="TanStack Word Logo" />
      </Link>
      <div className={`shrink-0 items-center space-x-4`}>
        {navigationItemsMemoed.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </div>
      <div className="flex flex-1 items-center justify-end gap-6">
        <AlertsIcon className="size-7 cursor-pointer" />
        <ProfileIcon
          className="size-7 cursor-pointer"
          onClick={onProfileClick}
        />
      </div>
    </nav>
  );
}
