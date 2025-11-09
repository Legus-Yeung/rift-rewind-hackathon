"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-[#111] border-b border-[#2a2a2a] text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo Placeholder */}
        <div className="text-[hsl(40,45%,61%)] font-extrabold text-2xl tracking-wide">
          Rift Rewind
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-gray-300">
          <Link
            href="/"
            className="hover:text-[hsl(40,45%,61%)] transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-[hsl(40,45%,61%)] transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            href="/chat"
            className="hover:text-[hsl(40,45%,61%)] transition-colors duration-200"
          >
            Chat
          </Link>
          <Link
            href="/summoner"
            className="hover:text-[hsl(40,45%,61%)] transition-colors duration-200"
          >
            Summoner
          </Link>
        </div>
      </div>
    </nav>
  );
}
