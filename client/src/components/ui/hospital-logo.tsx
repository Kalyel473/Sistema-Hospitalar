import React from "react";

export const HospitalLogo: React.FC<{ className?: string }> = ({ className = "h-10 w-auto" }) => {
  return (
    <svg
      width="150"
      height="50"
      viewBox="0 0 150 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="150" height="50" rx="4" fill="#00C86B" />
      <path
        d="M30 15H40V35H30V15Z"
        fill="white"
      />
      <path
        d="M20 25H50V30H20V25Z"
        fill="white"
      />
      <path
        d="M70 15V35H75V27H85V35H90V15H85V22H75V15H70Z"
        fill="white"
      />
      <circle cx="100" cy="25" r="10" fill="white" />
      <circle cx="100" cy="25" r="5" fill="#00C86B" />
      <path
        d="M110 15V35H120C125 35 130 30 130 25C130 20 125 15 120 15H110ZM115 20H120C122.5 20 125 22.5 125 25C125 27.5 122.5 30 120 30H115V20Z"
        fill="white"
      />
    </svg>
  );
};

export default HospitalLogo;