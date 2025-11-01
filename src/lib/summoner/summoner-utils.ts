import type { MatchDto } from "../riot/dtos/match/match.dto";
import type { ParticipantDto } from "../riot/dtos/match/participant.dto";
import { fetchMatchInfo } from "../riot/riot-api-utils";

export interface ChampionGames extends Record<string, number | string> {
  name: string;
  games: number;
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
  topX = -1,
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
