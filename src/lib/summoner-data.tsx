type ChampionStats = {
  stats: {
    aggregate: {
      kills: number;
      deaths: number;
      assists: number;
      games: number;
      gameDuration: number;
    };
  };
  position?: {
    [key: string]: {
      stats: {
        aggregate: {
          kills: number;
          deaths: number;
          assists: number;
          games: number;
        };
      };
      matchup?: {
        [key: string]: {
          player: {
            aggregate: {
              games: number;
            };
          };
          opponent: {
            aggregate: {
              games: number;
            };
          };
        };
      };
    };
  };
};

type StatsData = {
  wins: {
    stats: {
      aggregate: {
        kills: number;
        deaths: number;
        assists: number;
        goldEarned: number;
        totalDamageDealtToChampions: number;
        games: number;
        gameDuration: number;
      };
    };
    champion: {
      [key: string]: ChampionStats;
    };
  };
  losses: {
    stats: {
      aggregate: {
        kills: number;
        deaths: number;
        assists: number;
        goldEarned: number;
        totalDamageDealtToChampions: number;
        games: number;
        gameDuration: number;
      };
    };
    champion: {
      [key: string]: ChampionStats;
    };
  };
};


type ChampionStat = {
  name: string;
  games: number;
  kda: number;
};

type Matchup = {
  playerChampion: string;
  opponentChampion: string;
  position: string;
  wins: number;
  games: number;
  winrate: number;
};

type PositionStat = {
  position: string;
  games: number;
  avgKda: number;
};

export function getTopChampions(data: StatsData): ChampionStat[] {
  const champions = Object.entries(data.wins.champion || {}).map(([name, stats]) => {
    const { kills, deaths, assists, games } = stats.stats.aggregate;
    return {
      name,
      games,
      kda: (kills + assists) / Math.max(1, deaths),
    };
  });
  
  return champions.sort((a, b) => b.games - a.games).slice(0, 3);
}

export function getBestMatchups(data: StatsData, limit: number = 3): Matchup[] {
  const matchups: Matchup[] = [];
  
  // Collect wins for each matchup
  Object.entries(data.wins.champion || {}).forEach(([champName, champData]) => {
    Object.entries(champData.position || {}).forEach(([position, posData]) => {
      Object.entries(posData.matchup || {}).forEach(([opponent, matchupData]) => {
        const wins = matchupData.player.aggregate.games;
        
        // Get losses for the same matchup
        let losses = 0;
        const lossChampData = data.losses?.champion?.[champName];
        if (lossChampData?.position?.[position]?.matchup?.[opponent]) {
          losses = lossChampData.position[position].matchup[opponent].player.aggregate.games;
        }
        
        const totalGames = wins + losses;
        
        if (totalGames >= 3) {
          matchups.push({
            playerChampion: champName,
            opponentChampion: opponent,
            position: position,
            wins: wins,
            games: totalGames,
            winrate: wins / totalGames,
          });
        }
      });
    });
  });

  return matchups.sort((a, b) => b.winrate - a.winrate).slice(0, limit);
}

export function getBestPosition(data: StatsData): PositionStat | null {
  const positions: { [key: string]: { kills: number; deaths: number; assists: number; games: number } } = {};
  
  Object.values(data.wins.champion || {}).forEach((champData) => {
    Object.entries(champData.position || {}).forEach(([position, posData]) => {
      const { kills, deaths, assists, games } = posData.stats.aggregate;
      
      if (!positions[position]) {
        positions[position] = { kills: 0, deaths: 0, assists: 0, games: 0 };
      }
      
      positions[position].kills += kills;
      positions[position].deaths += deaths;
      positions[position].assists += assists;
      positions[position].games += games;
    });
  });

  const positionStats: PositionStat[] = Object.entries(positions).map(([position, stats]) => ({
    position,
    games: stats.games,
    avgKda: (stats.kills + stats.assists) / Math.max(1, stats.deaths),
  }));

  return positionStats.length > 0
    ? positionStats.sort((a, b) => b.avgKda - a.avgKda)[0] ?? null
    : null;
}

export function getBestMatch(data: StatsData): { champion: string; kda: number; kills: number; deaths: number; assists: number } | null {
  const champions = Object.entries(data.wins.champion || {}).map(([name, stats]) => {
    const { kills, deaths, assists } = stats.stats.aggregate;
    return {
      champion: name,
      kills,
      deaths,
      assists,
      kda: (kills + assists) / Math.max(1, deaths),
    };
  });

  return champions.length > 0
    ? champions.sort((a, b) => b.kda - a.kda)[0] ?? null
    : null;
}

export function getTotalTimePlayed(data: StatsData) {
  const totalSeconds = data.wins.stats.aggregate.gameDuration;
  const totalHours = totalSeconds / 3600;
  const avgGameLength = totalSeconds / data.wins.stats.aggregate.games / 60;

  return {
    totalHours,
    avgGameLength,
  };
}

export function getTopChampionsByTimePlayed(data: StatsData) {
  const champions = Object.entries(data.wins.champion || {}).map(([name, stats]) => {
    const { games, gameDuration } = stats.stats.aggregate;
    return {
      name,
      games,
      timePlayedHours: gameDuration / 3600,
    };
  });

  return champions.sort((a, b) => b.timePlayedHours - a.timePlayedHours).slice(0, 3);
}
