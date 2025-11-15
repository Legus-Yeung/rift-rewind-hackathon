import type { RiotPosition } from "../riot/enums/riot-position";
import type { MatchEntry } from "./summoner-interface-utils";
import { baseUrl } from "../api/url-utils";

export async function analyzeAccount(
  gameName: string,
  tagLine: string,
  save = true,
): Promise<MatchEntry> {
  const params = new URLSearchParams({ gameName, tagLine, save: String(save) });
  const response = await fetch(`${baseUrl}/api/summoner?${params.toString()}`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
      }
    }

    const lastBrace = fullText.lastIndexOf("}");
    const jsonString = fullText.slice(fullText.indexOf("{"), lastBrace + 1);
    const result = JSON.parse(jsonString);

    if (result.error) {
      console.error("Server error:", result.error);
      throw new Error(result.error?.message ?? "Unknown server error");
    }

    return result.data as MatchEntry;
  } catch (err) {
    console.error("Failed to process stream:", err);
    throw err;
  }
}

export async function fetchInsights(summoner: string): Promise<{
  first: string;
  second: string;
  third: string;
} | null> {
  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "How did dogmaster do?" }),
    });

    if (!res.ok) {
      throw new Error("Failed to get insights");
    }

    const data = (await res.json()) as { question: string; answer: string };
    const answer = data.answer;
    const paragraphs = answer
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (paragraphs.length >= 3) {
      return {
        first: paragraphs[0] ?? "",
        second: paragraphs[1] ?? "",
        third: paragraphs[2] ?? "",
      };
    } else if (paragraphs.length === 2) {
      return {
        first: paragraphs[0] ?? "",
        second: paragraphs[1] ?? "",
        third: "",
      };
    } else if (paragraphs.length === 1 && paragraphs[0]) {
      const sentences = paragraphs[0].split(/\.\s+/);
      const midPoint = Math.floor(sentences.length / 3);
      return {
        first: sentences.slice(0, midPoint).join(". ") + ".",
        second: sentences.slice(midPoint, midPoint * 2).join(". ") + ".",
        third: sentences.slice(midPoint * 2).join(". ") + ".",
      };
    }
  } catch (error) {
    console.error("Error fetching insights:", error);
  }
  return null;
}

export function parseRiotName(
  input: string,
): [summonerName: string, tagLine: string] {
  if (!input || typeof input !== "string") {
    return ["", ""];
  }

  const index = input.lastIndexOf("-"); // Use last hyphen to avoid issues in names
  if (index === -1) {
    return [input.trim(), ""];
  }

  const summonerName = input.slice(0, index).trim();
  const tagLine = input.slice(index + 1).trim();

  return [summonerName ?? "", tagLine ?? ""];
}

type ChampionData = {
  id: string; // PascalCase ID, e.g., "MissFortune"
  key: string; // Numeric ID, e.g., "21"
  name: string; // Full in-game name, e.g., "Miss Fortune"
  title: string;
};

/**
 * Given a championName (PascalCase like "MissFortune"),
 * returns the official in-game name (e.g., "Miss Fortune").
 *
 * @param championName the unique PascalCase identifier for the champion
 * @returns the official in-game name, or the gameName if there is no in-game
 * @throws an {@link Error} when champion data cannot be fetched
 */
export async function getChampionInGameName(
  championName: string,
): Promise<string | null> {
  try {
    // Fetch Data Dragon champion list
    const res = await fetch(
      "https://ddragon.leagueoflegends.com/cdn/14.20.1/data/en_US/champion.json",
    );
    if (!res.ok) throw new Error("Failed to fetch champion data");

    const data: { data: Record<string, ChampionData> } = (await res.json()) as {
      data: Record<string, ChampionData>;
    };

    const champion: ChampionData | undefined = data.data[championName];
    if (!champion) return null;

    return champion.name;
  } catch (err) {
    console.error("Error fetching champion in-game name:", err);
    return null;
  }
}

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

