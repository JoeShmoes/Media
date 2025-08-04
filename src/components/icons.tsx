import * as React from "react"

export const Icons = {
  logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="20" fill="currentColor" />
      <path
        d="M30 80 V 20 L 70 60 V 20"
        stroke="#222225"
        strokeWidth="15"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
  user: (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
     {...props}
     xmlns="http://www.w3.org/2000/svg" 
     width="24" 
     height="24" 
     viewBox="0 0 24 24" 
     fill="none" 
     stroke="currentColor" 
     strokeWidth="2" 
     strokeLinecap="round" 
     strokeLinejoin="round"
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 6.097-4.464 10.99-9.94 10.99-5.478 0-9.94-4.893-9.94-10.99 0-6.097 4.462-10.99 9.94-10.99a9.737 9.737 0 0 1 5.385 1.958L13.18 5.79C11.898 4.79 10.61 4.24 9.28 4.24c-3.79 0-6.86 3.06-6.86 6.85s3.07 6.85 6.86 6.85c4.19 0 6.07-2.91 6.25-4.63h-6.25v-3.32h9.94z"/>
    </svg>
  ),
}
