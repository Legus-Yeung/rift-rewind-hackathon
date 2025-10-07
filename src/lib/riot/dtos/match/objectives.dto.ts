import type { ObjectiveDto } from "./objective.dto";

/** Objectives DTO — summarizes each objective type for the team */
export interface ObjectivesDto {
  baron?: ObjectiveDto;
  champion?: ObjectiveDto;
  dragon?: ObjectiveDto;
  horde?: ObjectiveDto;
  inhibitor?: ObjectiveDto;
  riftHerald?: ObjectiveDto;
  tower?: ObjectiveDto;
}
