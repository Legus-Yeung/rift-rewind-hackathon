import GeneralPieChart from "~/app/_components/generalPieChart";
import type { AccountDto } from "~/lib/riot/dtos/account/account.dto";
import { fetchAccount, fetchMatchHistory } from "~/lib/riot/riot-api-utils";
import {
  getChampionGames,
  parseSummoner,
  type ChampionGames,
} from "~/lib/summoner/summoner-utils";
import { askBedrock } from "~/lib/ai/ai-utils";

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
  const prompt = `My three most played champions are ${champions[0]?.name}, ${champions[1]?.name}, and ${champions[2]?.name}. Can you give me a short horoscope about my personality type based on my most played champions?`;
  const aiSummary = await askBedrock(prompt);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-8 text-white">
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

      <div className="my-8 w-full max-w-2xl">
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

      <div className="mt-6 w-full max-w-2xl rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur-md">
        <h2 className="mb-2 text-xl font-semibold text-purple-200">
          AI Summary
        </h2>
        <p className="text-white/90">{aiSummary}</p>
      </div>
    </div>
  );
}
