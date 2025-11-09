import type { MatchDto } from "../riot/dtos/match/match.dto";
import type { ParticipantDto } from "../riot/dtos/match/participant.dto";
import { RiotPosition } from "../riot/enums/riot-position";
import { apiRequest } from "../api/request-utils";
import { baseUrl } from "../api/url-utils";
import type { InfoDto } from "../riot/dtos/match/info.dto";
import type { ChallengesDto } from "../riot/dtos/match/challenges.dto";

import {
  type Stats,
  type AggregateStats,
  type AverageStats,
  type MinMaxStats,
  AGGREGATE_FIELDS,
  AVERAGE_FIELDS,
  MIN_MAX_FIELDS,
  PARTICIPANT_AGGREGATE_FIELDS,
  INFO_AGGREGATE_FIELDS,
  CHALLENGES_AGGREGATE_FIELDS,
  PARTICIPANT_AVERAGE_FIELDS,
  INFO_AVERAGE_FIELDS,
  CHALLENGES_AVERAGE_FIELDS,
  PARTICIPANT_MIN_MAX_FIELDS,
  INFO_MIN_MAX_FIELDS,
  CHALLENGES_MIN_MAX_FIELDS,
  type OutcomeEntry,
  type ChampionEntry,
  type PositionEntry,
  type MatchupEntry,
  type SummonerEntry,
} from "./summoner-interface-utils";

/** Creates an empty Stats object */
function createStats(): Stats {
  return {
    aggregate: createAggregateStats(),
    average: createAverageStats(),
    min: createMinMaxStats(),
    max: createMinMaxStats(),
  };
}

/** Creates an empty MatchStats object */
function createAggregateStats(): AggregateStats {
  const stats = {} as AggregateStats;
  for (const key of AGGREGATE_FIELDS) {
    stats[key] = 0;
  }
  return stats;
}

/** Creates an empty MatchStats object */
function createAverageStats(): AverageStats {
  const stats = {} as AverageStats;
  for (const key of AVERAGE_FIELDS) {
    stats[key] = 0;
  }
  return stats;
}

/** Creates an empty MatchStats object */
function createMinMaxStats(): MinMaxStats {
  const stats = {} as MinMaxStats;
  for (const key of MIN_MAX_FIELDS) {
    stats[key] = 0;
  }
  return stats;
}

function parseAggregateStats(
  match: MatchDto,
  participant: ParticipantDto,
): AggregateStats {
  const stats = createAggregateStats();
  for (const key of PARTICIPANT_AGGREGATE_FIELDS) {
    stats[key] = (participant[key as keyof ParticipantDto] ?? 0) as number;
  }
  for (const key of INFO_AGGREGATE_FIELDS) {
    stats[key] = (match.info[key as keyof InfoDto] ?? 0) as number;
  }
  for (const key of CHALLENGES_AGGREGATE_FIELDS) {
    stats[key] = (participant.challenges[key as keyof ChallengesDto] ??
      0) as number;
  }
  stats["games"] = 1;
  return stats;
}

function parseAverageStats(
  match: MatchDto,
  participant: ParticipantDto,
): AverageStats {
  const stats = createAverageStats();
  for (const key of PARTICIPANT_AVERAGE_FIELDS) {
    stats[key] = (participant[key as keyof ParticipantDto] ?? 0) as number;
  }
  for (const key of INFO_AVERAGE_FIELDS) {
    stats[key] = (match.info[key as keyof InfoDto] ?? 0) as number;
  }
  for (const key of CHALLENGES_AVERAGE_FIELDS) {
    stats[key] = (participant.challenges[key as keyof ChallengesDto] ??
      0) as number;
  }
  return stats;
}

function parseMinMaxStats(
  match: MatchDto,
  participant: ParticipantDto,
): MinMaxStats {
  const stats = createMinMaxStats();
  for (const key of PARTICIPANT_MIN_MAX_FIELDS) {
    stats[key] = (participant[key as keyof ParticipantDto] ?? 0) as number;
  }
  for (const key of INFO_MIN_MAX_FIELDS) {
    stats[key] = (match.info[key as keyof InfoDto] ?? 0) as number;
  }
  for (const key of CHALLENGES_MIN_MAX_FIELDS) {
    stats[key] = (participant.challenges[key as keyof ChallengesDto] ??
      0) as number;
  }
  return stats;
}

function updateAggregateStats(
  stats: AggregateStats,
  delta: Partial<AggregateStats>,
): void {
  for (const key of AGGREGATE_FIELDS) {
    const current = stats[key];
    const change = delta[key];
    if (typeof current === "number" && typeof change === "number") {
      stats[key] = current + change;
    }
  }
}

function updateAverageStats(
  stats: AverageStats,
  delta: Partial<AverageStats>,
): void {
  for (const key of AVERAGE_FIELDS) {
    const current = stats[key];
    const change = delta[key];
    if (typeof current === "number" && typeof change === "number") {
      stats[key] = current + change;
    }
  }
}

