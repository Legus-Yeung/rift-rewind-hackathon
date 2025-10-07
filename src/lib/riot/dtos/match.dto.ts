/**
 * Represents a single match record from the Riot Match-V5 API.
 */
export interface MatchDto {
  /**
   * Match metadata, including match ID and participant PUUIDs.
   * @type {Record<string, unknown>}
   */
  metadata: Record<string, unknown>;

  /**
   * Match information, including duration, participants, and results.
   * @type {Record<string, unknown>}
   */
  info: Record<string, unknown>;
}
