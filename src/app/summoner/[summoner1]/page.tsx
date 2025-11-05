import Image from "next/image";
import GeneralPieChart from "~/app/_components/generalPieChart";
import ErrorFallback from "~/app/_components/errorFallback";
import {
  getChampionGames,
  getBestMatchupPerPosition,
  parseSummoner,
  getBestMatch,
  type MatchupEntry,
  type ChampionEntry,
  getTotalGames,
  getMostPlayedChampions,
  getChampionInGameName,
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

    // Fetch base account info
    const accountData: AccountDto = await apiRequest<AccountDto>(
      `${baseUrl}/api/riot?action=account&gameName=${gameName ?? ""}&tagLine=${tagLine ?? ""}`,
    );

    // Get match history and details
    const matchHistory: string[] = await apiRequest<string[]>(
      `${baseUrl}/api/riot?action=match-history&puuid=${accountData.puuid}&searchParams=${new URLSearchParams()}`,
    );

    // Fetch stats concurrently
    const [champions, bestMatchDto]: [ChampionEntry[], MatchDto] =
      await Promise.all([
        getChampionGames(accountData.puuid, matchHistory ?? []),
        getBestMatch(accountData.puuid, matchHistory ?? []),
      ]);

    // Extract insights
    const top3 = getMostPlayedChampions(champions, 3);
    const bestMatchups: MatchupEntry[] = getBestMatchupPerPosition(champions);
    const championGames: Record<string, string | number>[] = champions.map(
      (value) => ({
        name: value.championKey.champion,
        games: getTotalGames(value),
      }),
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
              <h3 className="mb-3 text-center text-xl font-semibold text-purple-200">
                Champion Distribution
              </h3>
              <GeneralPieChart
                data={championGames}
                title="Champion Distribution"
                nameKey="name"
                dataKey="games"
              />
            </div>
          </div>

          {/* Best Matchups */}
          <div className="mt-12 rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur-md">
            <h2 className="mb-4 text-center text-2xl font-semibold text-purple-200">
              Best Matchups
            </h2>

            <div className="flex flex-col gap-4">
              {bestMatchups.map(async (entry, i) => {
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

                let playerChampionName: string;
                let opponentChampionName: string;

                try {
                  playerChampionName =
                    (await getChampionInGameName(
                      entry.matchupKey.playerChampion,
                    )) ?? entry.matchupKey.playerChampion;
                  opponentChampionName =
                    (await getChampionInGameName(
                      entry.matchupKey.opponentChampion,
                    )) ?? entry.matchupKey.opponentChampion;
                } catch (error) {
                  console.warn(error);
                  playerChampionName = entry.matchupKey.playerChampion;
                  opponentChampionName = entry.matchupKey.opponentChampion;
                }

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-gray-800/70 p-4 shadow transition hover:bg-gray-700/80"
                  >
                    {/* Player */}
                    <div className="flex w-24 flex-col items-center">
                      <Image
                        src={playerIcon}
                        alt={playerChampionName}
                        width={56}
                        height={56}
                        className="rounded-full border-2 border-blue-400"
                      />
                      <p className="mt-1 text-sm font-semibold text-blue-300">
                        {playerChampionName}
                      </p>
                    </div>

                    {/* Player Stats */}
                    <div className="flex flex-col items-center text-sm">
                      <p className="font-semibold text-green-400">
                        Wins: {player.wins}
                      </p>
                      <p>KDA: {playerKDA}</p>
                    </div>

                    {/* Opponent Stats */}
                    <div className="flex flex-col items-center text-sm">
                      <p className="font-semibold text-red-400">
                        Wins: {opponent.wins}
                      </p>
                      <p>KDA: {opponentKDA}</p>
                    </div>

                    {/* Opponent */}
                    <div className="flex w-24 flex-col items-center">
                      <Image
                        src={opponentIcon}
                        alt={opponentChampionName}
                        width={56}
                        height={56}
                        className="rounded-full border-2 border-red-400"
                      />
                      <p className="mt-1 text-sm font-semibold text-red-300">
                        {opponentChampionName}
                      </p>
                    </div>
                  </div>
                );
              })}
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
