interface NoJobsInput {
  text: string;
}

export function NoJobs({ text }: NoJobsInput) {
  return (
    <div className="absolute top-0 bottom-0 flex-col justify-items-center space-y-8 self-center">
      <svg
        viewBox="0 0 204 204"
        xmlns="http://www.w3.org/2000/svg"
        className="size-51"
      >
        <circle cx="102" cy="102" r="102" fill="#E0E0E0"></circle>

        <rect x="59" y="59" width="86" height="86" fill="#BDBDBD"></rect>

        <polygon
          points="70,135 85,110 100,135"
          fill="rgb(235, 235, 235)"
        ></polygon>

        <polygon
          points="92,135 112,101.4 132,135"
          fill="rgb(235, 235, 235)"
        ></polygon>
      </svg>
      <p className="text-center text-3xl font-bold text-neutral-400">{text}</p>
    </div>
  );
}
