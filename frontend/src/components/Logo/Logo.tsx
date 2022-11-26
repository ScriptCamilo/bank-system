import { SVGAttributes } from 'react';

interface LogoProps extends SVGAttributes<HTMLOrSVGElement> {}

export function Logo(props: LogoProps) {
  return (
    <svg
      width={150}
      height={35}
      viewBox="0 0 2500 566"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1247.17 141.483c-97.62 0-168.01 63.667-168.01 159.168s79.23 159.168 176.85 159.168c58.98 0 110.98-23.345 143.17-62.695l-67.65-39.084c-17.86 19.542-45.01 30.949-75.52 30.949-42.35 0-78.34-22.107-91.7-57.477h247.78c1.94-9.904 3.09-20.162 3.09-30.95 0-95.412-70.39-159.079-168.01-159.079zm-83.65 128.218c11.05-35.282 41.29-57.477 83.56-57.477 42.36 0 72.6 22.195 83.57 57.477h-167.13zm1035.83-128.218c-97.62 0-168.01 63.667-168.01 159.168s79.23 159.168 176.85 159.168c58.98 0 110.98-23.345 143.16-62.695l-67.64-39.084c-17.86 19.542-45.01 30.949-75.52 30.949-42.35 0-78.34-22.107-91.7-57.477h247.78c1.94-9.904 3.09-20.162 3.09-30.95 0-95.412-70.39-159.079-168.01-159.079zm-83.56 128.218c11.05-35.282 41.29-57.477 83.56-57.477 42.36 0 72.6 22.195 83.56 57.477h-167.12zm-345.13 30.95c0 53.056 34.66 88.427 88.42 88.427 36.44 0 63.76-16.536 77.82-43.506l67.91 39.173c-28.12 46.866-80.82 75.074-145.73 75.074-97.71 0-168.01-63.667-168.01-159.168s70.39-159.168 168.01-159.168c64.91 0 117.52 28.208 145.73 75.074l-67.91 39.173c-14.06-26.97-41.38-43.506-77.82-43.506-53.67 0-88.42 35.371-88.42 88.427zM2500 44.213v406.763h-79.58V44.213H2500zM326.737 0l326.736 565.931H0L326.737 0zm816.883 44.213L898.592 468.662 653.562 44.213h91.875l153.155 265.28 153.158-265.28h91.87zm520.92 106.112v85.686c-8.84-2.564-18.21-4.333-28.29-4.333-51.38 0-88.43 35.371-88.43 88.427v130.871h-79.58V150.325h79.58v81.353c0-44.921 52.26-81.353 116.72-81.353z"
        fill="#fff"
      />
    </svg>
  )
}