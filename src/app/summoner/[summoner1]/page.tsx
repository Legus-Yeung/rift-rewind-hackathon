import Image from "next/image";
import GeneralPieChart from "~/app/_components/generalPieChart";
import ErrorFallback from "~/app/_components/errorFallback";

import {
  getChampionGames,
  parseSummoner,
  type SummonerEntry,
} from "~/lib/summoner/summoner-utils";

import type { AccountDto } from "~/lib/riot/dtos/account/account.dto";
import type { MatchDto } from "~/lib/riot/dtos/match/match.dto";

import { baseUrl } from "~/lib/api/url-utils";
import { apiRequest } from "~/lib/api/request-utils";

export default async function SummonerPage({
  params,
}: {
  params: Promise<{ summoner1: string }>;
}) {
  const { summoner1 } = await params;

  try {
    // Parse "GameName#TagLine"
    const [gameName, tagLine] = parseSummoner(summoner1);

    const response = await fetch(
      `${baseUrl}/api/summoner?gameName=${gameName}&tagLine=${tagLine}`,
      {
        method: "POST",
      },
    );

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
      console.log("Received chunk:", decoder.decode(value));
    }

    // Parse the final JSON once fully received
    const summoner: SummonerEntry = JSON.parse(result) as SummonerEntry;

    // Fetch base account info
    const accountData: AccountDto = await apiRequest<AccountDto>(
      `${baseUrl}/api/riot?action=account&gameName=${gameName ?? ""}&tagLine=${tagLine ?? ""}`,
    );

    // Get match history and details
    const matchHistory: string[] = await apiRequest<string[]>(
      `${baseUrl}/api/riot?action=match-history&puuid=${accountData.puuid}&searchParams=${new URLSearchParams()}`,
    );

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] px-6 py-10 text-white">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="mb-10 text-center text-4xl font-bold text-purple-300">
            {accountData.gameName}#{accountData.tagLine}
          </h1>

          {/* Summoner Info + Chart */}
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur-md">
            <div className="space-y-2 text-center">
              <p className="text-lg">
                <span className="font-semibold">Name:</span>{" "}
                {accountData.gameName}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Tag:</span>{" "}
                {accountData.tagLine}
              </p>
              <p className="text-sm break-words text-gray-300">
                <span className="font-semibold">PUUID:</span>{" "}
                {accountData.puuid}
              </p>
            </div>

            <div className="w-full rounded-2xl bg-white/10 p-4 shadow-md">
              {JSON.stringify(summoner, null, 2)}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
    return (
      <ErrorFallback
        title="Error Loading Summoner"
        message="The Riot API may be unavailable, or the summoner name is invalid."
      />
    );
  }
}
