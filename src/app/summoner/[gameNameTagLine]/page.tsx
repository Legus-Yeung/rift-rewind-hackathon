import { getAccount } from "~/app/api/riot/route";
import NotFound from "~/app/not-found";

interface SummonerPageProps {
  params: { gameNameTagLine: string };
}

export default async function SummonerPage({ params }: SummonerPageProps) {
  const { gameNameTagLine }: { gameNameTagLine: string } = await params;
  const [gameName, tagLine] = gameNameTagLine.split("-");
  if (gameName == undefined || tagLine == undefined) {
    // turn this into its own page
    return (
      <div>
        <h1>Invalid account</h1>
      </div>
    );
  }
  const response = await getAccount(gameName, tagLine);
  if (!response.ok) {
    return (
      <div>
        <h1>Invalid account</h1>
      </div>
    );
  }
  const { puuid }: { puuid: string } = await response.json();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Summoner Name: {gameName}</h1>
      <h1>Summoner Tag: {tagLine}</h1>
      <h1>Summoner PUUID: {puuid}</h1>
    </div>
  );
}
