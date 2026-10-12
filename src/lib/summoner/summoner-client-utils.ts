import type { MatchEntry } from "./summoner-interface-utils";

export interface SummonerReport {
  account: {
    gameName: string;
    tagLine: string;
    profileIconId: number | null;
  };
  stats: MatchEntry;
}

export function parseSummoner(str: string): [string, string] {
  const index = str.lastIndexOf("-");
  if (index < 1 || index === str.length - 1) return ["", ""];
  return [str.slice(0, index), str.slice(index + 1)];
}

export async function fetchSummonerReport(
  gameName: string,
  tagLine: string,
): Promise<SummonerReport> {
  const params = new URLSearchParams({ gameName, tagLine });
  const response = await fetch(`/api/summoner?${params.toString()}`, {
    method: "POST",
  });
  const result = (await response.json()) as
    | SummonerReport
    | { error?: string };

  if (!response.ok) {
    throw new Error(
      "error" in result && result.error
        ? result.error
        : "Failed to load summoner data",
    );
  }

  if (!("account" in result) || !("stats" in result)) {
    throw new Error("The server returned an invalid summoner report");
  }

  return result;
}
