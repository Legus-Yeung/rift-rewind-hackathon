import type { MatchDto } from "../riot/dtos/match/match.dto";
import type { ParticipantDto } from "../riot/dtos/match/participant.dto";
import { RiotPosition } from "../riot/enums/riot-position";
import { apiRequest } from "../api/request-utils";
import { baseUrl } from "../api/url-utils";

type ChampionData = {
  id: string; // PascalCase ID, e.g., "MissFortune"
  key: string; // Numeric ID, e.g., "21"
  name: string; // Full in-game name, e.g., "Miss Fortune"
  title: string;
};

export interface CoreStats {
  kills: number;
  deaths: number;
  assists: number;
  wins: number;
  games: number;
}

export interface PositionEntry {
  positionKey: RiotPosition;
  positionStats: PositionStats;
}

export interface PositionStats extends CoreStats {}

export interface ChampionKey {
  champion: string;
}

export interface ChampionEntry {
  championKey: ChampionKey;
  championStats: Record<RiotPosition, ChampionStats>;
}

export interface ChampionStats extends CoreStats {
  matchups: MatchupEntry[];
}

export interface MatchupEntry {
  matchupKey: MatchupKey;
  playerStats: MatchupStats;
  opponentStats: MatchupStats;
}

export interface MatchupKey {
  position: RiotPosition;
  playerChampion: string;
  opponentChampion: string;
}

export interface MatchupStats extends CoreStats {}

function createMatchupKey(key: MatchupKey): string {
  return `${key.playerChampion}-${key.opponentChampion}-${key.position}`;
}

function createChampionKey(key: ChampionKey): string {
  return `${key.champion}`;
}

function createCoreStats(): CoreStats {
  return {
    kills: 0,
    deaths: 0,
    assists: 0,
    wins: 0,
    games: 0,
  };
}

function updateCoreStats(
  stats: CoreStats,
  kills: number,
  deaths: number,
  assists: number,
  wins: number,
  games: number,
) {
  stats.kills += kills;
  stats.deaths += deaths;
  stats.assists += assists;
  stats.wins += wins;
  stats.games += games;
}

/**
 * Finds the info for a player in a given match
 *
 * @param puuid
 * @param matchDto
 * @returns a {@link ParticipantDto} of the player
 * @throws an {@link Error} if the player does not exist within the match
 */
function getPlayerInfo(puuid: string, matchDto: MatchDto): ParticipantDto {
  const playerIndex: number = matchDto.metadata.participants.indexOf(puuid);
  const playerInfo: ParticipantDto | undefined =
    matchDto.info.participants[playerIndex];
  if (playerInfo == null) {
    throw new Error(
      `Player of PUUID ${puuid} could not be found in match of ID ${matchDto.metadata.matchId}`,
    );
  }
  return playerInfo;
}

/**
 * Finds the lane opponent of a given player in a given match
 *
 * @param puuid
 * @param matchDto
 * @returns the puuid of the player's lane opponent in the match
 * @throws an {@link Error} if a lane opponent can not be found for the player in a given match
 */
function getLaneOpponent(puuid: string, matchDto: MatchDto): string {
  const playerInfo: ParticipantDto = getPlayerInfo(puuid, matchDto);
  for (const participant of matchDto.metadata.participants) {
    if (participant == puuid) {
      continue;
    }
    const opponentInfo: ParticipantDto = getPlayerInfo(participant, matchDto);
    if (opponentInfo.teamPosition == playerInfo.teamPosition) {
      return opponentInfo.puuid;
    }
  }
  throw new Error(
    `Could not find lane opponent for player of PUUID ${puuid} in match of ID ${matchDto.metadata.matchId}`,
  );
}

/**
 * Parses the gameName and tagLine of a summoner from a "gameName-tagLine" formatted string
 *
 * @param str - a string in the format "gameName-tagLine" ; gameName and/or tagLine can be empty
 * @returns the gameName and tagLine of the given summoner, replaced with empty strings if empty
 */
export function parseSummoner(str: string): [string, string] {
  const index = str.lastIndexOf("-");
  const gameName: string = str.slice(0, index);
  const tagLine: string = str.slice(index + 1);
  const summoner: [string, string] = [gameName, tagLine];
  return summoner;
}

/**
 * Retrieves aggregate champion info for use in all summoner statistics. Returns results in no particular order.
 *
 * @param puuid - puuid of the summoner
 * @param matchIds - match ids to iterate through
 * @param - optional number of champions to return, sorted by most played (defaults to all champions)
 * @returns an array of objects with each champion's name and their respective number of games
 */
