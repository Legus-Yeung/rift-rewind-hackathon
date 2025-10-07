import type { InfoTimelineDto } from "./info-timeline.dto";
import type { MetadataTimelineDto } from "./metadata-timeline.dto";

/**
 * Represents the full timeline data for a specific match from the Riot Match-V5 Timeline API.
 */
export interface TimelineDto {
  /**
   * Match metadata for the timeline, including match ID and participant PUUIDs.
   * @type {MetadataTimeLineDto}
   */
  metadata: MetadataTimelineDto;

  /**
   * Match timeline information, including frames, events, and participant state over time.
   * @type {InfoTimeLineDto}
   */
  info: InfoTimelineDto;
}
