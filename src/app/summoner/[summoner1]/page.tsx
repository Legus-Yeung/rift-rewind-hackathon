import {
  getTopChampions,
  getBestMatchups,
  getBestPosition,
  getBestMatch,
  getTotalTimePlayed,
  getTopChampionsByTimePlayed,
  parseRiotName,
  analyzeAccount,
  fetchInsights,
  combineAggregates,
  getPositionVisionData,
  getChampionKDAData,
} from "src/lib/summoner/summoner-page-utils";

import { HeroSection } from "../../_components/HeroSection";
import { StatsOverview } from "../../_components/StatsOverview";
import { MultikillSection } from "../../_components/MultiKillSection";
import { ChampionsSection } from "../../_components/ChampionsSection";
import { MatchupsSection } from "../../_components/MatchupsSection";
import { VisionControlSection } from "../../_components/VisionControlSection";
import { KDATrendSection } from "../../_components/KDATrendSection";
import { ObjectiveControlSection } from "../../_components/ObjectiveControlSection";
import { TimePlayedSection } from "../../_components/TimePlayedSection";
import SummonerInput from "~/app/_components/summonerInput";
import SocialLink from "~/app/_components/socialLink";
import type { AggregateStats } from "~/lib/summoner/summoner-interface-utils";

export default async function Index({
  params,
}: {
  params: { summoner1: string };
}) {
  const { summoner1 } = await params;
  const path = `${baseUrl}/summoner/${summoner1}`;

  const [summonerName, tagLine] = parseRiotName(summoner1 as string);
  const profileIcon =
    "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/6.png";

  const stats = await analyzeAccount(summonerName, tagLine, false);
  const insightParagraphs = { first: "", second: "", third: "" };

  const winAgg: AggregateStats = stats.wins.stats.aggregate;
  const lossAgg: AggregateStats = stats.losses.stats.aggregate;

  const aggregate: AggregateStats = combineAggregates(winAgg, lossAgg);
  const topChamps = getTopChampions(stats);
  const bestMatchups = getBestMatchups(stats, 3);
  const bestPosition = getBestPosition(stats);
  const bestMatch = getBestMatch(stats);
  const totalTime = getTotalTimePlayed(stats);
  const topTimeChamps = getTopChampionsByTimePlayed(stats);
  const positionVisionData = getPositionVisionData(stats);
  const championKDAs = getChampionKDAData(stats);
  const hoursPlayed = totalTime.totalHours;
  const avgGameMinutes = totalTime.avgGameLength;

  const topChampion = topChamps[0]?.name?.replace(/\s+/g, "") ?? "Aatrox";

  return (
    <main>
      <title>Summoner Stats | Rift Rewind</title>
      <div>
        <HeroSection
          summonerName={summonerName}
          tagLine={`#${tagLine}`}
          profileIcon={profileIcon}
          topChampion={topChampion}
          hoursPlayed={hoursPlayed}
          avgGameMinutes={avgGameMinutes}
          totalGames={aggregate.games}
        />
        <StatsOverview
          aggregate={aggregate}
          avgGameMinutes={avgGameMinutes}
          insightParagraph={insightParagraphs?.first}
        />

        <ChampionsSection
          champions={topChamps}
          insightParagraphs={
            insightParagraphs
              ? `${insightParagraphs.second}\n\n${insightParagraphs.third}`
              : undefined
          }
        />

        <MultikillSection
          doubleKills={aggregate.doubleKills}
          tripleKills={aggregate.tripleKills}
          quadraKills={aggregate.quadraKills}
          pentaKills={aggregate.pentaKills}
        />

        <MatchupsSection
          bestMatchups={bestMatchups}
          bestPosition={bestPosition}
          bestMatch={bestMatch}
        />

        <VisionControlSection
          totalVisionScore={aggregate.visionScore}
          totalWardsPlaced={aggregate.wardsPlaced}
          totalWardsKilled={aggregate.wardsKilled}
          totalDetectorWards={aggregate.detectorWardsPlaced}
          totalGames={aggregate.games}
          positionVisionData={positionVisionData}
        />

        <KDATrendSection championKDAs={championKDAs} />

        <ObjectiveControlSection
          baronTakedowns={aggregate.baronTakedowns}
          dragonTakedowns={aggregate.dragonTakedowns}
          riftHeraldTakedowns={aggregate.riftHeraldTakedowns}
          teamBaronKills={aggregate.teamBaronKills}
          teamRiftHeraldKills={aggregate.teamRiftHeraldKills}
          scuttleCrabKills={aggregate.scuttleCrabKills}
          totalGames={aggregate.games}
        />

        <TimePlayedSection
          topTimeChamps={topTimeChamps}
          hoursPlayed={hoursPlayed}
          avgGameMinutes={avgGameMinutes}
        />

        <footer className="border-primary/30 bg-card/50 relative border-t-2 py-12">
          <div className="from-background/80 via-background/40 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent" />
          <div className="relative container mx-auto flex flex-col items-center justify-center space-y-8 px-4 text-center">
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              Want to compare with another summoner?
            </h2>
            <div className="flex w-full max-w-2xl justify-center">
              <div className="w-full sm:w-auto">
                <SummonerInput
                  baseRoute={`summoner/${summonerName}-${tagLine}`}
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center space-y-3">
              <p className="text-muted-foreground text-sm">
                Share your season insights with the world.
              </p>
              <SocialLink url={path} />
              <div className="from-primary via-noxus-red-light to-primary mt-10 h-[2px] w-32 rounded-full bg-gradient-to-r opacity-80" />
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
