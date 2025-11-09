import type { RiotPosition } from "../riot/enums/riot-position";

export const INFO_AGGREGATE_FIELDS = ["gameDuration"] as const;

export const INFO_AVERAGE_FIELDS = ["gameDuration"] as const;

export const INFO_MIN_MAX_FIELDS = ["gameDuration"] as const;

export const PARTICIPANT_AGGREGATE_FIELDS = [
  "kills",
  "deaths",
  "assists",
  "doubleKills",
  "tripleKills",
  "quadraKills",
  "pentaKills",
  "totalDamageDealt",
  "totalDamageDealtToChampions",
  "totalDamageTaken",
  "damageDealtToObjectives",
  "damageDealtToTurrets",
  "visionScore",
  "wardsPlaced",
  "wardsKilled",
  "detectorWardsPlaced",
  "goldEarned",
  "totalMinionsKilled",
  "neutralMinionsKilled",
  "turretKills",
  "inhibitorKills",
] as const;

export const PARTICIPANT_AVERAGE_FIELDS = [
  "kills",
  "deaths",
  "assists",

  "totalDamageDealt",
  "totalDamageDealtToChampions",

  "damageDealtToObjectives",
  "damageDealtToTurrets",

  "visionScore",
  "wardsPlaced",
  "wardsKilled",
  "detectorWardsPlaced",

  "goldEarned",

  "totalMinionsKilled",
  "neutralMinionsKilled",
  "neutralMinionsKilledEnemyJungle",
  "neutralMinionsKilledTeamJungle",
] as const;

export const PARTICIPANT_MIN_MAX_FIELDS = [
  "largestKillingSpree",
  "largestMultiKill",
  "longestTimeSpentLiving",
  "totalTimeSpentDead",
  "totalDamageDealtToChampions",
  "totalDamageTaken",
  "goldEarned",
  "visionScore",
  "totalMinionsKilled",
] as const;

export const CHALLENGES_AGGREGATE_FIELDS = [
  "baronTakedowns",
  "dragonTakedowns",
  "riftHeraldTakedowns",
  "teamBaronKills",
  "teamRiftHeraldKills",
  "scuttleCrabKills",
  "takedownsFirst25Minutes",
  "takedownsInEnemyFountain",
  "abilityUses",
  "soloKills",
  "perfectGame",
  "teleportTakedowns",
  "bountyGold",
  "soloBaronKills",
] as const;

export const CHALLENGES_AVERAGE_FIELDS = [
  "goldPerMinute",
  "damagePerMinute",
  "visionScorePerMinute",
  "kda",
  "killParticipation",
  "teamDamagePercentage",
  "laningPhaseGoldExpAdvantage",
  "earlyLaningPhaseGoldExpAdvantage",
  "damageTakenOnTeamPercentage",
  "gameLength",
] as const;

export const CHALLENGES_MIN_MAX_FIELDS = [
  "maxCsAdvantageOnLaneOpponent",
  "maxLevelLeadLaneOpponent",
  "highestChampionDamage",
  "highestCrowdControlScore",
  "highestWardKills",
  "earliestDragonTakedown",
  "earliestBaron",
  "fastestLegendary",
  "maxKillDeficit",
  "shortestTimeToAceFromFirstTakedown",
] as const;

export const AGGREGATE_FIELDS = [
  ...PARTICIPANT_AGGREGATE_FIELDS,
  ...CHALLENGES_AGGREGATE_FIELDS,
  ...INFO_AGGREGATE_FIELDS,
  "games",
] as const;

export const AVERAGE_FIELDS = [
  ...PARTICIPANT_AVERAGE_FIELDS,
  ...CHALLENGES_AVERAGE_FIELDS,
  ...INFO_AVERAGE_FIELDS,
] as const;

export const MIN_MAX_FIELDS = [
  ...PARTICIPANT_MIN_MAX_FIELDS,
  ...CHALLENGES_MIN_MAX_FIELDS,
  ...INFO_MIN_MAX_FIELDS,
] as const;

export type AggregateStats = Record<(typeof AGGREGATE_FIELDS)[number], number>;

export type AverageStats = Record<(typeof AVERAGE_FIELDS)[number], number>;

export type MinMaxStats = Record<(typeof MIN_MAX_FIELDS)[number], number>;
export interface MatchStats {
  aggregate: AggregateStats;
  average: AverageStats;
  min: MinMaxStats;
  max: MinMaxStats;
}

export interface MatchEntry {
  wins: OutcomeEntry;
  losses: OutcomeEntry;
}

export interface OutcomeEntry {
  stats: MatchStats;
  champion: Record<string, ChampionEntry>;
}

export interface ChampionEntry {
  stats: MatchStats;
  position: Partial<Record<RiotPosition, PositionEntry>>;
}

export interface PositionEntry {
  stats: MatchStats;
  matchup: Record<string, MatchupEntry>;
}

export interface MatchupEntry {
  player: MatchStats;
  opponent: MatchStats;
}

export interface TimelineStats {
  items: Record<number, ItemStats>;
}

export interface ItemStats {
  purchases: number;
  sold: number;
  destroyed: number;
}

export interface TimelineEntry {
  wins: TimelineOutcomeEntry;
  losses: TimelineOutcomeEntry;
}

export interface TimelineOutcomeEntry {
  stats: TimelineStats;
  champion: Record<string, TimelineChampionEntry>;
}

export interface TimelineChampionEntry {
  stats: TimelineStats;
}
