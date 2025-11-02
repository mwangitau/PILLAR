import type { SVGProps } from 'react';

export function PillarLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 9v12" />
      <path d="M4 21h16" />
      <path d="M4 9h16" />
      <path d="M7 9V3h10v6" />
    </svg>
  );
}
