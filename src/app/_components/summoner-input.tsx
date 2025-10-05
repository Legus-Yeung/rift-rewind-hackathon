"use client";
import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Sanitizes the input by removing any whitespace and sending all characters to lowercase
 *
 * @param input - The string to be sanitzied
 * @returns A sanitized version of the input string
 */
function sanitizeInput(input: string): string {
  return input.toLowerCase().replaceAll(/\s+/g, "");
}

export default function SummonerInput() {
  const [gameName, setGameName] = useState<string>("");
  const [tagLine, setTagLine] = useState<string>("");

  const router: AppRouterInstance = useRouter();

  const handleConfirm = async () => {
    router.push(
      `summoner/${sanitizeInput(gameName)}-${sanitizeInput(tagLine)}`,
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-row flex-wrap items-end justify-center space-x-2">
        <label className="flex flex-col">
          Username
          <input
            type="text"
            className="rounded border border-purple-300 bg-white px-2 py-1 text-gray-400"
            value={gameName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setGameName(event.target.value);
            }}
          />
        </label>
        <p
          className="flex items-center px-1 text-4xl text-white"
          style={{ lineHeight: "0.9" }}
        >
          #
        </p>
        <label className="flex flex-col">
          Tagline
          <input
            type="text"
            className="rounded border border-purple-300 bg-white px-2 py-1 text-gray-400"
            maxLength={5}
            value={tagLine}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setTagLine(event.target.value);
            }}
          />
        </label>
        <button
          className="rounded bg-purple-500 px-4 py-1 text-white hover:bg-blue-400"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
