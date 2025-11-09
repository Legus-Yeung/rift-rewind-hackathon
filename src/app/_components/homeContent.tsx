"use client"; // this is now a client component
import SummonerInput from "../_components/summoner-input";
import { useEffect, useState } from "react";

export default function HomeContent() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 3300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`container flex flex-col items-center justify-center gap-12 px-4 py-16 transition-opacity duration-6000 ${
        showContent ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Rift <span>Rewind</span>
      </h1>
      <SummonerInput />
    </div>
  );
}
