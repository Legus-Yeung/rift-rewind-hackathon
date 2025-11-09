type StatsData = {
  wins: {
    stats: {
      aggregate: {
        visionScore: number;
        wardsPlaced: number;
        wardsKilled: number;
        detectorWardsPlaced: number;
        games: number;
      };
    };
    champion: {
      [key: string]: {
        stats: {
          aggregate: {
            kills: number;
            deaths: number;
            assists: number;
            games: number;
          };
        };
        position?: {
          [key: string]: {
            stats: {
              aggregate: {
                visionScore: number;
                wardsPlaced: number;
                wardsKilled: number;
                games: number;
              };
            };
          };
        };
      };
    };
  };
};

export function getPositionVisionData(data: StatsData) {
  const positions: {
    [key: string]: {
      visionScore: number;
      wardsPlaced: number;
      wardsKilled: number;
      games: number;
    };
  } = {};

  Object.values(data.wins.champion || {}).forEach((champData) => {
    Object.entries(champData.position || {}).forEach(([position, posData]) => {
      const { visionScore, wardsPlaced, wardsKilled, games } = posData.stats.aggregate;

      if (!positions[position]) {
        positions[position] = {
          visionScore: 0,
          wardsPlaced: 0,
          wardsKilled: 0,
          games: 0,
        };
      }

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

export function getChampionKDAData(data: StatsData) {
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
