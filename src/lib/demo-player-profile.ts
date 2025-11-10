/**
 * DEMO CONFIGURATION: Static player profile data for Dogmaster#Treat
 * 
 * This file contains hardcoded player statistics used for demo purposes only.
 * In production, this data would be dynamically fetched from the Riot API
 * based on the requested summoner name.
 */

export interface PlayerProfile {
  summonerName: string;
  keyStatistics: {
    totalGames: number;
    hoursPlayed: number;
    averageGameLength: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    kdaRatio: number;
    goldEarned: number;
    totalDamage: number;
  };
  topChampions: Array<{
    name: string;
    games: number;
    kda: number;
  }>;
  multikillAchievements: {
    doubleKills: number;
    tripleKills: number;
    quadraKills: number;
    pentaKills: number;
    totalMultikills: number;
    achievementRate: number;
  };
  positionPerformance: {
    strongestPosition: string;
    positions: Array<{
      name: string;
      games: number;
      visionScore: number;
      averageKda?: number;
    }>;
  };
  visionControl: {
    avgVisionScore: number;
    totalVisionScore: number;
    avgWardsPlaced: number;
    totalWardsPlaced: number;
    avgWardsKilled: number;
    totalWardsKilled: number;
    controlWards: number;
    efficiency: number;
  };
  objectiveControl: {
    barons: {
      total: number;
      avgPerGame: number;
      teamContribution: number;
    };
    dragons: {
      total: number;
      avgPerGame: number;
    };
    riftHeralds: {
      total: number;
      avgPerGame: number;
      teamContribution: number;
    };
    scuttleCrabs: {
      total: number;
      avgPerGame: number;
    };
  };
  bestMatchups: Array<{
    champion: string;
    opponent: string;
    position: string;
    winRate: number;
  }>;
  bestSingleMatch: {
    champion: string;
    kda: number;
    kills: number;
    deaths: number;
    assists: number;
  };
}

export const DOGMASTER_TREAT_PROFILE: PlayerProfile = {
  summonerName: "Dogmaster#Treat",
  keyStatistics: {
    totalGames: 61,
    hoursPlayed: 29.2,
    averageGameLength: 28.8,
    totalKills: 569,
    totalDeaths: 211,
    totalAssists: 482,
    kdaRatio: 4.98,
    goldEarned: 841574,
    totalDamage: 1491514,
  },
  topChampions: [
    { name: "Darius", games: 28, kda: 4.57 },
    { name: "Lee Sin", games: 11, kda: 6.74 },
    { name: "Aatrox", games: 3, kda: 3.30 },
  ],
  multikillAchievements: {
    doubleKills: 71,
    tripleKills: 13,
    quadraKills: 1,
    pentaKills: 0,
    totalMultikills: 85,
    achievementRate: 16,
  },
  positionPerformance: {
    strongestPosition: "JUNGLE",
    positions: [
      { name: "TOP", games: 26, visionScore: 19.0 },
      { name: "JUNGLE", games: 25, visionScore: 25.6, averageKda: 6.67 },
      { name: "MID", games: 9, visionScore: 21.3 },
      { name: "SUPPORT", games: 1, visionScore: 20.0 },
    ],
  },
  visionControl: {
    avgVisionScore: 22.1,
    totalVisionScore: 1348,
    avgWardsPlaced: 7.1,
    totalWardsPlaced: 436,
    avgWardsKilled: 3.3,
    totalWardsKilled: 201,
    controlWards: 74,
    efficiency: 46,
  },
  objectiveControl: {
    barons: {
      total: 30,
      avgPerGame: 0.49,
      teamContribution: 83,
    },
    dragons: {
      total: 81,
      avgPerGame: 1.33,
    },
    riftHeralds: {
      total: 19,
      avgPerGame: 0.31,
      teamContribution: 54,
    },
    scuttleCrabs: {
      total: 117,
      avgPerGame: 1.92,
    },
  },
  bestMatchups: [
    { champion: "Darius", opponent: "Ryze", position: "TOP", winRate: 66.7 },
    { champion: "Darius", opponent: "Camille", position: "TOP", winRate: 66.7 },
    { champion: "Darius", opponent: "Garen", position: "TOP", winRate: 33.3 },
  ],
  bestSingleMatch: {
    champion: "Jarvan IV",
    kda: 21.0,
    kills: 12,
    deaths: 1,
    assists: 9,
  },
};

