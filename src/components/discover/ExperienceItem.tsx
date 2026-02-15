interface DiscoverItemProps {
  title: string; // Company Name or Institution
  subtitle: string; // Job Title or Study Name
  description?: string; // Job Description or Study Description
  period: string; // Dates
  logoUrl: string; // Image source
}

export function ExperienceItem({
  title,
  subtitle,
  description,
  period,
  logoUrl,
}: DiscoverItemProps) {
  return (
    <div className="flex items-start gap-4">
      <img
        className="object-fit max-h-12 min-h-12 max-w-12 min-w-12 rounded-full border"
        alt={title}
        src={logoUrl}
      />
      <div className="flex min-h-28 w-full flex-col justify-between bg-neutral-100 p-2">
        <div>
          <h4 className="text-lg font-bold text-current">{title}</h4>
          <h5 className="text-sm font-medium text-current">{subtitle}</h5>
          {description && (
            <p className="line-clamp-3 text-sm text-neutral-600">
              {description}
            </p>
          )}
        </div>
        <small className="font-medium text-neutral-500">{period}</small>
      </div>
    </div>
  );
}
