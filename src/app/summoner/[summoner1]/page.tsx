"use client";

import React, { useState, useEffect } from "react";

import stats from "data/stats_dogmaster-treat-2025-11-08T04-18-54-306Z.json";
import {
  getTopChampions,
  getBestMatchups,
  getBestPosition,
  getBestMatch,
  getTotalTimePlayed,
  getTopChampionsByTimePlayed,
} from "src/lib/summoner/summoner-page-utils";
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
  const [activeSection, setActiveSection] = useState("overview");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [insightParagraphs, setInsightParagraphs] = useState<{
    first: string;
    second: string;
    third: string;
  } | null>(null);

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

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: "How did dogmaster do?" }),
        });

        if (!res.ok) {
          throw new Error("Failed to get insights");
        }

        const data = await res.json() as { question: string; answer: string };
        const answer = data.answer;
        const paragraphs = answer
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        if (paragraphs.length >= 3) {
          setInsightParagraphs({
            first: paragraphs[0] ?? "",
            second: paragraphs[1] ?? "",
            third: paragraphs[2] ?? "",
          });
        } else if (paragraphs.length === 2) {
          setInsightParagraphs({
            first: paragraphs[0] ?? "",
            second: paragraphs[1] ?? "",
            third: "",
          });
        } else if (paragraphs.length === 1 && paragraphs[0]) {
          const sentences = paragraphs[0].split(/\.\s+/);
          const midPoint = Math.floor(sentences.length / 3);
          setInsightParagraphs({
            first: sentences.slice(0, midPoint).join(". ") + ".",
            second: sentences.slice(midPoint, midPoint * 2).join(". ") + ".",
            third: sentences.slice(midPoint * 2).join(". ") + ".",
          });
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    };

    void fetchInsights();
  }, []);

  const summonerName = "Dogmaster";
  const tagLine = "Treat";
  const profileIcon =
    "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/6.png";

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
