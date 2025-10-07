import type { EventsTimelineDto } from "./events-timeline.dto";
import type { ParticipantFramesDto } from "./participant-frames.dto";

/**
 * Represents a single frame in the timeline, containing all participant frames and events.
 */
export interface FramesTimelineDto {
  /** List of in-game events that occurred during this frame. */
  events: EventsTimelineDto[];

  /** Key-value mapping of participant frame data (1–10). */
  participantFrames: ParticipantFramesDto;

  /** Timestamp (in milliseconds) of this frame relative to match start. */
  timestamp: number;
}
