"use client";
import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { baseUrl } from "~/lib/api/url-utils";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";

/**
 * Sanitizes the input by removing any whitespace and sending all characters to lowercase
 *
 * @param input - The string to be sanitized
 * @returns A sanitized version of the input string
 */
function sanitizeInput(input: string): string {
  return input.toLowerCase().replaceAll(/\s+/g, "");
}

interface SummonerInputProps {
  /** The base route to navigate to (e.g., "summoner" or "profile") */
  baseRoute: string;
}

export default function SummonerInput({ baseRoute }: SummonerInputProps) {
  const [gameName, setGameName] = useState<string>("");
  const [tagLine, setTagLine] = useState<string>("");

  const router: AppRouterInstance = useRouter();

  const handleConfirm = async () => {
    router.push(
      `${baseUrl}/${baseRoute}/${sanitizeInput(gameName)}-${sanitizeInput(tagLine)}`,
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-row flex-wrap items-end justify-center space-x-2">
        <label className="text-primary-foreground flex flex-col text-sm">
          Summoner Name
          <input
            type="text"
            className="border-border bg-background/70 text-foreground/90 placeholder-muted-foreground focus:ring-primary h-10 border px-3 focus:ring-2 focus:outline-none"
            value={gameName}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setGameName(event.target.value)
            }
          />
        </label>

        <p
          className="text-primary-foreground flex items-center px-1 text-4xl"
          style={{ lineHeight: "0.9" }}
        >
          #
        </p>

        <label className="text-primary-foreground flex flex-col text-sm">
          Tagline
          <input
            type="text"
            className="border-border bg-background/70 text-foreground/90 placeholder-muted-foreground focus:ring-primary h-10 border px-3 focus:ring-2 focus:outline-none"
            maxLength={5}
            value={tagLine}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setTagLine(event.target.value)
            }
          />
        </label>

        <button
          className="btn text-primary-foreground !rounded-none"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
