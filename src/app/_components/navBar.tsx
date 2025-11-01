"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 left-0 w-full bg-[#0e0e10]/80 backdrop-blur-md text-white z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo placeholder */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-md" />
          <span className="text-lg font-bold tracking-wide">Rift Rewind</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="hover:text-purple-400 transition">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-purple-400 transition">
            Dashboard
          </Link>
          <Link href="/chat" className="hover:text-purple-400 transition">
            Chat
          </Link>
        </div>
      </div>
    </nav>
  );
}