export function getTopChampions(data: MatchEntry): ChampionStat[] {
  const champions = Object.entries(data.wins.champion || {}).map(
    ([name, stats]) => {
      const { kills, deaths, assists, games } = stats.stats.aggregate;
      return {
        name,
        games,
        kda: (kills + assists) / Math.max(1, deaths),
      };
    },
  );

  return champions.sort((a, b) => b.games - a.games).slice(0, 3);
}

export function getBestMatchups(data: MatchEntry, limit = 3): Matchup[] {
  const matchups: Matchup[] = [];

  Object.entries(data.wins.champion || {}).forEach(([champName, champData]) => {
    Object.entries(champData.position || {}).forEach(
      ([positionKey, posData]) => {
        const position = positionKey as RiotPosition;

        Object.entries(posData.matchup || {}).forEach(
          ([opponent, matchupData]) => {
            const wins = matchupData.player?.aggregate?.games ?? 0;

            const losses =
              data.losses?.champion?.[champName]?.position?.[position]
                ?.matchup?.[opponent]?.player?.aggregate?.games ?? 0;

            const totalGames = wins + losses;

            if (totalGames >= 3) {
              matchups.push({
                playerChampion: champName,
                opponentChampion: opponent,
                position,
                wins,
                games: totalGames,
                winrate: wins / totalGames,
              });
            }
          },
        );
      },
    );
  });

  return matchups.sort((a, b) => b.winrate - a.winrate).slice(0, limit);
}

export function getBestPosition(data: MatchEntry): PositionStat | null {
  const positions: Record<
    string,
    {
      kills: number;
      deaths: number;
      assists: number;
      games: number;
    }
  > = {};

  Object.values(data.wins.champion || {}).forEach((champData) => {
    Object.entries(champData.position || {}).forEach(([position, posData]) => {
      const { kills, deaths, assists, games } = posData.stats.aggregate;

      positions[position] ??= { kills: 0, deaths: 0, assists: 0, games: 0 };

      positions[position].kills += kills;
      positions[position].deaths += deaths;
      positions[position].assists += assists;
      positions[position].games += games;
    });
  });

  const positionStats: PositionStat[] = Object.entries(positions).map(
    ([position, stats]) => ({
      position,
      games: stats.games,
      avgKda: (stats.kills + stats.assists) / Math.max(1, stats.deaths),
    }),
  );

  return positionStats.length > 0
    ? (positionStats.sort((a, b) => b.avgKda - a.avgKda)[0] ?? null)
    : null;
}

export function getBestMatch(data: MatchEntry): {
  champion: string;
  kda: number;
  kills: number;
  deaths: number;
  assists: number;
} | null {
  const champions = Object.entries(data.wins.champion || {}).map(
    ([name, stats]) => {
      const { kills, deaths, assists } = stats.stats.aggregate;
      return {
        champion: name,
        kills,
        deaths,
        assists,
        kda: (kills + assists) / Math.max(1, deaths),
      };
    },
  );

  return champions.length > 0
    ? (champions.sort((a, b) => b.kda - a.kda)[0] ?? null)
    : null;
}

export function getTotalTimePlayed(data: MatchEntry) {
  const totalSeconds = data.wins.stats.aggregate.gameDuration;
  const totalHours = totalSeconds / 3600;
  const avgGameLength = totalSeconds / data.wins.stats.aggregate.games / 60;

  return {
    totalHours,
    avgGameLength,
  };
}

export function getTopChampionsByTimePlayed(data: MatchEntry) {
  const champions = Object.entries(data.wins.champion || {}).map(
    ([name, stats]) => {
      const { games, gameDuration } = stats.stats.aggregate;
      return {
        name,
        games,
        timePlayedHours: gameDuration / 3600,
      };
    },
  );

  return champions
    .sort((a, b) => b.timePlayedHours - a.timePlayedHours)
    .slice(0, 3);
}
