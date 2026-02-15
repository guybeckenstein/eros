interface SectionHeaderProps {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SectionHeader({
  text,
  isActive = false,
  onClick,
}: SectionHeaderProps) {
  return (
    <h3
      onClick={onClick}
      className={`cursor-pointer text-lg transition-colors ${
        isActive
          ? 'font-semibold text-current underline underline-offset-5'
          : 'text-neutral-600'
      }`}
    >
      {text}
    </h3>
  );
}
