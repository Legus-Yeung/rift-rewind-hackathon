"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-[#111] border-b border-[#2a2a2a] text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        
        <div className="font-extrabold text-2xl tracking-wide">
          <Link
            href="/"
            className="hover:text-[hsl(40,45%,61%)] transition-colors duration-200"
          >
          Rift Rewind
          </Link>
        </div>

        </div>
    </nav>
  );
}
