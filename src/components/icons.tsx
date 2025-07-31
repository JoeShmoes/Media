import * as React from "react"

export const Icons = {
  logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 100 100"
      fill="none"
    >
      <rect width="100" height="100" rx="20" fill="currentColor" />
      <path
        d="M30 80V20L70 60V20"
        stroke="black"
        strokeWidth="15"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
}
