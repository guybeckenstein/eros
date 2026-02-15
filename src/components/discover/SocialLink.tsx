import { Link } from '@tanstack/react-router';

import { ReactElement } from 'react';

interface SocialLinkProps {
  href: string;
  title: string;
  icon: ReactElement;
}

export const SocialLink = ({ href, icon, title }: SocialLinkProps) => {
  // If no link is provided, render nothing
  if (!href || href.length === 0) {
    return null;
  }

  return (
    <Link
      to={href}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block" // helpful for spacing
    >
      {icon}
    </Link>
  );
};
