import type { BanDto } from "./ban.dto";
import type { ObjectivesDto } from "./objectives.dto";

/** Team DTO */
export interface TeamDto {
  /** (List[BanDto]) Champion bans for this team. */
  bans?: BanDto[];

  /** (ObjectivesDto) Objectives summary for the team. */
  objectives?: ObjectivesDto;

  /** (int) Team ID (100 = Blue, 200 = Red). */
  teamId: number;

  /** (boolean) Whether the team won. */
  win: boolean;
}
