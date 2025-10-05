export interface RiotAccountResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export type RiotMatchHistoryResponse = string[];

export interface RiotMatchInfoResponse {
  metadata: Record<string, unknown>;
  info: Record<string, unknown>;
}

export interface RiotMatchTimelineResponse {
  metadata: Record<string, unknown>;
  info: Record<string, unknown>;
}
