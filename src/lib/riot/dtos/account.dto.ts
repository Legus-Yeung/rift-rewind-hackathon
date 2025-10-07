/**
 * Represents a Riot account identity, including the encrypted PUUID and optional game identifiers.
 */
export interface AccountDto {
  /**
   * Encrypted PUUID.
   * @type {string}
   * @description Unique player universal identifier (exactly 78 characters).
   */
  puuid: string;

  /**
   * The player's in-game name.
   * @type {string | undefined}
   * @description This field may be excluded if the account doesn't have a gameName.
   */
  gameName?: string;

  /**
   * The player's tagline (e.g., region or identifier after '#').
   * @type {string | undefined}
   * @description This field may be excluded if the account doesn't have a tagLine.
   */
  tagLine?: string;
}