function updateMinStats(stats: MinMaxStats, delta: Partial<MinMaxStats>): void {
  for (const key of MIN_MAX_FIELDS) {
    const current = stats[key];
    const change = delta[key];
    if (typeof current === "number" && typeof change === "number") {
      // If both are 0, keep 0
      if (current === 0 && change === 0) continue;
      // If current is 0, take change; if change is 0, keep current; otherwise, take min
      if (current === 0) {
        stats[key] = change as MinMaxStats[typeof key];
      } else if (change === 0) {
        // keep current (already is)
      } else {
        stats[key] = Math.min(current, change) as MinMaxStats[typeof key];
      }
    }
  }
}

function updateMaxStats(stats: MinMaxStats, delta: Partial<MinMaxStats>): void {
  for (const key of MIN_MAX_FIELDS) {
    const current = stats[key];
    const change = delta[key];
    if (typeof current === "number" && typeof change === "number") {
      stats[key] = Math.max(current, change);
    }
  }
}

function updateStats(stats: Stats, delta: Stats) {
  updateAggregateStats(stats.aggregate, delta.aggregate);
  updateAverageStats(stats.average, delta.average);
  updateMinStats(stats.min, delta.min);
  updateMaxStats(stats.max, delta.max);
}

function calculateAverageStats(
  stats: AverageStats,
  denominator: number,
): AverageStats {
  if (!denominator || !Number.isFinite(denominator)) return { ...stats };
  const result = { ...stats };
  for (const key of AVERAGE_FIELDS) {
    const value = stats[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      result[key] = value / denominator;
    }
  }
  return result;
}

function averageStats(stats: Stats) {
  stats.average = calculateAverageStats(stats.average, stats.aggregate.games);
}

function averageOutcomeStats(outcome: OutcomeEntry): void {
  averageStats(outcome.stats);
  for (const champion of Object.keys(outcome.champion)) {
    const championEntry: ChampionEntry | undefined = outcome.champion[champion];
    if (!championEntry) continue;
    averageStats(championEntry.stats);
    for (const position of Object.keys(
      championEntry.position,
    ) as (keyof typeof RiotPosition)[]) {
      const positionEntry: PositionEntry | undefined =
        championEntry.position[position];
      if (!positionEntry) continue;
      averageStats(positionEntry.stats);
      for (const matchup of Object.keys(positionEntry.matchup)) {
        const matchupEntry: MatchupEntry | undefined =
          positionEntry.matchup[matchup];
        if (!matchupEntry) continue;
        averageStats(matchupEntry.player);
        averageStats(matchupEntry.opponent);
      }
    }
  }
}

function averageAllStats(summoner: SummonerEntry): void {
  averageOutcomeStats(summoner.wins);
  averageOutcomeStats(summoner.losses);
}

/** Creates an empty SummonerEntry */
function createSummonerEntry(): SummonerEntry {
  return {
    wins: createOutcomeEntry(),
    losses: createOutcomeEntry(),
  };
}

/** Creates an empty OutcomeEntry */
function createOutcomeEntry(): OutcomeEntry {
  return {
    stats: createStats(),
    champion: {},
  };
}

/** Creates an empty ChampionEntry */
function createChampionEntry(): ChampionEntry {
  return { stats: createStats(), position: {} };
}

/** Creates an empty PositionEntry */
function createPositionEntry(): PositionEntry {
  return {
    stats: createStats(),
    matchup: {},
  };
}

/** Creates an empty MatchupEntry */
function createMatchupEntry(): MatchupEntry {
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
  console.log(`Number of Matches: ${matchIds.length}`);
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

      // get the MatchStats for the given match for both players in the matchup
      const playerStats: Stats = {
        aggregate: parseAggregateStats(matchInfo, playerInfo),
        average: parseAverageStats(matchInfo, playerInfo),
        min: parseMinMaxStats(matchInfo, playerInfo),
        max: parseMinMaxStats(matchInfo, playerInfo),
      };

      const opponentStats: Stats = {
        aggregate: parseAggregateStats(matchInfo, opponentInfo),
        average: parseAverageStats(matchInfo, opponentInfo),
        min: parseMinMaxStats(matchInfo, opponentInfo),
        max: parseMinMaxStats(matchInfo, opponentInfo),
      };

      // ready summoner heirarchy for entry
      const outcome: OutcomeEntry =
        summoner[playerInfo.win ? "wins" : "losses"];
      const champion: ChampionEntry = (outcome.champion[
        playerInfo.championName
      ] ??= createChampionEntry());
      const position: PositionEntry = (champion.position[
        playerInfo.teamPosition
      ] ??= createPositionEntry());
      const matchup: MatchupEntry = (position.matchup[
        opponentInfo.championName
      ] ??= createMatchupEntry());

      // update aggregate stats
      updateStats(outcome.stats, playerStats);
      updateStats(champion.stats, playerStats);
      updateStats(position.stats, playerStats);
      updateStats(matchup.player, playerStats);
      updateStats(matchup.opponent, opponentStats);
    } catch (error) {
      console.warn(error);
    }
  }

  averageAllStats(summoner);
  return summoner;
}
