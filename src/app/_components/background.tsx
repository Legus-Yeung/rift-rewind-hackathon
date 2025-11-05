"use client";

import Image from "next/image";

interface BackgroundProps {
  imageUrl: string;
  opacity?: number; 
  children?: React.ReactNode;
}

export default function Background({ imageUrl, opacity = 0.5, children }: BackgroundProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={imageUrl}
        alt="Background"
        fill
        priority
        className="object-cover object-center"/>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity }}/>

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
