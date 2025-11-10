
"use client";

import React from "react";
import stats1 from "data/stats_dogmaster-treat-2025-11-08T04-18-54-306Z.json";
import stats2 from "data/stats_sinister-0005-2025-11-08T04-46-17-505Z.json";

import {
  getTopChampions,
  getBestMatchups,
  getBestPosition,
  getBestMatch,
  getTotalTimePlayed,
  getTopChampionsByTimePlayed,
} from "src/lib/summoner-data";
import { getPositionVisionData, getChampionKDAData } from "src/lib/vision-data";

import { HeroSection } from "../../../_components/HeroSection";
import { StatsOverview } from "../../../_components/StatsOverview";
import { MultikillSection } from "../../../_components/MultiKillSection";
import { ChampionsSection } from "../../../_components/ChampionsSection";
import { MatchupsSection } from "../../../_components/MatchupsSection";
import { VisionControlSection } from "../../../_components/VisionControlSection";
import { KDATrendSection } from "../../../_components/KDATrendSection";
import { ObjectiveControlSection } from "../../../_components/ObjectiveControlSection";
import { TimePlayedSection } from "../../../_components/TimePlayedSection";
import { CompareValue } from "~/app/_components/compareValue";

export default function ComparePage() {
  // 🎯 Parse both players
  const players = [
    {
      name: "Dogmaster",
      tag: "#Treat",
      profileIcon: "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/6.png",
      stats: stats1,
    },
    {
      name: "Sinister",
      tag: "#0005",
      profileIcon: "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/7.png",
      stats: stats2,
    },
  ];

  
  const parsed = players.map(({ stats }) => {
    const aggregate = stats.wins.stats.aggregate;
    const topChamps = getTopChampions(stats);
    const bestMatchups = getBestMatchups(stats, 3);
    const bestPosition = getBestPosition(stats);
    const bestMatch = getBestMatch(stats);
    const totalTime = getTotalTimePlayed(stats);
    const topTimeChamps = getTopChampionsByTimePlayed(stats);
    const positionVisionData = getPositionVisionData(stats);
    const championKDAs = getChampionKDAData(stats);

    return {
      aggregate,
      topChamps,
      bestMatchups,
      bestPosition,
      bestMatch,
      totalTime,
      topTimeChamps,
      positionVisionData,
      championKDAs,
      hoursPlayed: totalTime.totalHours,
      avgGameMinutes: totalTime.avgGameLength,
    };
  });

  const [p1, p2] = parsed;
  const [summ1, summ2] = players;

  return (
    <main className="bg-background min-h-screen">
      {/* 🧭 Hero Sections (side by side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <HeroSection
          summonerName={summ1.name}
          tagLine={summ1.tag}
          profileIcon={summ1.profileIcon}
          topChampion={p1.topChamps[0]?.name || "Aatrox"}
          hoursPlayed={p1.hoursPlayed}
          avgGameMinutes={p1.avgGameMinutes}
          totalGames={p1.aggregate.games}
        />
        <HeroSection
          summonerName={summ2.name}
          tagLine={summ2.tag}
          profileIcon={summ2.profileIcon}
          topChampion={p2.topChamps[0]?.name || "Aatrox"}
          hoursPlayed={p2.hoursPlayed}
          avgGameMinutes={p2.avgGameMinutes}
          totalGames={p2.aggregate.games}
        />
      </div>

      {/* 📊 Stats Overview comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1">
        <StatsOverview
            aggregate={p1.aggregate}
            avgGameMinutes={p1.avgGameMinutes}
            compareWith={p2.aggregate}
            />
            <StatsOverview
            aggregate={p2.aggregate}
            avgGameMinutes={p2.avgGameMinutes}
            compareWith={p1.aggregate}
            />
      </div>

      {/* 🧨 Multikill Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        
        <MultikillSection
          doubleKills={p1.aggregate.doubleKills}
          tripleKills={p1.aggregate.tripleKills}
          quadraKills={p1.aggregate.quadraKills}
          pentaKills={p1.aggregate.pentaKills}
        />
        <MultikillSection
          doubleKills={p2.aggregate.doubleKills}
          tripleKills={p2.aggregate.tripleKills}
          quadraKills={p2.aggregate.quadraKills}
          pentaKills={p2.aggregate.pentaKills}
        />
      </div>

      {/* ⚔️ Champion Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <ChampionsSection champions={p1.topChamps} />
        <ChampionsSection champions={p2.topChamps} />
      </div>

      {/* 💥 Matchups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <MatchupsSection
          bestMatchups={p1.bestMatchups}
          bestPosition={p1.bestPosition}
          bestMatch={p1.bestMatch}
        />
        <MatchupsSection
          bestMatchups={p2.bestMatchups}
          bestPosition={p2.bestPosition}
          bestMatch={p2.bestMatch}
        />
      </div>

      {/* 👁 Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <VisionControlSection
          totalVisionScore={p1.aggregate.visionScore}
          totalWardsPlaced={p1.aggregate.wardsPlaced}
          totalWardsKilled={p1.aggregate.wardsKilled}
          totalDetectorWards={p1.aggregate.detectorWardsPlaced}
          totalGames={p1.aggregate.games}
          positionVisionData={p1.positionVisionData}
        />
        <VisionControlSection
          totalVisionScore={p2.aggregate.visionScore}
          totalWardsPlaced={p2.aggregate.wardsPlaced}
          totalWardsKilled={p2.aggregate.wardsKilled}
          totalDetectorWards={p2.aggregate.detectorWardsPlaced}
          totalGames={p2.aggregate.games}
          positionVisionData={p2.positionVisionData}
        />
      </div>

      {/* 📈 KDA Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <KDATrendSection championKDAs={p1.championKDAs} />
        <KDATrendSection championKDAs={p2.championKDAs} />
      </div>

      {/* 🎯 Objective Control */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <ObjectiveControlSection
          baronTakedowns={p1.aggregate.baronTakedowns}
          dragonTakedowns={p1.aggregate.dragonTakedowns}
          riftHeraldTakedowns={p1.aggregate.riftHeraldTakedowns}
          teamBaronKills={p1.aggregate.teamBaronKills}
          teamRiftHeraldKills={p1.aggregate.teamRiftHeraldKills}
          scuttleCrabKills={p1.aggregate.scuttleCrabKills}
          totalGames={p1.aggregate.games}
        />
        <ObjectiveControlSection
          baronTakedowns={p2.aggregate.baronTakedowns}
          dragonTakedowns={p2.aggregate.dragonTakedowns}
          riftHeraldTakedowns={p2.aggregate.riftHeraldTakedowns}
          teamBaronKills={p2.aggregate.teamBaronKills}
          teamRiftHeraldKills={p2.aggregate.teamRiftHeraldKills}
          scuttleCrabKills={p2.aggregate.scuttleCrabKills}
          totalGames={p2.aggregate.games}
        />
      </div>

      {/* ⏱ Time Played */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <TimePlayedSection
          topTimeChamps={p1.topTimeChamps}
          hoursPlayed={p1.hoursPlayed}
          avgGameMinutes={p1.avgGameMinutes}
        />
        <TimePlayedSection
          topTimeChamps={p2.topTimeChamps}
          hoursPlayed={p2.hoursPlayed}
          avgGameMinutes={p2.avgGameMinutes}
        />
      </div>

      {/* ⚡ Footer */}
      <footer className="bg-card/50 border-primary/30 border-t-2 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            Summoner Wrapped • Comparison Mode
          </p>
        </div>
      </footer>
    </main>
  );
}
