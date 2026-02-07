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
        'inline-flex flex-col items-center justify-center gap-1 p-2.5',
        isActive ? 'w-14 border-b-[3px] border-black' : 'w-20',
      )}
    >
      <div className="relative h-6 w-6 overflow-hidden">{item.icon}</div>
      <div
        className={classNames(
          'justify-start text-lg tracking-wide text-black',
          isActive ? 'font-semibold' : 'font-medium',
        )}
      >
        {item.name}
      </div>
    </Link>
  );
}

export default function Navbar() {
  const matchRoute = useMatchRoute();
  const navigationItemsMemoed = useMemo(() => {
    return navigationItems;
  }, [navigationItems]);

  return (
    <nav className="flex h-18 w-full items-center justify-between px-6 shadow-lg">
      <Link to="/" className="flex gap-2">
        <img src="/logo.png" alt="TanStack Logo" className="" />
        <img src="/logo-words.png" alt="TanStack Word Logo" className="w-23" />
      </Link>
      <div className="flex items-center justify-center gap-8">
        {navigationItemsMemoed.map((item) => {
          const isActive = Boolean(matchRoute({ to: item.href, fuzzy: false }));
          return <NavItem key={item.name} item={item} isActive={isActive} />;
        })}
      </div>
      <div className="flex gap-3">
        <AlertsIcon className="h-6 w-6 cursor-pointer" />
        <ProfileIcon className="h-6 w-6 cursor-pointer" />
      </div>
    </nav>
  );
}
