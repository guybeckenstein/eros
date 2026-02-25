import { Link, useMatchRoute } from '@tanstack/react-router';

import { twMerge } from 'tailwind-merge';

import { AlertsIcon, ProfileIcon } from '@/assets/icons';
import { navigationItems } from '@/data/navigation/navigation';
import type { NavigationItem } from '@/models/navigation/interfaces';
import { getIsRouteInNavigation } from '@/utils/navigation';

interface NavItemProps {
  item: NavigationItem;
}

interface NavbarProps {
  onProfileClick?: () => void;
}

function NavItem({ item }: NavItemProps) {
  return (
    <Link
      to={item.href}
      className="inline-flex h-full flex-col items-center justify-end px-3.5 pb-2.5"
      activeProps={{
        className: 'shadow-[inset_0_-3px_0_0_rgba(0,0,0,1)]',
      }}
    >
      {({ isActive }) => (
        <>
          <div className="relative size-6 overflow-hidden">{item.icon}</div>
          <div
            className={twMerge(
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

export default function Navbar({ onProfileClick }: NavbarProps) {
  const isInNavigation = getIsRouteInNavigation();

  return (
    <nav className="relative z-1 flex h-18 w-full items-stretch bg-white px-6 shadow-lg">
      <div
        className={twMerge(
          'flex items-center gap-2',
          isInNavigation ? 'flex-1' : 'mx-auto',
        )}
      >
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" />
          <img src="/logo-words.png" alt="Word Logo" />
        </Link>
      </div>

      {/* Only show these slots if we are in navigation */}
      {isInNavigation && (
        <>
          <div className="flex shrink-0 items-center space-x-4">
            {navigationItems.map((item) => (
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
        </>
      )}
    </nav>
  );
}