export async function getChampionGames(
  puuid: string,
  matchIds: string[],
): Promise<ChampionEntry[]> {
  const championEntries: Record<string, ChampionEntry> = {};
  const matchupEntries: Record<string, MatchupEntry> = {};

  const promises = matchIds.map(async (matchId) => {
    try {
      const matchInfo: MatchDto = await apiRequest<MatchDto>(
        `${baseUrl}/api/riot?action=match-info&matchId=${matchId}`,
      );
      const playerInfo = getPlayerInfo(puuid, matchInfo);
      const opponentPuuid = getLaneOpponent(puuid, matchInfo);
      const opponentInfo = getPlayerInfo(opponentPuuid, matchInfo);

      const championKeyObj = { champion: playerInfo.championName };
      const championKey = createChampionKey(championKeyObj);
      const matchupKeyObj = {
        position: playerInfo.teamPosition,
        playerChampion: playerInfo.championName,
        opponentChampion: opponentInfo.championName,
      };
      const matchupKey = createMatchupKey(matchupKeyObj);

      championEntries[championKey] ??= {
        championKey: championKeyObj,
        championStats: {
          TOP: { ...createCoreStats(), matchups: [] },
          MIDDLE: { ...createCoreStats(), matchups: [] },
          JUNGLE: { ...createCoreStats(), matchups: [] },
          BOTTOM: { ...createCoreStats(), matchups: [] },
          UTILITY: { ...createCoreStats(), matchups: [] },
          UNKNOWN: { ...createCoreStats(), matchups: [] },
        },
      };

      matchupEntries[matchupKey] ??= {
        matchupKey: matchupKeyObj,
        playerStats: { ...createCoreStats() },
        opponentStats: { ...createCoreStats() },
      };

      const matchupInfo = matchupEntries[matchupKey];
      updateCoreStats(
        matchupInfo.playerStats,
        playerInfo.kills,
        playerInfo.deaths,
        playerInfo.assists,
        playerInfo.win ? 1 : 0,
        1,
      );
      updateCoreStats(
        matchupInfo.opponentStats,
        opponentInfo.kills,
        opponentInfo.deaths,
        opponentInfo.assists,
        opponentInfo.win ? 1 : 0,
        1,
      );
      const championStats =
        championEntries[championKey].championStats[matchupKeyObj.position];
      updateCoreStats(
        championStats,
        playerInfo.kills,
        playerInfo.assists,
        playerInfo.deaths,
        playerInfo.win ? 1 : 0,
        1,
      );
    } catch (error) {
      console.warn(error);
    }
  });

  await Promise.all(promises);

  for (const matchupInfo of Object.values(matchupEntries)) {
    const championKeyObj = { champion: matchupInfo.matchupKey.playerChampion };
    const championKey = createChampionKey(championKeyObj);
    if (!championEntries[championKey]) {
      throw new Error(
        `Could not find championKey ${championKey} within champion entries`,
      );
    }
    championEntries[championKey].championStats[
      matchupInfo.matchupKey.position
    ].matchups.push(matchupInfo);
  }

  return Object.values(championEntries);
}

export function getPositionStats(
  championEntries: ChampionEntry[],
  position: RiotPosition,
): PositionEntry {
  const positionEntry: PositionEntry = {
    positionKey: position,
    positionStats: {
      ...createCoreStats(),
    },
  };
  for (const championEntry of championEntries) {
    positionEntry.positionStats.games +=
      championEntry.championStats[position].games;
  }
  return positionEntry;
}

export async function getBestMatch(
  puuid: string,
  matchIds: string[],
): Promise<MatchDto> {
  const matchPromises = matchIds.map(async (matchId) => {
    try {
      const matchInfo: MatchDto = await apiRequest<MatchDto>(
        `${baseUrl}/api/riot?action=match-info&matchId=${matchId}`,
      );
      const playerInfo: ParticipantDto = getPlayerInfo(puuid, matchInfo);
      const kills = playerInfo.kills;
      const deaths = playerInfo.deaths;
      const assists = playerInfo.assists;
      const kda = (kills + assists) / (deaths === 0 ? 1 : deaths);

      return { matchInfo, kda };
    } catch (err) {
      console.error(err);
      return null;
    }
  });

  const results = await Promise.all(matchPromises);
  const validResults = results.filter(
    (res): res is { matchInfo: MatchDto; kda: number } => res !== null,
  );

  if (validResults.length === 0) {
    throw new Error(`Could not retrieve any best match for puuid ${puuid}`);
  }
  const bestMatch = validResults.reduce((best, current) =>
    current.kda > best.kda ? current : best,
  );

  return bestMatch.matchInfo;
}

function calculateScore(stats: CoreStats): number {
  return stats.wins / stats.games;
}

/**
 * Gets the best matchup for a given champion for each position.
 *
 * @param championEntriesw
 * @param champion
 * @returns
 */
