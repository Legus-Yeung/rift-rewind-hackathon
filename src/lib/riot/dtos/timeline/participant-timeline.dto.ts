/**
 * Basic participant information used in the timeline.
 */
export interface ParticipantTimelineDto {
  /** The participant's ID (1–10). */
  participantId: number;

  /** The player's unique Riot PUUID. */
  puuid: string;
}
