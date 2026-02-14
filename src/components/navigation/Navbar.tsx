import { Link, useMatchRoute } from '@tanstack/react-router';

import { useMemo } from 'react';

import { AlertsIcon, ProfileIcon } from '@/assets/icons';
import { navigationItems } from '@/data/navigation/navigation';
import { classNames } from '@/helpers/functions';
import type { NavigationItem } from '@/models/navigation/interfaces';

interface NavItemProps {
  item: NavigationItem;
  isActive: boolean;
}

function NavItem({ item, isActive }: NavItemProps) {
  return (
    <Link
      to={item.href}
      className={classNames(
        'inline-flex h-full flex-col items-center justify-end px-3.5 pb-2.5',
        isActive ? 'shadow-[inset_0_-3px_0_0_rgba(0,0,0,1)]' : '',
      )}
    >
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
    </Link>
  );
}

export default function Navbar({
  onProfileClick,
}: {
  onProfileClick?: () => void;
}) {
  const matchRoute = useMatchRoute();
  const navigationItemsMemoed = useMemo(() => {
    return navigationItems;
  }, [navigationItems]);

  return (
    <nav className="relative z-1 flex h-18 w-full items-stretch justify-between bg-white px-6 shadow-lg">
      <Link to="/" className="flex items-center gap-2">
        {/* TODO: use one file for logo, not two */}
        <img src="/logo.png" alt="TanStack Logo" />
        <img src="/logo-words.png" alt="TanStack Word Logo" />
      </Link>
      <div className={`flex items-center gap-4`}>
        {navigationItemsMemoed.map((item) => {
          const isActive = Boolean(matchRoute({ to: item.href, fuzzy: false }));
          return <NavItem key={item.name} item={item} isActive={isActive} />;
        })}
      </div>
      <div className="flex items-center gap-6">
        <AlertsIcon className="size-7 cursor-pointer" />
        <ProfileIcon
          className="size-7 cursor-pointer"
          onClick={onProfileClick}
        />
      </div>
    </nav>
  );
}
