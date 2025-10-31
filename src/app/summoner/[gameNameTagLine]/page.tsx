import Image from "next/image";
import GeneralPieChart from "~/app/_components/generalPieChart";
import type { AccountDto } from "~/lib/riot/dtos/account/account.dto";
import { fetchAccount, fetchMatchHistory } from "~/lib/riot/riot-api-utils";
import {
  getChampionGames,
  getBestMatchupPerPosition,
  parseSummoner,
  getBestMatch,
  type MatchupEntry,
  type ChampionEntry,
  getTotalGames,
  getMostPlayedChampions,
} from "~/lib/summoner/summoner-utils";
import { askBedrock } from "~/lib/ai/ai-utils";
import type { MatchDto } from "~/lib/riot/dtos/match/match.dto";

export default async function SummonerPage({
  params,
}: {
  params: Promise<{ gameNameTagLine: string }>;
}) {
  const { gameNameTagLine } = await params;
  const [gameName, tagLine]: [string, string] = parseSummoner(gameNameTagLine);

  // query riot api for all the info needed to fill the page
  const data: AccountDto = await fetchAccount(gameName ?? "", tagLine ?? "");
  const puuid: string = data.puuid;
  const matchHistory: string[] = await fetchMatchHistory(
    puuid,
    new URLSearchParams({
      count: "100",
      type: "ranked",
    }),
  );
  const champions: ChampionEntry[] = await getChampionGames(
    puuid,
    matchHistory,
  );
  const bestMatchDto: MatchDto = await getBestMatch(puuid, matchHistory);

  // extract further insights from the query data
  const top3: ChampionEntry[] = getMostPlayedChampions(champions, 3);
  const bestMatchups: MatchupEntry[] = getBestMatchupPerPosition(champions);
  const championGames: Record<string, string | number>[] = [];
  champions.forEach((value) => {
    const stats: Record<string, string | number> = {
      name: value.championKey.champion,
      games: getTotalGames(value),
    };
    championGames.push(stats);
  });

  const prompt = `My three most played champions are ${top3[0]?.championKey.champion}, ${top3[1]?.championKey.champion}, and ${top3[2]?.championKey.champion}. Can you give me a short horoscope about my personality type based on my most played champions?`;
  const aiSummary: string = await askBedrock(prompt);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-8 text-white">
      {/* Summoner Info Card */}
      <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl bg-white/10 p-6 text-center shadow-lg backdrop-blur-md">
        <h2 className="text-2xl font-bold text-purple-300">Summoner Info</h2>
        <p className="text-lg">
          <span className="font-semibold">Name:</span> {data.gameName}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Tag:</span> {data.tagLine}
        </p>
        <p className="text-lg break-words">
          <span className="font-semibold">PUUID:</span> {data.puuid}
        </p>
      </div>

      {/* Spacer */}
      <div className="my-8 w-full max-w-2xl">
        {/* Champion Distribution Chart */}
        <div className="rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur-md">
          <h2 className="mb-4 text-xl font-semibold text-purple-200">{`Champion Distribution`}</h2>
          <GeneralPieChart
            data={championGames}
            title="Champion Distribution"
            nameKey="name"
            dataKey="games"
          />
        </div>
      </div>

      {/* AI Summary */}
      <div className="mt-6 w-full max-w-2xl rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur-md">
        <h2 className="mb-2 text-xl font-semibold text-purple-200">
          AI Summary
        </h2>
        <p className="text-white/90">{aiSummary}</p>
      </div>

      {/* Best Matchup */}
      <div className="flex flex-col gap-4 p-4">
        {bestMatchups.map((entry, idx) => {
          const player = entry.playerStats;
          const opponent = entry.opponentStats;

          const playerKDA = (
            (player.kills + player.assists) /
            player.deaths
          ).toFixed(2);
          const opponentKDA = (
            (opponent.kills + opponent.assists) /
            opponent.deaths
          ).toFixed(2);

          const playerIcon = `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${entry.matchupKey.playerChampion}.png`;
          const opponentIcon = `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${entry.matchupKey.opponentChampion}.png`;

          return (
            <div
              key={idx}
              className="mx-auto flex w-full max-w-4xl items-center justify-between rounded-2xl bg-gray-800 p-4 text-white shadow-md transition hover:bg-gray-700"
            >
              {/* Player Champion */}
              <div className="flex w-24 flex-col items-center">
                <Image
                  src={playerIcon}
                  alt={entry.matchupKey.playerChampion}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-blue-400 object-cover"
                />
                <p className="mt-2 text-sm font-semibold text-blue-300">
                  {entry.matchupKey.playerChampion}
                </p>
              </div>

              {/* Player Stats */}
              <div className="flex w-24 flex-col items-center text-center">
                <p className="font-semibold text-green-400">
                  Wins: {player.wins}
                </p>
                <p>KDA: {playerKDA}</p>
              </div>

              {/* Opponent Stats */}
              <div className="flex w-24 flex-col items-center text-center">
                <p className="font-semibold text-red-400">
                  Wins: {opponent.wins}
                </p>
                <p>KDA: {opponentKDA}</p>
              </div>

              {/* Opponent Champion */}
              <div className="flex w-24 flex-col items-center">
                <Image
                  src={opponentIcon}
                  alt={entry.matchupKey.opponentChampion}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-blue-400 object-cover"
                />
                <p className="mt-2 text-sm font-semibold text-red-300">
                  {entry.matchupKey.opponentChampion}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
