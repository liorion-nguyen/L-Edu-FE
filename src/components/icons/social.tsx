import React from "react";

export type IconProps = {
  className?: string;
  size?: number;
};

function SvgBase({
  children,
  className,
  size = 20,
  viewBox = "0 0 24 24",
}: IconProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      aria-hidden
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function FacebookIcon({ className, size }: IconProps) {
  return (
    <SvgBase className={className} size={size}>
      <path
        fill="currentColor"
        d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </SvgBase>
  );
}

export function TikTokIcon({ className, size }: IconProps) {
  return (
    <SvgBase className={className} size={size}>
      <path
        fill="currentColor"
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
      />
    </SvgBase>
  );
}

// Zalo không có logo chính thức dạng path chuẩn trong repo,
// dùng bubble + chữ Z cách điệu để nhận diện nhanh.
export function ZaloIcon({ className, size }: IconProps) {
  return (
    <SvgBase className={className} size={size}>
      <path
        fill="currentColor"
        d="M12 2.25c-5.385 0-9.75 3.848-9.75 8.594 0 2.66 1.369 5.05 3.61 6.642-.12.899-.53 2.48-1.642 3.896a.75.75 0 0 0 .79 1.17c2.112-.56 3.703-1.34 4.812-2.07.68.19 1.405.29 2.18.29 5.385 0 9.75-3.848 9.75-8.594S17.385 2.25 12 2.25Z"
      />
      <path
        fill="white"
        d="M8.05 8.5h7.9v1.2L10.6 15.2h5.35v1.3H8.05v-1.2l5.35-5.5H8.05V8.5Z"
      />
    </SvgBase>
  );
}

// Fallback icon dùng chung khi không map được icon nào
export function LinkIcon({ className, size }: IconProps) {
  return (
    <SvgBase className={className} size={size}>
      <path
        fill="currentColor"
        d="M10.59 13.41a1 1 0 0 1 0-1.41l2.83-2.83a1 1 0 0 1 1.41 1.41l-2.83 2.83a1 1 0 0 1-1.41 0z"
      />
      <path
        fill="currentColor"
        d="M7.05 14.95a3.5 3.5 0 0 1 0-4.95l2.12-2.12a3.5 3.5 0 0 1 4.95 0 .75.75 0 1 1-1.06 1.06 2 2 0 0 0-2.83 0L8.11 11.1a2 2 0 0 0 0 2.83.75.75 0 1 1-1.06 1.06z"
      />
      <path
        fill="currentColor"
        d="M9.88 16.12a.75.75 0 0 1 0-1.06 2 2 0 0 0 2.83 0l2.12-2.12a2 2 0 0 0 0-2.83.75.75 0 0 1 1.06-1.06 3.5 3.5 0 0 1 0 4.95l-2.12 2.12a3.5 3.5 0 0 1-4.95 0z"
      />
    </SvgBase>
  );
}

