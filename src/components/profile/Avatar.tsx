import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string; // Optional: used for initials or alt text
  size?: string; // e.g., 'size-12' or 'size-10'
  className?: string; // For layout tweaks like 'm-auto'
}

export function Avatar({
  src,
  alt,
  name,
  size = 'size-12',
  className,
}: AvatarProps) {
  // Common styles to avoid repetition
  const sharedClasses = twMerge(
    size,
    'rounded-full border overflow-hidden shrink-0 flex items-center justify-center object-cover',
    className,
  );

  return src ? (
    <img
      src={src}
      alt={alt || `${name} profile pic` || 'Avatar'}
      className={sharedClasses}
    />
  ) : (
    <div className={twMerge(sharedClasses, 'bg-neutral-700')} />
  );
}
