import { match } from "assert";
import type { MatchDto } from "../riot/dtos/match/match.dto";
import type { ParticipantDto } from "../riot/dtos/match/participant.dto";
import { fetchMatchInfo } from "../riot/riot-api-utils";

export interface ChampionGames extends Record<string, number | string> {
  name: string;
  games: number;
}

export interface LaneGames extends Record<string, number | string> {
  lane: string;
  games: number;
}

export interface MatchStats extends Record<string, number | string | boolean> {
  kills: number;
  deaths: number;
  assists: number;
  champion: string;
  lane: string;
  win: boolean;
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

export async function getLaneGames(
  puuid: string,
  matchIds: string[],
): Promise<LaneGames[]> {
  const lanes: Record<string, number> = {};
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
      const lane: string | undefined = playerInfo.lane;
      lanes[lane] = (lanes[lane] ?? 0) + 1;
    } catch {
      continue;
    }
    // TODO: replace this with rate limiter
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return Object.entries(lanes)
    .map(([lane, games]) => ({ lane, games }))
    .sort((a, b) => b.games - a.games);
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
