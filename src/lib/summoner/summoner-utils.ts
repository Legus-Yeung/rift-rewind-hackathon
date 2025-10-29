import type { MatchDto } from "../riot/dtos/match/match.dto";
import type { ParticipantDto } from "../riot/dtos/match/participant.dto";
import { fetchMatchInfo } from "../riot/riot-api-utils";
import { RiotPosition } from "../riot/enums/riot-position";

export interface ChampionGames extends Record<string, number | string> {
  name: string;
  games: number;
}

export interface PositionEntry {
  positionKey: RiotPosition;
  positionStats: PositionStats;
}

export interface PositionStats {
  games: number;
}

export interface MatchStats {
  kills: number;
  deaths: number;
  assists: number;
  champion: string;
  lane: string;
  win: boolean;
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

export interface MatchupStats {
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
}

function createMatchupKey(key: MatchupKey): string {
  return `${key.playerChampion}-${key.opponentChampion}-${key.position}`;
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
 * Gets the number of games for each champion for a given summoner and matches.
 *
 * @param puuid - puuid of the summoner
 * @param matchIds - match ids to iterate through
 * @param - optional number of champions to return, sorted by most played (defaults to all champions)
 * @returns an array of objects with each champion's name and their respective number of games
 */
export async function getChampionGames(
  puuid: string,
  matchIds: string[],
  topX: number = -1,
): Promise<ChampionGames[]> {
  const champions: Record<string, number> = {};
  for (const matchId of matchIds) {
    try {
      const matchInfo: MatchDto = await fetchMatchInfo(matchId);
      const playerIndex: number =
        matchInfo.metadata.participants.indexOf(puuid);
      const playerInfo: ParticipantDto | undefined =
        matchInfo.info.participants[playerIndex];
      if (playerInfo == null) {
        continue;
      }
      const champName: string = playerInfo.championName;
      champions[champName] = (champions[champName] ?? 0) + 1;
    } catch {
      continue;
    }

    // TODO: replace this with rate limiter
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return Object.entries(champions)
    .map(([name, games]) => ({ name, games }))
    .sort((a, b) => b.games - a.games)
    .slice(0, topX);
}

export async function getPositionGames(
  puuid: string,
  matchIds: string[],
): Promise<PositionEntry[]> {
  const positionEntries: Record<string, PositionEntry> = {};

  for (const matchId of matchIds) {
    try {
      const matchInfo: MatchDto = await fetchMatchInfo(matchId);
      const playerInfo: ParticipantDto = getPlayerInfo(puuid, matchInfo);
      const position: RiotPosition = playerInfo.teamPosition;

      if (!positionEntries[position]) {
        const positionEntry: PositionEntry = {
          positionKey: position,
          positionStats: {
            games: 1,
          },
        };
        positionEntries[position] = positionEntry;
      } else {
        const positionEntry: PositionEntry = positionEntries[position];
        const positionStats: PositionStats = positionEntry.positionStats;
        positionStats.games += 1;
      }
    } catch (error) {
      console.warn(error);
      continue;
    }

    // TODO: replace with rate limiter
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const positionOrder = Object.values(RiotPosition);
  return Object.entries(positionEntries)
    .map(([_, stats]) => stats)
    .sort(
      (a, b) =>
        positionOrder.indexOf(a.positionKey) -
        positionOrder.indexOf(b.positionKey),
    );
}

export async function getBestMatch(
  puuid: string,
  matchIds: string[],
): Promise<MatchDto> {
  let bestKda: number = 0;
  let bestMatchDto: MatchDto | undefined = undefined;
  for (const matchId of matchIds) {
    try {
      const matchInfo: MatchDto = await fetchMatchInfo(matchId);
      const playerIndex: number =
        matchInfo.metadata.participants.indexOf(puuid);
      const playerInfo: ParticipantDto | undefined =
        matchInfo.info.participants[playerIndex];
      if (playerInfo == null) {
        continue;
      }
      const kills: number = playerInfo.kills;
      const deaths: number = playerInfo.deaths;
      const assists: number = playerInfo.assists;
      const kda: number = (kills + assists) / (deaths == 0 ? 1 : deaths);

      if (kda > bestKda) {
        bestKda = kda;
        bestMatchDto = matchInfo;
      }
    } catch {
      continue;
    }

    // TODO: replace this with rate limiter
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  if (bestMatchDto) {
    return bestMatchDto;
  } else {
    throw new Error(`Could not retrieve any best match for puuid ${puuid}`);
  }
}

export function getMatchStats(puuid: string, matchDto: MatchDto): MatchStats {
  const playerIndex: number = matchDto.metadata.participants.indexOf(puuid);
  const playerInfo: ParticipantDto | undefined =
    matchDto.info.participants[playerIndex];
  if (playerInfo == null) {
    throw new Error(
      `Could not find puuid ${puuid} in matchDto with id ${
        matchDto.metadata.matchId
      }`,
    );
  }
  const matchStats: MatchStats = {
    kills: playerInfo.kills,
    deaths: playerInfo.deaths,
    assists: playerInfo.assists,
    champion: playerInfo.championName,
    lane: playerInfo.lane,
    win: playerInfo.win,
  };
  return matchStats;
}

export async function getAllMatchups(
  puuid: string,
  matchIds: string[],
): Promise<MatchupEntry[]> {
  let matchups: Record<string, MatchupEntry> = {};
  for (const matchId of matchIds) {
    try {
      const matchInfo: MatchDto = await fetchMatchInfo(matchId);
      const playerInfo: ParticipantDto = getPlayerInfo(puuid, matchInfo);
      const opponentPuuid: string = getLaneOpponent(puuid, matchInfo);
      const opponentInfo: ParticipantDto = getPlayerInfo(
        opponentPuuid,
        matchInfo,
      );
      const matchupKeyObj: MatchupKey = {
        position: playerInfo.individualPosition,
        playerChampion: playerInfo.championName,
        opponentChampion: opponentInfo.championName,
      };
      const matchupKey: string = createMatchupKey(matchupKeyObj);

      if (!matchups[matchupKey]) {
        const playerStats: MatchupStats = {
          wins: playerInfo.win ? 1 : 0,
          kills: playerInfo.kills,
          deaths: playerInfo.deaths,
          assists: playerInfo.assists,
        };
        const opponentStats: MatchupStats = {
          wins: opponentInfo.win ? 1 : 0,
          kills: opponentInfo.kills,
          deaths: opponentInfo.deaths,
          assists: opponentInfo.assists,
        };
        matchups[matchupKey] = {
          matchupKey: matchupKeyObj,
          playerStats: playerStats,
          opponentStats: opponentStats,
        };
      } else {
        const matchupInfo: MatchupEntry = matchups[matchupKey];
        const playerStats: MatchupStats = matchupInfo.playerStats;
        const opponentStats: MatchupStats = matchupInfo.opponentStats;

        playerStats.wins += playerInfo.win ? 1 : 0;
        playerStats.kills += playerInfo.kills;
        playerStats.deaths += playerInfo.deaths;
        playerStats.assists += playerInfo.assists;

        opponentStats.wins += opponentInfo.win ? 1 : 0;
        opponentStats.kills += opponentInfo.kills;
        opponentStats.deaths += opponentInfo.deaths;
        opponentStats.assists += opponentInfo.assists;
      }
    } catch (error) {
      console.warn(error);
      continue;
    }

    // TODO: replace this with rate limiter
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return Object.values(matchups);
}

function calculateWinRate(matchup: MatchupEntry): number {
  return (
    matchup.playerStats.wins /
    (matchup.playerStats.wins + matchup.opponentStats.wins)
  );
}

export async function getBestMatchupByChampion(
  puuid: string,
  matchIds: string[],
  champion: string,
): Promise<MatchupEntry> {
  const allMatchups = await getAllMatchups(puuid, matchIds);
  const filteredMatchups = allMatchups.filter(
    (m) => m.matchupKey.playerChampion === champion,
  );
  if (filteredMatchups.length == 0) {
    throw new Error(
      `Could not find best matchup by champion ${champion} for PUUID ${puuid} given match IDs ${matchIds}`,
    );
  }
  return filteredMatchups.reduce((best, cur) => {
    const bestWinrate = calculateWinRate(best);
    const curWinrate = calculateWinRate(cur);
    return curWinrate > bestWinrate ? cur : best;
  });
}

export async function getBestMatchupByPosition(
  puuid: string,
  matchIds: string[],
  position: RiotPosition,
): Promise<MatchupEntry> {
  const allMatchups = await getAllMatchups(puuid, matchIds);
  const filteredMatchups = allMatchups.filter(
    (m) => m.matchupKey.position === position,
  );
  if (filteredMatchups.length == 0) {
    throw new Error(
      `Could not find best matchup by position ${position} for PUUID ${puuid} given match IDs ${matchIds}`,
    );
  }
  return filteredMatchups.reduce((best, cur) => {
    const bestWinrate = calculateWinRate(best);
    const curWinrate = calculateWinRate(cur);
    return curWinrate > bestWinrate ? cur : best;
  });
}

export async function getBestMatchupPerPosition(
  puuid: string,
  matchIds: string[],
): Promise<MatchupEntry[]> {
  const positions: RiotPosition[] = Object.values(RiotPosition);
  const allMatchups = await getAllMatchups(puuid, matchIds);
  let positionMatchups: MatchupEntry[] = [];
  for (const position of positions) {
    const filteredMatchups = allMatchups.filter(
      (m) => m.matchupKey.position === position,
    );
    if (filteredMatchups.length == 0) {
      continue;
    }
    positionMatchups.push(
      filteredMatchups.reduce((best, cur) => {
        const bestWinrate = calculateWinRate(best);
        const curWinrate = calculateWinRate(cur);
        return curWinrate > bestWinrate ? cur : best;
      }),
    );
  }
  return positionMatchups;
}

export async function getBestMatchupByChampionAndPosition(
  puuid: string,
  matchIds: string[],
  champion: string,
  position: string,
): Promise<MatchupEntry> {
  const allMatchups = await getAllMatchups(puuid, matchIds);
  const filteredMatchups = allMatchups.filter(
    (m) =>
      m.matchupKey.position === position &&
      m.matchupKey.playerChampion === champion,
  );
  if (filteredMatchups.length == 0) {
    throw new Error(
      `Could not find best matchup by position ${position} and champion ${champion} for PUUID ${puuid} given match IDs ${matchIds}`,
    );
  }
  return filteredMatchups.reduce((best, cur) => {
    const bestWinrate = calculateWinRate(best);
    const curWinrate = calculateWinRate(cur);
    return curWinrate > bestWinrate ? cur : best;
  });
}
