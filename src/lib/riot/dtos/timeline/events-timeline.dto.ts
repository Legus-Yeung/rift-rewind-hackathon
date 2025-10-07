/**
 * Represents an individual timeline event (e.g., kill, item purchase, level-up).
 */
export interface EventsTimelineDto {
  /** Relative timestamp of the event (in milliseconds). */
  timestamp: number;

  /** Real-world timestamp of the event (in Unix milliseconds). */
  realTimestamp: number;

  /** Event type (e.g., CHAMPION_KILL, SKILL_LEVEL_UP). */
  type: string;
}
