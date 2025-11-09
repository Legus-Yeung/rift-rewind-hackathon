import ErrorFallback from "~/app/_components/errorFallback";
import { parseSummoner } from "~/lib/summoner/summoner-api-utils";

import type { AccountDto } from "~/lib/riot/dtos/account/account.dto";

import { baseUrl } from "~/lib/api/url-utils";
import { apiRequest } from "~/lib/api/request-utils";
import type { SummonerEntry } from "~/lib/summoner/summoner-interface-utils";

export default async function SummonerSharePage({
  params,
}: {
  params: Promise<{ summoner1: string; summoner2: string }>;
}) {
  const { summoner1, summoner2 } = await params;
  const summonerNames = [summoner1, summoner2];

  try {
    const parsedSummoners = summonerNames.map((s) => parseSummoner(s));
    const accountData = await Promise.all(
      parsedSummoners.map(([gameName, tagLine]) =>
        apiRequest<AccountDto>(
          `${baseUrl}/api/riot?action=account&gameName=${gameName ?? ""}&tagLine=${tagLine ?? ""}`,
        ),
      ),
    );

    const summonerData: SummonerEntry[] = [];

    for (let i = 0; i < 2; i++) {
      const response = await fetch(
        `${baseUrl}/api/summoner?gameName=${accountData[i]?.gameName}&tagLine=${accountData[i]?.tagLine}`,
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
      summonerData[i] = JSON.parse(result) as SummonerEntry;
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] px-6 py-10 text-white">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="mb-10 text-center text-4xl font-bold text-purple-300">
            Summoner Comparison
          </h1>

          {/* Grid: Summoner Info + Charts */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {accountData.map((account, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-6 rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur-md"
              >
                <h2 className="text-2xl font-bold text-purple-200">
                  {`Summoner ${i + 1}`}
                </h2>
                <div className="space-y-2 text-center">
                  <p className="text-lg">
                    <span className="font-semibold">Name:</span>{" "}
                    {account.gameName}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Tag:</span>{" "}
                    {account.tagLine}
                  </p>
                  <p className="text-sm break-words text-gray-300">
                    <span className="font-semibold">PUUID:</span>{" "}
                    {account.puuid}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
    return (
      <ErrorFallback
        title="Error Loading Summoners"
        message="The Riot API may be unavailable, or one of the summoner names is invalid."
      />
    );
  }
}
