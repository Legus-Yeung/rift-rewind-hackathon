import type { MetadataDto } from "./metadata.dto";
import type { InfoDto } from "./info.dto";

/**
 * Represents a single match record from the Riot Match-V5 API.
 */
export interface MatchDto {
  /**
   * Match metadata, including match ID and participant PUUIDs.
   * @type {MetadataDto}
   */
  metadata: MetadataDto;

  /**
   * Match information, including duration, participants, and results.
   * @type {InfoDto}
   */
  info: InfoDto;
}
