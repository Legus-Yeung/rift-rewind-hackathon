import type { ParticipantDto } from "./participant.dto";
import type { TeamDto } from "./team.dto";

/**
 * Detailed information about a match.
 */
export interface InfoDto {
  /** Indicates if the game ended in termination.
   * @type {string}
   */
  endOfGameResult: string;

  /** Unix timestamp (milliseconds) for when the game is created on the game server (i.e., loading screen).
   * @type {number} long
   */
  gameCreation: number;

  /** Game duration.
   * Prior to patch 11.20, this value is in milliseconds (calculated from gameEndTimestamp - gameStartTimestamp).
   * Post patch 11.20, this value is in seconds (max timePlayed among participants).
   * @type {number} long
   */
  gameDuration: number;

  /** Unix timestamp for when the match ends on the game server (added patch 11.20).
   * @type {number} long
   */
  gameEndTimestamp?: number;

  /** Unique game ID.
   * @type {number} long
   */
  gameId: number;

  /** Game mode (refer to Game Constants documentation).
   * @type {string}
   */
  gameMode: string;

  /** Name of the game instance.
   * @type {string}
   */
  gameName: string;

  /** Unix timestamp for when the match starts on the game server.
   * @type {number} long
   */
  gameStartTimestamp: number;

  /** Game type (refer to Game Constants documentation).
   * @type {string}
   */
  gameType: string;

  /** Full version string of the game (first two parts correspond to patch version).
   * @type {string}
   */
  gameVersion: string;

  /** Map ID (refer to Game Constants documentation).
   * @type {number} int
   */
  mapId: number;

  /** List of participants in the match.
   * @type {ParticipantDto[]}
   */
  participants: ParticipantDto[];

  /** Platform where the match was played (e.g., "NA1", "EUW1").
   * @type {string}
   */
  platformId: string;

  /** Queue ID (refer to Game Constants documentation).
   * @type {number} int
   */
  queueId: number;

  /** List of team data for this match.
   * @type {TeamDto[]}
   */
  teams: TeamDto[];

  /** Tournament code used to generate the match (added patch 11.13).
   * @type {string}
   */
  tournamentCode?: string;
}
