/**
 * Metadata for a match timeline, containing identifiers and participant PUUIDs.
 */
export interface MetadataTimelineDto {
  /** Match data version. */
  dataVersion: string;

  /** Unique match ID. */
  matchId: string;

  /** List of participant PUUIDs. */
  participants: string[];
}