export function getBestMatchupsByChampion(
  championEntries: ChampionEntry[],
  champion: string,
): MatchupEntry[] {
  const championEntry: ChampionEntry | undefined = championEntries.find(
    (m) => m.championKey.champion === champion,
  );
  if (!championEntry) {
    throw new Error(`Could not find best matchup by champion ${champion}`);
  }
  const bestMatchups: MatchupEntry[] = [];
  // best matchups for each role
  for (const position of Object.values(championEntry.championStats)) {
    if (position.matchups.length == 0) continue;
    const bestMatchup: MatchupEntry = position.matchups.reduce((best, cur) => {
      const bestWinrate = calculateScore(best.playerStats);
      const curWinrate = calculateScore(cur.playerStats);
      return curWinrate > bestWinrate ? cur : best;
    });
    bestMatchups.push(bestMatchup);
  }
  // best matchup out of all positions
  return bestMatchups;
}

/**
 * Gets the best matchup for a given champion out of all positions.
 *
 * @param championEntries
 * @param champion
 * @returns
 */
export function getBestMatchupByChampion(
  championEntries: ChampionEntry[],
  champion: string,
): MatchupEntry {
  const bestMatchups: MatchupEntry[] = getBestMatchupsByChampion(
    championEntries,
    champion,
  );
  if (bestMatchups.length == 0) {
    throw new Error(
      `Could not find best role matchup for champion ${champion}: No entries with the champion exist`,
    );
  }
  return bestMatchups.reduce((best, cur) => {
    const bestWinrate = calculateScore(best.playerStats);
    const curWinrate = calculateScore(cur.playerStats);
    return curWinrate > bestWinrate ? cur : best;
  });
}

/**
 * Gets the best matchup for a given position.
 *
 * @param championEntries
 * @param position
 * @returns
 */
export function getBestMatchupByPosition(
  championEntries: ChampionEntry[],
  position: RiotPosition,
): MatchupEntry {
  let bestPositionMatchup: MatchupEntry | undefined;
  for (const championEntry of championEntries) {
    const bestMatchups: MatchupEntry[] =
      championEntry.championStats[position].matchups;
    if (bestMatchups.length == 0) {
      continue;
    }
    const bestMatchupChampion: MatchupEntry = bestMatchups.reduce(
      (best, cur) => {
        const bestWinrate = calculateScore(best.playerStats);
        const curWinrate = calculateScore(cur.playerStats);
        return curWinrate > bestWinrate ? cur : best;
      },
    );
    if (
      !bestPositionMatchup ||
      calculateScore(bestPositionMatchup.playerStats) <
        calculateScore(bestMatchupChampion.playerStats)
    ) {
      bestPositionMatchup = bestMatchupChampion;
    }
  }
  if (!bestPositionMatchup) {
    throw new Error(`Could not find best matchup for position ${position}`);
  }
  return bestPositionMatchup;
}

/**
 * Gets the best matchup for every position.
 *
 * @param championEntries
 * @param position
 * @returns
 */
export function getBestMatchupPerPosition(
  championEntries: ChampionEntry[],
): MatchupEntry[] {
  const bestPositionMatchups: Record<string, MatchupEntry> = {};
  for (const championEntry of championEntries) {
    for (const position of Object.values(RiotPosition)) {
      const bestMatchups: MatchupEntry[] =
        championEntry.championStats[position].matchups;
      if (bestMatchups.length == 0) {
        continue;
      }
      const bestMatchupChampion: MatchupEntry = bestMatchups.reduce(
        (best, cur) => {
          const bestWinrate = calculateScore(best.playerStats);
          const curWinrate = calculateScore(cur.playerStats);
          return curWinrate > bestWinrate ? cur : best;
        },
      );
      if (
        !bestPositionMatchups[position] ||
        calculateScore(bestPositionMatchups[position].playerStats) <
          calculateScore(bestMatchupChampion.playerStats)
      ) {
        bestPositionMatchups[position] = bestMatchupChampion;
      }
    }
  }
  return Object.values(bestPositionMatchups);
}

export function getBestMatchupByChampionAndPosition(
  championEntries: ChampionEntry[],
  champion: string,
  position: RiotPosition,
): MatchupEntry {
  const bestMatchups: MatchupEntry[] = getBestMatchupsByChampion(
    championEntries,
    champion,
  );
  if (bestMatchups.length == 0) {
    throw new Error(
      `Could not find best role matchup for champion ${champion}: No entries with the champion exist`,
    );
  }
  const bestMatchup: MatchupEntry | undefined = bestMatchups.find((e) => {
    return e.matchupKey.position == position;
  });
  if (!bestMatchup) {
    throw new Error(
      `Could not find best matchup for champion ${champion} in position ${position}`,
    );
  }
  return bestMatchup;
}

export function getTotalGames(entry: ChampionEntry): number {
  const games: number = Object.values(entry.championStats).reduce(
    (total, cur) => {
      return total + cur.games;
    },
    0,
  );
  return games;
}

export function getMostPlayedChampions(
  entries: ChampionEntry[],
  topX: number,
): ChampionEntry[] {
  const topChamps: ChampionEntry[] = entries
    .sort((a, b) => {
      const aGames: number = getTotalGames(a);
      const bGames: number = getTotalGames(b);
      return aGames - bGames;
    })
    .slice(0, topX);
  return topChamps;
}

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
