"use client";

import React, { useState } from "react";

import stats from "data/stats_dogmaster-treat-2025-11-08T04-18-54-306Z.json";
import {
  getTopChampions,
  getBestMatchup,
  getBestPosition,
  getBestMatch,
  getTotalTimePlayed,
  getTopChampionsByTimePlayed,
} from "src/lib/summoner-data";
import { getPositionVisionData, getChampionKDAData } from "src/lib/vision-data";

import { HeroSection } from "../_components/HeroSection";
import { StatsOverview } from "../_components/StatsOverview";
import { MultikillSection } from "../_components/MultiKillSection";
import { ChampionsSection } from "../_components/ChampionsSection";
import { MatchupsSection } from "../_components/MatchupsSection";
import { VisionControlSection } from "../_components/VisionControlSection";
import { KDATrendSection } from "../_components/KDATrendSection";
import { ObjectiveControlSection } from "../_components/ObjectiveControlSection";
import { TimePlayedSection } from "../_components/TimePlayedSection";

export default function Index() {
  const [activeSection, setActiveSection] = useState("overview");

  const aggregate = stats.wins.stats.aggregate;

  // Derived stats
  const topChamps = getTopChampions(stats);
  const bestMatchup = getBestMatchup(stats);
  const bestPosition = getBestPosition(stats);
  const bestMatch = getBestMatch(stats);
  const totalTime = getTotalTimePlayed(stats);
  const topTimeChamps = getTopChampionsByTimePlayed(stats);
  const positionVisionData = getPositionVisionData(stats);
  const championKDAs = getChampionKDAData(stats);
  const hoursPlayed = totalTime.totalHours;
  const avgGameMinutes = totalTime.avgGameLength;

  // Summoner info
  const summonerName = "Dogmaster";
  const tagLine = "#Treat";
  const profileIcon =
    "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/6.png";

  const topChampion = topChamps[0]?.name?.replace(/\s+/g, "") || "Aatrox";

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      const offset = 80; // Height of sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="noxus-theme min-h-screen"> 
      <div className="bg-background min-h-screen">
        <HeroSection
          summonerName={summonerName}
          tagLine={tagLine}
          profileIcon={profileIcon}
          topChampion={topChampion}
          hoursPlayed={hoursPlayed}
          avgGameMinutes={avgGameMinutes}
          totalGames={aggregate.games}
        />
          
           <div className="bg-red-500 text-white p-4">Tailwind Test</div>
        <StatsOverview aggregate={aggregate} avgGameMinutes={avgGameMinutes} />

        <MultikillSection
          doubleKills={aggregate.doubleKills}
          tripleKills={aggregate.tripleKills}
          quadraKills={aggregate.quadraKills}
          pentaKills={aggregate.pentaKills}
        />

        <ChampionsSection champions={topChamps} />

        <MatchupsSection bestMatchup={bestMatchup} bestPosition={bestPosition} />

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

        {/* Footer */}
        <footer className="bg-card/50 border-t-2 border-primary/30 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground text-sm">
              Summoner Wrapped • Season 2024 • Noxus Theme
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
