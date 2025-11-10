/**
 * Represents an individual timeline event (e.g., kill, item purchase, level-up).
 */
export interface EventsTimelineDto {
  type: string; // e.g., "CHAMPION_KILL", "ITEM_PURCHASED", "WARD_PLACED", etc.
  timestamp: number; // ms since match start

  // Common fields
  participantId?: number;
  position?: {
    x: number;
    y: number;
  };

  // Kills / deaths
  killerId?: number;
  victimId?: number;
  assistingParticipantIds?: number[];

  // Item-related events
  itemId?: number;
  itemBefore?: number; // e.g., for item transformation
  itemAfter?: number;

  // Building/objective-related
  buildingType?: string; // "TOWER_BUILDING", "INHIBITOR_BUILDING"
  laneType?: string; // "TOP_LANE", "MID_LANE", "BOT_LANE"
  towerType?: string; // "OUTER_TURRET", "INNER_TURRET", etc.
  teamId?: number; // which team (100 or 200)
  killerTeamId?: number; // sometimes used in objective kills

  // Monster/objective kills
  monsterType?: string; // "DRAGON", "BARON_NASHOR", "RIFTHERALD"
  monsterSubType?: string; // "CLOUD_DRAGON", "ELDER_DRAGON", etc.

  // Skill / leveling
  skillSlot?: number; // 1–4, for Q/W/E/R
  levelUpType?: string; // "NORMAL" or "EVOLVE"

  // Special or rare event fields
  realTimestamp?: number; // Actual timestamp in Unix ms (rarely present)
  ascendedType?: string; // For certain game modes
  creatorId?: number; // For wards/traps/etc.
  wardType?: string; // "YELLOW_TRINKET", "CONTROL_WARD", etc.
  killStreakLength?: number;
}
