import type { PerkStyleSelectionDto } from "./perk-style-selection.dto";

/** Perk Style DTO */
export interface PerkStyleDto {
  /** (string) Human readable description of the style. */
  description?: string;

  /** (List[PerkStyleSelectionDto]) Selections made for this style. */
  selections?: PerkStyleSelectionDto[];

  /** (int) Style id. */
  style?: number;
}
