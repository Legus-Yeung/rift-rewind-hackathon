"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getTopChampions,
  getBestMatchups,
  getBestPosition,
  getBestMatch,
  getTotalTimePlayed,
  getTopChampionsByTimePlayed,
} from "src/lib/summoner/summoner-page-utils";
import {
  fetchSummonerReport,
  parseSummoner,
  type SummonerReport,
} from "~/lib/summoner/summoner-client-utils";
import { getPositionVisionData, getChampionKDAData } from "src/lib/vision-data";

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

export default function Index() {
  const { summoner1 } = useParams<{ summoner1: string }>();
  const [activeSection, setActiveSection] = useState("overview");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [report, setReport] = useState<SummonerReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [insightParagraphs, setInsightParagraphs] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const [gameName, tagLine] = parseSummoner(summoner1);
    setReport(null);
    setError(null);

    if (!gameName || !tagLine) {
      setError("Enter a Riot ID in the format game-name-tag.");
      return;
    }

    void fetchSummonerReport(gameName, tagLine)
      .then((result) => {
        if (!cancelled) setReport(result);
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load summoner data",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [summoner1]);

  useEffect(() => {
    if (!report) return;

    let cancelled = false;
    void fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: `How did ${report.account.gameName} do?`,
        summonerName: `${report.account.gameName}#${report.account.tagLine}`,
        stats: report.stats,
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to get AI insights");
        return (await response.json()) as { answer: string };
      })
      .then(({ answer }) => {
        if (!cancelled) {
          setInsightParagraphs(
            answer
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean),
          );
        }
      })
      .catch((insightError: unknown) => {
        if (!cancelled) {
          console.error("Error fetching insights:", insightError);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [report]);

  if (error) {
    return (
      <main className="container mx-auto min-h-screen px-4 py-24">
        <p role="alert" className="text-destructive text-center">
          {error}
        </p>
      </main>
    );
  }

  if (!report) {
    return (
      <main
        className="container mx-auto min-h-screen px-4 py-24 text-center"
        aria-live="polite"
      >
        Loading Riot match history...
      </main>
    );
  }

  const { stats } = report;
  const aggregate = stats.wins.stats.aggregate;
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

  const profileIcon =
    `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/${report.account.profileIconId ?? 1}.png`;

  const topChampion = topChamps[0]?.name?.replace(/\s+/g, "") ?? "Aatrox";

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <main>
      <title>Summoner Stats | Rift Rewind</title>
      <div>
        <HeroSection
          summonerName={report.account.gameName}
          tagLine={`#${report.account.tagLine}`}
          profileIcon={profileIcon}
          topChampion={topChampion}
          hoursPlayed={hoursPlayed}
          avgGameMinutes={avgGameMinutes}
          totalGames={aggregate.games}
        />
        <StatsOverview
          aggregate={aggregate}
          avgGameMinutes={avgGameMinutes}
          insightParagraph={insightParagraphs[0]}
        />

        <ChampionsSection
          champions={topChamps}
          insightParagraphs={insightParagraphs.slice(1).join("\n\n")}
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
                  baseRoute={`summoner/${encodeURIComponent(report.account.gameName)}-${encodeURIComponent(report.account.tagLine)}`}
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center space-y-3">
              <p className="text-muted-foreground text-sm">
                Share your season insights with the world.
              </p>
              <button
                onClick={() => setIsShareOpen(true)}
                className="btn btn-accent !rounded-none"
              >
                Share
              </button>
            </div>
            {isShareOpen && (
              <SocialLink onClose={() => setIsShareOpen(false)} />
            )}
            <div className="from-primary via-noxus-red-light to-primary mt-10 h-[2px] w-32 rounded-full bg-gradient-to-r opacity-80" />
          </div>
        </footer>
      </div>
    </main>
  );
}
