/** Ban DTO */
export interface BanDto {
  /** (int) Champion ID that was banned. */
  championId?: number;

  /** (int) Pick turn (order) for the ban. */
  pickTurn?: number;
}
