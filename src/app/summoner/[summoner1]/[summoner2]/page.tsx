import Image from "next/image";
import GeneralPieChart from "~/app/_components/generalPieChart";
import ErrorFallback from "~/app/_components/errorFallback";
import {
  getChampionGames,
  getBestMatchupPerPosition,
  parseSummoner,
  getBestMatch,
  type ChampionEntry,
  getTotalGames,
  getMostPlayedChampions,
} from "~/lib/summoner/summoner-utils";

import type { AccountDto } from "~/lib/riot/dtos/account/account.dto";
import type { MatchDto } from "~/lib/riot/dtos/match/match.dto";

import { baseUrl } from "~/lib/api/url-utils";
import { apiRequest } from "~/lib/api/request-utils";

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

    const matchHistories: string[][] = await Promise.all(
      accountData.map((account) =>
        apiRequest<string[]>(
          `${baseUrl}/api/riot?action=match-history&puuid=${account.puuid}&searchParams=${new URLSearchParams()}`,
        ),
      ),
    );

    const results = await Promise.all(
      accountData.map((account, i) =>
        Promise.all([
          getChampionGames(account.puuid, matchHistories[i] ?? []),
          getBestMatch(account.puuid, matchHistories[i] ?? []),
        ]),
      ),
    );

    const champions: ChampionEntry[][] = results.map(([champs]) => champs);
    const bestMatches: MatchDto[] = results.map(([, match]) => match);

    const insights = champions.map((champs) => {
      const top3 = getMostPlayedChampions(champs, 3);
      const bestMatchups = getBestMatchupPerPosition(champs);
      const championGames = champs.map((value) => ({
        name: value.championKey.champion,
        games: getTotalGames(value),
      }));
      return { top3, bestMatchups, championGames };
    });

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

                <div className="w-full rounded-2xl bg-white/10 p-4 shadow-md">
                  <h3 className="mb-3 text-center text-xl font-semibold text-purple-200">
                    Champion Distribution
                  </h3>
                  <GeneralPieChart
                    data={insights[i]?.championGames ?? []}
                    title="Champion Distribution"
                    nameKey="name"
                    dataKey="games"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Best Matchups Section */}
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur-md"
              >
                <h2 className="mb-4 text-center text-2xl font-semibold text-purple-200">
                  {`Best Matchups — Summoner ${idx + 1}`}
                </h2>

                <div className="flex flex-col gap-4">
                  {insight.bestMatchups.map((entry, i) => {
                    const player = entry.playerStats;
                    const opponent = entry.opponentStats;
                    const playerKDA = (
                      (player.kills + player.assists) /
                      Math.max(1, player.deaths)
                    ).toFixed(2);
                    const opponentKDA = (
                      (opponent.kills + opponent.assists) /
                      Math.max(1, opponent.deaths)
                    ).toFixed(2);

                    const playerIcon = `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${entry.matchupKey.playerChampion}.png`;
                    const opponentIcon = `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${entry.matchupKey.opponentChampion}.png`;

                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl bg-gray-800/70 p-4 shadow transition hover:bg-gray-700/80"
                      >
                        <div className="flex w-24 flex-col items-center">
                          <Image
                            src={playerIcon}
                            alt={entry.matchupKey.playerChampion}
                            width={56}
                            height={56}
                            className="rounded-full border-2 border-blue-400"
                          />
                          <p className="mt-1 text-sm font-semibold text-blue-300">
                            {entry.matchupKey.playerChampion}
                          </p>
                        </div>

                        <div className="flex flex-col items-center text-sm">
                          <p className="font-semibold text-green-400">
                            Wins: {player.wins}
                          </p>
                          <p>KDA: {playerKDA}</p>
                        </div>

                        <div className="flex flex-col items-center text-sm">
                          <p className="font-semibold text-red-400">
                            Wins: {opponent.wins}
                          </p>
                          <p>KDA: {opponentKDA}</p>
                        </div>

                        <div className="flex w-24 flex-col items-center">
                          <Image
                            src={opponentIcon}
                            alt={entry.matchupKey.opponentChampion}
                            width={56}
                            height={56}
                            className="rounded-full border-2 border-red-400"
                          />
                          <p className="mt-1 text-sm font-semibold text-red-300">
                            {entry.matchupKey.opponentChampion}
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