/**
 * Formats the player profile data into a markdown string for use in system prompts
 */
export function formatPlayerProfileForPrompt(profile: PlayerProfile): string {
  const { summonerName, keyStatistics, topChampions, multikillAchievements, positionPerformance, visionControl, objectiveControl, bestMatchups, bestSingleMatch } = profile;

  return `## Player Profile (Demo Configuration)
**Summoner Name**: ${summonerName}

**Key Statistics Overview**:
- Total Games: ${keyStatistics.totalGames}
- Hours Played: ${keyStatistics.hoursPlayed}h
- Average Game Length: ${keyStatistics.averageGameLength} minutes
- Total K/D/A: ${keyStatistics.totalKills} / ${keyStatistics.totalDeaths} / ${keyStatistics.totalAssists}
- KDA Ratio: ${keyStatistics.kdaRatio}
- Gold Earned: ${keyStatistics.goldEarned.toLocaleString()}
- Total Damage: ${keyStatistics.totalDamage.toLocaleString()}

**Top Champions**:
${topChampions.map((champ, idx) => `${idx + 1}. ${champ.name} - ${champ.games} games, KDA: ${champ.kda}`).join('\n')}

**Multikill Achievements**:
- Double Kills: ${multikillAchievements.doubleKills}
- Triple Kills: ${multikillAchievements.tripleKills}
- Quadra Kills: ${multikillAchievements.quadraKills}
- Penta Kills: ${multikillAchievements.pentaKills}
- Total Multikills: ${multikillAchievements.totalMultikills}
- Achievement Rate: ${multikillAchievements.achievementRate}%

**Position Performance**:
- Strongest Position: ${positionPerformance.strongestPosition}${positionPerformance.positions.find(p => p.name === positionPerformance.strongestPosition)?.averageKda ? ` (Average KDA: ${positionPerformance.positions.find(p => p.name === positionPerformance.strongestPosition)?.averageKda})` : ''}
${positionPerformance.positions.map(p => `- ${p.name}: ${p.games} games, Vision Score: ${p.visionScore}`).join('\n')}

**Vision Control**:
- Avg Vision Score: ${visionControl.avgVisionScore} (Total: ${visionControl.totalVisionScore.toLocaleString()})
- Avg Wards Placed: ${visionControl.avgWardsPlaced} (Total: ${visionControl.totalWardsPlaced.toLocaleString()})
- Avg Wards Killed: ${visionControl.avgWardsKilled} (Total: ${visionControl.totalWardsKilled.toLocaleString()})
- Control Wards: ${visionControl.controlWards} (Efficiency: ${visionControl.efficiency}%)

**Objective Control**:
- Barons: ${objectiveControl.barons.total} (Avg: ${objectiveControl.barons.avgPerGame}/game, Team Contribution: ${objectiveControl.barons.teamContribution}%)
- Dragons: ${objectiveControl.dragons.total} (Avg: ${objectiveControl.dragons.avgPerGame}/game)
- Rift Heralds: ${objectiveControl.riftHeralds.total} (Avg: ${objectiveControl.riftHeralds.avgPerGame}/game, Team Contribution: ${objectiveControl.riftHeralds.teamContribution}%)
- Scuttle Crabs: ${objectiveControl.scuttleCrabs.total} (Avg: ${objectiveControl.scuttleCrabs.avgPerGame}/game)

**Best Matchups**:
${bestMatchups.map(m => `- ${m.champion} vs ${m.opponent} (${m.position}): ${m.winRate}% win rate`).join('\n')}

**Best Single Match**: ${bestSingleMatch.champion} with KDA: ${bestSingleMatch.kda.toFixed(2)} (${bestSingleMatch.kills}/${bestSingleMatch.deaths}/${bestSingleMatch.assists})`;
}

