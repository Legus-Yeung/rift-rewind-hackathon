/**
 * Metadata information for a match.
 */
export interface MetadataDto {
  /** Match data version.
   * @type {string}
   */
  dataVersion: string;

  /** Unique match ID.
   * @type {string}
   */
  matchId: string;

  /** List of participant PUUIDs.
   * @type {string[]}
   */
  participants: string[];
}
