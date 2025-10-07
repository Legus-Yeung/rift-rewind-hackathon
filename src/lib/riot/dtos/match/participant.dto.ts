import type { ChallengesDto } from "./challenges.dto";
import type { MissionsDto } from "./missions.dto";
import type { PerksDto } from "./perks.dto";

/**
 * Participant DTO
 */
export interface ParticipantDto {
  /** (int) Yellow crossed swords ping count. */
  allInPings: number;

  /** (int) Green "assist me" ping count. */
  assistMePings: number;

  /** (int) Total assists. */
  assists: number;

  /** (int) Baron kills. */
  baronKills: number;

  /** (int) Bounty level. */
  bountyLevel: number;

  /** (int) Champion experience gained. */
  champExperience: number;

  /** (int) Champion level. */
  champLevel: number;

  /**
   * (int) Champion ID.
   * Note: Prior to patch 11.4 (Feb 18, 2021) this could return invalid IDs;
   * consider using championName for older matches.
   */
  championId: number;

  /** (string) Champion name. */
  championName: string;

  /** (int) Blue generic/command ping count (ALT+click). */
  commandPings: number;

  /**
   * (int) Champion transform state.
   * Used by Kayn: 0 = None, 1 = Slayer, 2 = Assassin.
   */
  championTransform?: number;

  /** (int) Consumables purchased. */
  consumablesPurchased: number;

  /** (ChallengesDto) Player challenges (very large set of metrics). */
  challenges?: ChallengesDto;

  /** (int) Damage dealt to buildings. */
  damageDealtToBuildings: number;

  /** (int) Damage dealt to objectives. */
  damageDealtToObjectives: number;

  /** (int) Damage dealt to turrets. */
  damageDealtToTurrets: number;

  /** (int) Damage self mitigated. */
  damageSelfMitigated: number;

  /** (int) Number of deaths. */
  deaths: number;

  /** (int) Detector wards placed. */
  detectorWardsPlaced: number;

  /** (int) Double kills. */
  doubleKills: number;

  /** (int) Dragon kills. */
  dragonKills: number;

  /** (boolean) Eligible for progression. */
  eligibleForProgression?: boolean;

  /** (int) Yellow question mark (enemy missing) pings. */
  enemyMissingPings: number;

  /** (int) Red eyeball (enemy vision) pings. */
  enemyVisionPings: number;

  /** (boolean) First blood assist. */
  firstBloodAssist: boolean;

  /** (boolean) First blood kill. */
  firstBloodKill: boolean;

  /** (boolean) First tower assist. */
  firstTowerAssist: boolean;

  /** (boolean) First tower kill. */
  firstTowerKill: boolean;

  /**
   * (boolean) Game ended in early surrender.
   * Offshoot of OneStone challenge — special logic for final damage instances.
   */
  gameEndedInEarlySurrender: boolean;

  /** (boolean) Game ended in surrender. */
  gameEndedInSurrender: boolean;

  /** (int) Hold pings. */
  holdPings: number;

  /** (int) Get back pings (yellow circle with horizontal line). */
  getBackPings: number;

  /** (int) Gold earned. */
  goldEarned: number;

  /** (int) Gold spent. */
  goldSpent: number;

  /**
   * (string) Individual position guess.
   * Note: teamPosition is generally recommended over individualPosition.
   */
  individualPosition?: string;

  /** (int) Inhibitor kills. */
  inhibitorKills: number;

  /** (int) Inhibitor takedowns. */
  inhibitorTakedowns: number;

  /** (int) Inhibitors lost. */
  inhibitorsLost: number;

  /** (int) Item slot 0 ID. */
  item0: number;

  /** (int) Item slot 1 ID. */
  item1: number;

  /** (int) Item slot 2 ID. */
  item2: number;

  /** (int) Item slot 3 ID. */
  item3: number;

  /** (int) Item slot 4 ID. */
  item4: number;

  /** (int) Item slot 5 ID. */
  item5: number;

  /** (int) Item slot 6 ID (usually trinket/consumable). */
  item6: number;

  /** (int) Total items purchased. */
  itemsPurchased: number;

  /** (int) Killing sprees. */
  killingSprees: number;

  /** (int) Kills. */
  kills: number;

  /** (string) Lane (role lane). */
  lane?: string;

  /** (int) Largest critical strike. */
  largestCriticalStrike: number;

  /** (int) Largest killing spree. */
  largestKillingSpree: number;

  /** (int) Largest multi-kill. */
  largestMultiKill: number;

  /** (int) Longest time spent living (ms). */
  longestTimeSpentLiving: number;

  /** (int) Magic damage dealt. */
  magicDamageDealt: number;

  /** (int) Magic damage dealt to champions. */
  magicDamageDealtToChampions: number;

  /** (int) Magic damage taken. */
  magicDamageTaken: number;

  /** (MissionsDto) Missions data (playerScoreX fields). */
  missions?: MissionsDto;

  /**
   * (int) Neutral minions killed.
   * neutralMinionsKilled = mNeutralMinionsKilled (includes pets/jungle monsters).
   */
  neutralMinionsKilled: number;

  /** (int) Need vision pings (green ward). */
  needVisionPings: number;

  /** (int) Nexus kills. */
  nexusKills: number;

  /** (int) Nexus takedowns. */
  nexusTakedowns: number;

  /** (int) Nexus lost. */
  nexusLost: number;

  /** (int) Objectives stolen. */
  objectivesStolen: number;

  /** (int) Objectives stolen assists. */
  objectivesStolenAssists: number;

  /** (int) On-my-way pings (blue arrow). */
  onMyWayPings: number;

