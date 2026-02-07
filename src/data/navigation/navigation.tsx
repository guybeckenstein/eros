import { DiscoverIcon, JobsIcon } from '@/assets/icons';
import { NavigationItem } from '@/models/navigation/interfaces';

export const navigationItems: NavigationItem[] = [
  {
    name: 'Discover',
    href: '/recruiter/discover',
    icon: <DiscoverIcon />,
  },
  {
    name: 'Jobs',
    href: '/recruiter/jobs',
    icon: <JobsIcon />,
  },
];
