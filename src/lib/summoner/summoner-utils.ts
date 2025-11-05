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

export interface Stats {
  aggregate: MatchStats;
  average: AverageStats;
}

export interface MatchStats {
  kills: number;
  deaths: number;
  assists: number;
  games: number;
  //etc
}

export interface AverageStats {
  perDeath: MatchStats;
  perGame: MatchStats;
}

export interface SummonerEntry {
  wins: OutcomeEntry;
  losses: OutcomeEntry;
}

export interface OutcomeEntry {
  stats: Stats;
  champion: Record<string, ChampionEntry>;
}

export interface ChampionEntry {
  stats: Stats;
  position: Record<RiotPosition, PositionEntry>;
}

export interface PositionEntry {
  stats: Stats;
  matchup: Record<string, MatchupEntry>;
}

export interface MatchupEntry {
  player: Stats;
  opponent: Stats;
}

/** Creates an empty Stats object */
export function createStats(): Stats {
  return {
    aggregate: createMatchStats(),
    average: createAverageStats(),
  };
}

/** Creates an empty AverageStats object */
export function createAverageStats(): AverageStats {
  return {
    perDeath: createMatchStats(),
    perGame: createMatchStats(),
  };
}

/** Creates an empty MatchStats object */
export function createMatchStats(): MatchStats {
  return {
    kills: 0,
    deaths: 0,
    assists: 0,
    games: 0,
  };
}

export function updateMatchStats(
  stats: MatchStats,
  delta: Partial<MatchStats>,
): void {
  Object.entries(delta).forEach(([key, value]) => {
    const k = key as keyof MatchStats;
    stats[k] =
      typeof value === "number"
        ? (stats[k] as number) + (value as number)
        : value;
  });
}

export function parseMatchStats(participant: ParticipantDto): MatchStats {
  const stats: MatchStats = {
    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,
    games: 1,
  };
  return stats;
}

export function averageMatchStats(
  stats: MatchStats,
  denominator: number,
): MatchStats {
  if (denominator === 0) return { ...stats };
  const result = { ...stats };
  (Object.keys(stats) as (keyof MatchStats)[]).forEach((key) => {
    const value = stats[key];
    result[key] = (value / denominator) as MatchStats[typeof key];
  });
  return result;
}

function averageStats(stats: Stats) {
  stats.average.perDeath = averageMatchStats(
    stats.aggregate,
    stats.aggregate.deaths,
  );
  stats.average.perGame = averageMatchStats(
    stats.aggregate,
    stats.aggregate.games,
  );
}

function averageOutcomeStats(outcome: OutcomeEntry): void {
  averageStats(outcome.stats);
  for (const champion of Object.keys(outcome.champion)) {
    const championEntry: ChampionEntry | undefined = outcome.champion[champion];
    if (!championEntry) continue;
    averageStats(championEntry.stats);
    for (const position of Object.keys(
      championEntry.position,
    ) as RiotPosition[]) {
      const positionEntry: PositionEntry = championEntry.position[position];
      averageStats(positionEntry.stats);
      for (const matchup of Object.keys(positionEntry.matchup)) {
        const matchupEntry: MatchupEntry | undefined =
          positionEntry.matchup[matchup];
        if (!matchupEntry) continue;
        averageStats(positionEntry.stats);
      }
    }
  }
}

function averageAllStats(summoner: SummonerEntry): void {
  averageOutcomeStats(summoner.wins);
  averageOutcomeStats(summoner.losses);
}

/** Creates an empty SummonerEntry */
export function createSummonerEntry(): SummonerEntry {
  return {
    wins: createOutcomeEntry(),
    losses: createOutcomeEntry(),
  };
}

/** Creates an empty OutcomeEntry */
export function createOutcomeEntry(): OutcomeEntry {
  return {
    stats: createStats(),
    champion: {},
  };
}

/** Creates an empty ChampionEntry */
export function createChampionEntry(): ChampionEntry {
  const roles: Record<RiotPosition, PositionEntry> = {
    TOP: createPositionEntry(),
    JUNGLE: createPositionEntry(),
    MIDDLE: createPositionEntry(),
    BOTTOM: createPositionEntry(),
    UTILITY: createPositionEntry(),
    UNKNOWN: createPositionEntry(),
  };
  return { stats: createStats(), position: roles };
}

/** Creates an empty PositionEntry */
export function createPositionEntry(): PositionEntry {
  return {
    stats: createStats(),
    matchup: {},
  };
}

/** Creates an empty MatchupEntry */
export function createMatchupEntry(): MatchupEntry {
  return {
    player: createStats(),
    opponent: createStats(),
  };
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
): Promise<SummonerEntry> {
  const summoner: SummonerEntry = createSummonerEntry();
  for (const matchId of matchIds) {
    try {
      // get Riot dtos
      const matchInfo: MatchDto = await apiRequest<MatchDto>(
        `${baseUrl}/api/riot?action=match-info&matchId=${matchId}`,
      );
      const playerInfo: ParticipantDto = getPlayerInfo(puuid, matchInfo);
      const opponentPuuid: string = getLaneOpponent(puuid, matchInfo);
      const opponentInfo: ParticipantDto = getPlayerInfo(
        opponentPuuid,
        matchInfo,
      );

      // ready summoner heirarchy for entry
      const outcome: OutcomeEntry =
        summoner[playerInfo.win ? "wins" : "losses"];
      const champion: ChampionEntry = (outcome.champion[
        playerInfo.championName
      ] ??= createChampionEntry());
      const position: PositionEntry =
        champion.position[playerInfo.teamPosition];
      const matchup: MatchupEntry = (position.matchup[
        opponentInfo.championName
      ] ??= createMatchupEntry());

      // get the MatchStats for the given match for both players in the matchup
      const playerStats: MatchStats = parseMatchStats(playerInfo);
      const opponentStats: MatchStats = parseMatchStats(opponentInfo);

      // update stats
      updateMatchStats(outcome.stats.aggregate, playerStats);
      updateMatchStats(champion.stats.aggregate, playerStats);
      updateMatchStats(position.stats.aggregate, playerStats);
      updateMatchStats(matchup.player.aggregate, playerStats);
      updateMatchStats(matchup.opponent.aggregate, opponentStats);
    } catch (error) {
      console.warn(error);
    }
  }

  averageAllStats(summoner);
  return summoner;
}

// best matchups for each champion position
export function getBestMatchupsByChampion(
  summoner: SummonerEntry,
  champion: string,
): void {
  return;
}

// best matchup out of all the positions
export function getBestMatchupByChampion(
  summoner: SummonerEntry,
  champion: string,
): void {
  return;
}

// best matchup for every position
export function getBestMatchupPerPosition(summoner: SummonerEntry): void {
  return;
}

export function getMostPlayedChampions(
  summoner: SummonerEntry,
  topX: number,
): string[] {
  return [];
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
