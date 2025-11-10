import type { MatchEntry } from "./summoner/summoner-interface-utils";

export function getPositionVisionData(data: MatchEntry) {
  const positions: Record<
    string,
    {
      visionScore: number;
      wardsPlaced: number;
      wardsKilled: number;
      games: number;
    }
  > = {};

  Object.values(data.wins.champion || {}).forEach((champData) => {
    Object.entries(champData.position || {}).forEach(([position, posData]) => {
      const { visionScore, wardsPlaced, wardsKilled, games } =
        posData.stats.aggregate;

      positions[position] ??= {
        visionScore: 0,
        wardsPlaced: 0,
        wardsKilled: 0,
        games: 0,
      };

      positions[position].visionScore += visionScore;
      positions[position].wardsPlaced += wardsPlaced;
      positions[position].wardsKilled += wardsKilled;
      positions[position].games += games;
    });
  });

  return Object.entries(positions).map(([position, stats]) => ({
    position,
    ...stats,
  }));
}

export function getChampionKDAData(data: MatchEntry) {
  return Object.entries(data.wins.champion || {}).map(([name, stats]) => {
    const { kills, deaths, assists, games } = stats.stats.aggregate;
    return {
      name,
      kills,
      deaths,
      assists,
      games,
      kda: (kills + assists) / Math.max(1, deaths),
    };
  });
}
