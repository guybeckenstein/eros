import { useMatchRoute } from '@tanstack/react-router';

import { navigationItems } from '@/data/navigation/navigation';

export function getIsRouteInNavigation() {
  const matchRoute = useMatchRoute();

  // Check if the current route matches ANY of the hrefs in navigationItems
  const isInNavigation = navigationItems.some((item) =>
    matchRoute({ to: item.href, fuzzy: true }),
  );
  return isInNavigation;
}
