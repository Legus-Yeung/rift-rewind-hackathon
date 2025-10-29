import GeneralPieChart from "~/app/_components/generalPieChart";
import type { AccountDto } from "~/lib/riot/dtos/account/account.dto";
import { fetchAccount, fetchMatchHistory } from "~/lib/riot/riot-api-utils";
import {
  getChampionGames,
  getBestMatchupPerPosition,
  parseSummoner,
  type ChampionGames,
  getBestMatch,
  type MatchStats,
  getMatchStats,
  type MatchupEntry,
  getPositionGames,
  type PositionEntry,
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

  const data: AccountDto = await fetchAccount(gameName ?? "", tagLine ?? "");
  const puuid: string = data.puuid;
  const matchHistory: string[] = await fetchMatchHistory(
    puuid,
    new URLSearchParams({ count: "100" }),
  );
  const champions: ChampionGames[] = await getChampionGames(
    puuid,
    matchHistory,
    3,
  );
  const bestMatchDto: MatchDto = await getBestMatch(puuid, matchHistory);
  const bestMatchStats: MatchStats = getMatchStats(puuid, bestMatchDto);
  const positionStats: PositionEntry[] = await getPositionGames(
    puuid,
    matchHistory,
  );
  const bestMatchups: MatchupEntry[] = await getBestMatchupPerPosition(
    puuid,
    matchHistory,
  );
  const prompt: string = `My three most played champions are ${champions[0]?.name}, ${champions[1]?.name}, and ${champions[2]?.name}. Can you give me a short horoscope about my personality type based on my most played champions?`;
  const aiSummary = await askBedrock(prompt);
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
            data={champions}
            title="Champion Distribution"
            nameKey="name"
            dataKey="games"
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="my-8 w-full max-w-2xl">
        {/* Role Distribution Chart */}
        <div className="rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur-md">
          <h2 className="mb-4 text-xl font-semibold text-purple-200">{`Lane Distribution`}</h2>
          <GeneralPieChart
            data={positionStats.map((e) => ({
              positionKey: e.positionKey,
              ...e.positionStats,
            }))}
            title="Lane Distribution"
            nameKey="positionKey"
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

      {/* Highlight Match */}
      <div
        className={`mt-6 w-full max-w-2xl rounded-2xl p-6 shadow-lg backdrop-blur-md transition-colors duration-300 ${bestMatchStats.win ? "border border-green-400 bg-green-600/20" : "border border-red-400 bg-red-600/20"}`}
      >
        <h2
          className={`mb-2 text-xl font-bold ${
            bestMatchStats.win ? "text-green-200" : "text-red-200"
          }`}
        >
          Best Match
        </h2>
        <h3 className="mb-4 text-center text-xl font-semibold text-white">
          {`${bestMatchStats.champion} ${bestMatchStats.lane}`}
        </h3>
        <div className="flex items-center justify-center gap-6">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${bestMatchStats.champion}.png`}
            alt={bestMatchStats.champion}
            className="h-24 w-24 rounded-lg border border-white/30 object-cover"
          />
          <div
            className={`flex flex-col items-center justify-center rounded-lg p-4 shadow-inner ${bestMatchStats.win ? "bg-green-500/20" : "bg-red-500/20"}`}
          >
            <p className="text-white/90">{`Kills: ${bestMatchStats.kills}`}</p>
            <p className="text-white/90">{`Deaths: ${bestMatchStats.deaths}`}</p>
            <p className="text-white/90">{`Assists: ${bestMatchStats.assists}`}</p>
          </div>
        </div>
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
                <img
                  src={playerIcon}
                  alt={entry.matchupKey.playerChampion}
                  className="h-16 w-16 rounded-full border-2 border-blue-400 object-cover"
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
                <img
                  src={opponentIcon}
                  alt={entry.matchupKey.opponentChampion}
                  className="h-16 w-16 rounded-full border-2 border-red-400 object-cover"
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
