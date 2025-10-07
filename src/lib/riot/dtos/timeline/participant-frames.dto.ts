import type { ParticipantFrameDto } from "./participant-frame.dto";

/**
 * Mapping of participant frame data for each participant (1–10).
 */
export interface ParticipantFramesDto {
  [participantId: string]: ParticipantFrameDto;
}
