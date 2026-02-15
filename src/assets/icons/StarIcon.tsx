import { SVGProps } from 'react';

interface StarIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

export function StarIcon({ color = 'neutral-900', ...props }: StarIconProps) {
  const colorMap = {
    'neutral-900': 'fill-neutral-900 stroke-neutral-900',
    'neutral-300': 'fill-neutral-300 stroke-neutral-300',
  };

  return (
    <svg
      viewBox="0 0 15 15"
      xmlns="http://www.w3.org/2000/svg"
      className="size-3.75"
      {...props}
    >
      <path
        d="M7.046 1.282a.426.426 0 0 1 .788 0l1.61 3.874a.427.427 0 0 0 .36.261l4.183.335c.378.03.531.503.243.75l-3.186 2.73a.427.427 0 0 0-.138.421l.974 4.082a.426.426 0 0 1-.637.462l-3.58-2.186a.426.426 0 0 0-.445 0l-3.581 2.187A.425.425 0 0 1 3 13.736l.974-4.083a.426.426 0 0 0-.138-.422L.65 6.501a.426.426 0 0 1 .243-.749l4.182-.335a.427.427 0 0 0 .36-.261l1.61-3.874z"
        className={colorMap[color as keyof typeof colorMap]}
      ></path>
    </svg>
  );
}
