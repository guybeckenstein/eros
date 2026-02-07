import * as React from 'react';

export function AddIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8.625 12h6.75M12 15.375v-6.75"
        className="stroke-linecap-round stroke-white stroke-[1.125]"
      />
    </svg>
  );
}
