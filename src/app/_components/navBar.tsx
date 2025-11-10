"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-background border-border text-foreground sticky top-0 left-0 z-50 w-full border-b">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left-aligned text, flush to the left */}
        <div className="text-2xl font-extrabold tracking-wide">
          <Link href="/">Rift Rewind</Link>
        </div>

        {/* Right side (optional) */}
        <div className="flex items-center gap-4">
          {/* Add links/buttons here */}
        </div>
      </div>
    </nav>
  );
}
