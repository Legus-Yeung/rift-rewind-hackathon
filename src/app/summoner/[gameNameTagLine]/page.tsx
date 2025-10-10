import GeneralPieChart from "~/app/_components/generalPieChart";
import type { AccountDto } from "~/lib/riot/dtos/account/account.dto";
import { fetchAccount, fetchMatchHistory } from "~/lib/riot/riot-api-utils";
import { getChampionGames, parseSummoner } from "~/lib/summoner/summoner-utils";

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
  const champions: Record<string, number> = await getChampionGames(
    puuid,
    matchHistory,
  );
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Summoner Name: {data.gameName}</h1>
      <h1>Summoner Tag: {data.tagLine}</h1>
      <h1>Summoner PUUID: {data.puuid}</h1>
      <GeneralPieChart
        data={Object.entries(champions).map(([key, value]) => ({
          key,
          value,
        }))}
        title="Champion Distribution"
        nameKey="key"
        dataKey="value"
      ></GeneralPieChart>
    </div>
  );
}
