import type { FramesTimelineDto } from "./frames-timeline.dto";
import type { ParticipantTimelineDto } from "./participant-timeline.dto";

/**
 * Contains the timeline data for a given match, including frames and participants.
 */
export interface InfoTimelineDto {
  /** Indicates how the game ended (e.g., 'GameComplete', 'GameAbandoned'). */
  endOfGameResult: string;

  /** Time interval between each frame in milliseconds. */
  frameInterval: number;

  /** Unique match ID. */
  gameId: number;

  /** List of participant timeline data. */
  participants: ParticipantTimelineDto[];

  /** List of frame data objects throughout the game. */
  frames: FramesTimelineDto[];
}
