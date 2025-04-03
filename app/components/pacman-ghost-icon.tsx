import React from 'react';

interface GhostIconProps {
  color: string;
  size: number;
  isEaten: boolean;
}

export default function GhostIcon({ color, size, isEaten }: GhostIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Corrected ghost body path without negative coordinates */}
      <path
        d="M20 1C10.507 1 3 8.507 3 18V34.5C3 35.9 4.1 37 5.5 37H6C7.4 37 8.5 35.9 8.5 34.5V33.5C8.5 32.1 9.6 31 11 31H12C13.4 31 14.5 32.1 14.5 33.5V34.5C14.5 35.9 15.6 37 17 37H18C19.4 37 20.5 35.9 20.5 34.5V33.5C20.5 32.1 21.6 31 23 31H24C25.4 31 26.5 32.1 26.5 33.5V34.5C26.5 35.9 27.6 37 29 37H30C31.4 37 32.5 35.9 32.5 34.5V33.5C32.5 32.1 33.6 31 35 31H36C37.4 31 38.5 32.1 38.5 33.5V18C38.5 8.507 30.993 1 21.5 1H20Z"
        fill={color}
      />
      {/* Eyes */}
      <circle cx="13" cy="15" r="4" fill="white" />
      <circle cx="13" cy="15" r="2" fill="black" />
      <circle cx="27" cy="15" r="4" fill="white" />
      <circle cx="27" cy="15" r="2" fill="black" />
    </svg>
  );
} 