/**
 * Represents the full timeline data for a specific match from the Riot Match-V5 Timeline API.
 */
export interface TimelineDto {
  /**
   * Match metadata for the timeline, including match ID and participant PUUIDs.
   * @type {Record<string, unknown>}
   */
  metadata: Record<string, unknown>;

  /**
   * Match timeline information, including frames, events, and participant state over time.
   * @type {InfoTimeLineDto}
   */
  info: Record<string, unknown>;
}