  /** (int) Participant ID (1-... depends on mode). */
  participantId: number;

  /** (int) Player score 0. */
  playerScore0: number;

  /** (int) Player score 1. */
  playerScore1: number;

  /** (int) Player score 2. */
  playerScore2: number;

  /** (int) Player score 3. */
  playerScore3: number;

  /** (int) Player score 4. */
  playerScore4: number;

  /** (int) Player score 5. */
  playerScore5: number;

  /** (int) Player score 6. */
  playerScore6: number;

  /** (int) Player score 7. */
  playerScore7: number;

  /** (int) Player score 8. */
  playerScore8: number;

  /** (int) Player score 9. */
  playerScore9: number;

  /** (int) Player score 10. */
  playerScore10: number;

  /** (int) Player score 11. */
  playerScore11: number;

  /** (int) Penta kills. */
  pentaKills: number;

  /** (PerksDto) Player perks (runes/masteries) and their selections. */
  perks?: PerksDto;

  /** (int) Physical damage dealt. */
  physicalDamageDealt: number;

  /** (int) Physical damage dealt to champions. */
  physicalDamageDealtToChampions: number;

  /** (int) Physical damage taken. */
  physicalDamageTaken: number;

  /** (int) Placement (for certain game modes). */
  placement?: number;

  /** (int) Player augment 1 (auto-chess / special modes). */
  playerAugment1?: number;

  /** (int) Player augment 2. */
  playerAugment2?: number;

  /** (int) Player augment 3. */
  playerAugment3?: number;

  /** (int) Player augment 4. */
  playerAugment4?: number;

  /** (int) Player subteam ID (for some game modes). */
  playerSubteamId?: number;

  /** (int) Push pings (green minion). */
  pushPings: number;

  /** (int) Profile icon ID. */
  profileIcon?: number;

  /** (string) PUUID (unique player universal id). */
  puuid?: string;

  /** (int) Quadra kills. */
  quadraKills: number;

  /** (string) Riot ID game name (if present). */
  riotIdGameName?: string;

  /** (string) Riot ID tagline (if present). */
  riotIdTagline?: string;

  /** (string) Role (player declared/assigned). */
  role?: string;

  /** (int) Sight wards bought in game. */
  sightWardsBoughtInGame: number;

  /** (int) Spell1 casts. */
  spell1Casts: number;

  /** (int) Spell2 casts. */
  spell2Casts: number;

  /** (int) Spell3 casts. */
  spell3Casts: number;

  /** (int) Spell4 casts. */
  spell4Casts: number;

  /** (int) Subteam placement (for some modes). */
  subteamPlacement?: number;

  /** (int) Summoner1 (summoner/skill) casts. */
  summoner1Casts: number;

  /** (int) Summoner1 ID. */
  summoner1Id: number;

  /** (int) Summoner2 casts. */
  summoner2Casts: number;

  /** (int) Summoner2 ID. */
  summoner2Id: number;

  /** (string) Summoner ID (encrypted account id). */
  summonerId: string;

  /** (int) Summoner level. */
  summonerLevel: number;

  /** (string) Summoner name (display). */
  summonerName: string;

  /** (boolean) Team early surrendered. */
  teamEarlySurrendered: boolean;

  /** (int) Team ID (100 = Blue, 200 = Red). */
  teamId: number;

  /**
   * (string) Team position guess.
   * Prefer teamPosition over individualPosition when possible.
   */
  teamPosition?: string;

  /** (int) Time CCing others (milliseconds). */
  timeCCingOthers: number;

  /** (int) Time played (seconds). */
  timePlayed: number;

  /** (int) Total allied jungle minions killed. */
  totalAllyJungleMinionsKilled: number;

  /** (int) Total damage dealt. */
  totalDamageDealt: number;

  /** (int) Total damage dealt to champions. */
  totalDamageDealtToChampions: number;

  /** (int) Total damage shielded on teammates. */
  totalDamageShieldedOnTeammates: number;

  /** (int) Total damage taken. */
  totalDamageTaken: number;

  /** (int) Total enemy jungle minions killed. */
  totalEnemyJungleMinionsKilled: number;

  /** (int) Total heal (health applied). */
  totalHeal: number;

  /** (int) Total heals on teammates. */
  totalHealsOnTeammates: number;

  /** (int) Total minions killed (lane, siege, etc.). */
  totalMinionsKilled: number;

  /** (int) Total time CC dealt (milliseconds). */
  totalTimeCCDealt: number;

  /** (int) Total time spent dead (milliseconds). */
  totalTimeSpentDead: number;

  /** (int) Total units healed (count). */
  totalUnitsHealed: number;

  /** (int) Triple kills. */
  tripleKills: number;

  /** (int) True damage dealt. */
  trueDamageDealt: number;

  /** (int) True damage dealt to champions. */
  trueDamageDealtToChampions: number;

  /** (int) True damage taken. */
  trueDamageTaken: number;

  /** (int) Turret kills. */
  turretKills: number;

  /** (int) Turret takedowns. */
  turretTakedowns: number;

  /** (int) Turrets lost. */
  turretsLost: number;

  /** (int) Unreal kills (special metric). */
  unrealKills: number;

  /** (int) Vision score. */
  visionScore: number;

  /** (int) Vision cleared pings. */
  visionClearedPings: number;

  /** (int) Vision wards bought in game. */
  visionWardsBoughtInGame: number;

  /** (int) Wards killed. */
  wardsKilled: number;

  /** (int) Wards placed. */
  wardsPlaced: number;

  /** (boolean) Win flag for the participant's team. */
  win: boolean;
}
