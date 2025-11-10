import type { ChampionStatsDto } from "./champion-stats.dto";
import type { DamageStatsDto } from "./damage-stats.dto";
import type { PositionDto } from "./position.dto";

/**
 * Contains per-frame statistics for a single participant.
 */
export interface ParticipantFrameDto {
  /** Champion stats such as HP, armor, AD, etc. */
  championStats: ChampionStatsDto;

  /** Current gold held by the participant. */
  currentGold: number;

  /** Detailed damage statistics. */
  damageStats: DamageStatsDto;

  /** Gold gained per second (useful for tracking income). */
  goldPerSecond: number;

  /** Jungle minions killed during this frame. */
  jungleMinionsKilled: number;

  /** Player’s current level. */
  level: number;

  /** Lane minions killed during this frame. */
  minionsKilled: number;

  /** Participant’s unique ID (1–10). */
  participantId: number;

  /** The player’s current position on the map. */
  position: PositionDto;

  /** Time (ms) the participant spent controlling enemies. */
  timeEnemySpentControlled: number;

  /** Total gold accumulated so far. */
  totalGold: number;

  /** Experience points accumulated so far. */
  xp: number;
}
