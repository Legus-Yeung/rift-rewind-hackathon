import type { AccountDto } from "~/lib/riot/dtos/account.dto";
import { fetchAccount } from "~/lib/riot/riot-api-utils";

export default async function SummonerPage({
  params,
}: {
  params: Promise<{ gameNameTagLine: string }>;
}) {
  const { gameNameTagLine } = await params;
  const [gameName, tagLine] = gameNameTagLine.split("-");
  try {
    const data: AccountDto = await fetchAccount(gameName ?? "", tagLine ?? "");
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <h1>Summoner Name: {data.gameName}</h1>
        <h1>Summoner Tag: {data.tagLine}</h1>
        <h1>Summoner PUUID: {data.puuid}</h1>
      </div>
    );
  } catch {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <h1>Bad Summoner</h1>
      </div>
    );
  }
}
