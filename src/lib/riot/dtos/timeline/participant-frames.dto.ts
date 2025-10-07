import type { ParticipantFrameDto } from "./participant-frame.dto";

/**
 * Mapping of participant frame data for each participant (1–10).
 * Uses Record<string, ParticipantFrameDto> for cleaner type definition.
 */
export type ParticipantFramesDto = Record<string, ParticipantFrameDto>;
