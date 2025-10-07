import type { PerkStatsDto } from "./perk-stats.dto";
import type { PerkStyleDto } from "./perk-style.dto";

/**
 * Perks DTO
 * Contains statPerks and a list of PerkStyleDto
 */
export interface PerksDto {
  /** (PerkStatsDto) Stat perks (defense/flex/offense). */
  statPerks?: PerkStatsDto;

  /** (List[PerkStyleDto]) Perk style selections. */
  styles?: PerkStyleDto[];
}
