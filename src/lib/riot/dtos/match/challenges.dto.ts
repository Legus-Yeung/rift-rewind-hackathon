/**
 * Challenges DTO
 * (Very large collection of optional/conditional metrics — many fields are floats/ints)
 */
export interface ChallengesDto {
  /** (int) 12 assist streak count. */
  "12AssistStreakCount"?: number;

  /** (int) Baron buff gold advantage over threshold. */
  baronBuffGoldAdvantageOverThreshold?: number;

  /** (float) Control ward time coverage in river or enemy half. */
  controlWardTimeCoverageInRiverOrEnemyHalf?: number;

  /** (int) Earliest baron timestamp (ms or relative). */
  earliestBaron?: number;

  /** (int) Earliest dragon takedown timestamp (ms or relative). */
  earliestDragonTakedown?: number;

  /** (int) Earliest elder dragon timestamp. */
  earliestElderDragon?: number;

  /** (float) Early laning phase gold/exp advantage. */
  earlyLaningPhaseGoldExpAdvantage?: number;

  /** (int) Faster support quest completion (flag/metric). */
  fasterSupportQuestCompletion?: number;

  /** (int) Fastest legendary (time). */
  fastestLegendary?: number;

  /** (int) Had AFK teammate flag. */
  hadAfkTeammate?: number;

  /** (int) Highest champion damage. */
  highestChampionDamage?: number;

  /** (int) Highest crowd control score. */
  highestCrowdControlScore?: number;

  /** (int) Highest ward kills. */
  highestWardKills?: number;

  /** (int) Jungler kills early jungle. */
  junglerKillsEarlyJungle?: number;

  /** (int) Kills on laners early jungle as jungler. */
  killsOnLanersEarlyJungleAsJungler?: number;

  /** (int) Laning phase gold/exp advantage metric. */
  laningPhaseGoldExpAdvantage?: number;

  /** (int) Legendary count. */
  legendaryCount?: number;

  /** (float) Max CS advantage on lane opponent. */
  maxCsAdvantageOnLaneOpponent?: number;

  /** (int) Max level lead on lane opponent. */
  maxLevelLeadLaneOpponent?: number;

  /** (int) Most wards destroyed by one sweeper. */
  mostWardsDestroyedOneSweeper?: number;

  /** (int) Mythic item used flag. */
  mythicItemUsed?: number;

  /** (int) Played champ select position. */
  playedChampSelectPosition?: number;

  /** (int) Solo turrets late game. */
  soloTurretsLategame?: number;

  /** (int) Takedowns first 25 minutes. */
  takedownsFirst25Minutes?: number;

  /** (int) Teleport takedowns. */
  teleportTakedowns?: number;

  /** (int) Third inhibitor destroyed time (float). */
  thirdInhibitorDestroyedTime?: number;

  /** (int) Three wards one sweeper count. */
  threeWardsOneSweeperCount?: number;

  /** (float) Vision score advantage vs lane opponent. */
  visionScoreAdvantageLaneOpponent?: number;

  /** (int) Infernal scale pickup (game-specific). */
  InfernalScalePickup?: number;

  /** (int) Fist bump participation. */
  fistBumpParticipation?: number;

  /** (int) Void monster kill. */
  voidMonsterKill?: number;

  /** (int) Ability uses. */
  abilityUses?: number;

  /** (int) Aces before 15 minutes. */
  acesBefore15Minutes?: number;

  /** (float) Allied jungle monster kills. */
  alliedJungleMonsterKills?: number;

  /** (int) Baron takedowns. */
  baronTakedowns?: number;

  /** (int) Blast cone opposite opponent count. */
  blastConeOppositeOpponentCount?: number;

  /** (int) Bounty gold. */
  bountyGold?: number;

  /** (int) Buffs stolen. */
  buffsStolen?: number;

  /** (int) Complete support quest in time (flag). */
  completeSupportQuestInTime?: number;

  /** (int) Control wards placed. */
  controlWardsPlaced?: number;

  /** (float) Damage per minute. */
  damagePerMinute?: number;

  /** (float) Damage taken on team percentage. */
  damageTakenOnTeamPercentage?: number;

  /** (int) Danced with Rift Herald (flag). */
  dancedWithRiftHerald?: number;

  /** (int) Deaths by enemy champions. */
  deathsByEnemyChamps?: number;

  /** (int) Dodge skill shots small window. */
  dodgeSkillShotsSmallWindow?: number;

  /** (int) Double aces count. */
  doubleAces?: number;

  /** (int) Dragon takedowns. */
  dragonTakedowns?: number;

  /** (int) Legendary item used List[int] (IDs). */
  legendaryItemUsed?: number[]; // List[int]

  /** (float) Effective heal and shielding. */
  effectiveHealAndShielding?: number;

  /** (int) Elder dragon kills with opposing soul. */
  elderDragonKillsWithOpposingSoul?: number;

  /** (int) Elder dragon multikills. */
  elderDragonMultikills?: number;

  /** (int) Enemy champion immobilizations. */
  enemyChampionImmobilizations?: number;

  /** (float) Enemy jungle monster kills. */
  enemyJungleMonsterKills?: number;

  /** (int) Epic monster kills near enemy jungler. */
  epicMonsterKillsNearEnemyJungler?: number;

  /** (int) Epic monster kills within 30s of spawn. */
  epicMonsterKillsWithin30SecondsOfSpawn?: number;

  /** (int) Epic monster steals. */
  epicMonsterSteals?: number;

  /** (int) Epic monsters stolen without smite. */
  epicMonsterStolenWithoutSmite?: number;

  /** (int) First turret killed (flag). */
  firstTurretKilled?: number;

  /** (float) First turret killed time (s). */
  firstTurretKilledTime?: number;

  /** (int) Flawless aces (flag). */
  flawlessAces?: number;

  /** (int) Full team takedown (flag). */
  fullTeamTakedown?: number;

  /** (float) Game length (seconds). */
  gameLength?: number;

  /** (int) Gold per minute. */
  goldPerMinute?: number;

  /** (int) Had open nexus (flag). */
  hadOpenNexus?: number;

  /** (int) Immobilize and kill with ally. */
  immobilizeAndKillWithAlly?: number;

  /** (int) Initial buff count. */
  initialBuffCount?: number;

  /** (int) Initial crab count. */
  initialCrabCount?: number;

  /** (float) Jungle CS before 10 minutes. */
  jungleCsBefore10Minutes?: number;

  /** (int) Jungler takedowns near damaged epic monster. */
  junglerTakedownsNearDamagedEpicMonster?: number;

  /** (float) KDA ratio. */
  kda?: number;

  /** (int) Kill after hidden with ally. */
  killAfterHiddenWithAlly?: number;

  /** (int) Killed champ took full team damage survived (flag). */
  killedChampTookFullTeamDamageSurvived?: number;

  /** (int) Killing sprees. */
  killingSprees?: number;

  /** (float) Kill participation. */
  killParticipation?: number;

  /** (int) Kills near enemy turret. */
  killsNearEnemyTurret?: number;

  /** (int) Kills on other lanes early jungle as laner. */
  killsOnOtherLanesEarlyJungleAsLaner?: number;

  /** (int) Kills on recently healed by aram pack. */
  killsOnRecentlyHealedByAramPack?: number;

  /** (int) Kills under own turret. */
  killsUnderOwnTurret?: number;

  /** (int) Kills with help from epic monster. */
  killsWithHelpFromEpicMonster?: number;

  /** (int) Knock enemy into team and kill. */
  knockEnemyIntoTeamAndKill?: number;

  /** (int) Turrets destroyed before plates fall (kTurretsDestroyed...). */
  kTurretsDestroyedBeforePlatesFall?: number;

  /** (int) Land skill shots early game. */
  landSkillShotsEarlyGame?: number;

  /** (int) Lane minions first 10 minutes. */
  laneMinionsFirst10Minutes?: number;

  /** (int) Lost an inhibitor (flag). */
  lostAnInhibitor?: number;

  /** (int) Max kill deficit. */
  maxKillDeficit?: number;

  /** (int) Mejais full stack in time (flag). */
  mejaisFullStackInTime?: number;

  /** (float) More enemy jungle than opponent (float metric). */
  moreEnemyJungleThanOpponent?: number;

  /** (int) Multi kill one spell (OneStone-like metric). */
  multiKillOneSpell?: number;

  /** (int) Multikills count. */
  multikills?: number;

  /** (int) Multikills after aggressive flash. */
  multikillsAfterAggressiveFlash?: number;

  /** (int) Multi turret rift herald count. */
  multiTurretRiftHeraldCount?: number;

  /** (int) Outer turret executes before 10 minutes. */
  outerTurretExecutesBefore10Minutes?: number;

  /** (int) Outnumbered kills. */
  outnumberedKills?: number;

  /** (int) Outnumbered nexus kill. */
  outnumberedNexusKill?: number;

  /** (int) Perfect dragon souls taken flag. */
  perfectDragonSoulsTaken?: number;

  /** (int) Perfect game (flag). */
  perfectGame?: number;

  /** (int) Pick kill with ally. */
  pickKillWithAlly?: number;

  /** (int) Poro explosions. */
  poroExplosions?: number;

  /** (int) Quick cleanse (flag). */
  quickCleanse?: number;

  /** (int) Quick first turret (flag). */
  quickFirstTurret?: number;

  /** (int) Quick solo kills. */
  quickSoloKills?: number;

  /** (int) Rift herald takedowns. */
  riftHeraldTakedowns?: number;

  /** (int) Save ally from death. */
  saveAllyFromDeath?: number;

  /** (int) Scuttle crab kills. */
  scuttleCrabKills?: number;

  /** (float) Shortest time to ace from first takedown. */
  shortestTimeToAceFromFirstTakedown?: number;

  /** (int) Skillshots dodged. */
  skillshotsDodged?: number;

  /** (int) Skillshots hit. */
  skillshotsHit?: number;

  /** (int) Snowballs hit. */
  snowballsHit?: number;

  /** (int) Solo baron kills. */
  soloBaronKills?: number;

  /** (int) SWARM specific metrics (various). */
  SWARM_DefeatAatrox?: number;
  SWARM_DefeatBriar?: number;
  SWARM_DefeatMiniBosses?: number;
  SWARM_EvolveWeapon?: number;
  SWARM_Have3Passives?: number;
  SWARM_KillEnemy?: number;
  SWARM_PickupGold?: number;
  SWARM_ReachLevel50?: number;
  SWARM_Survive15Min?: number;
  SWARM_WinWith5EvolvedWeapons?: number;

  /** (int) Solo kills. */
  soloKills?: number;

  /** (int) Stealth wards placed. */
  stealthWardsPlaced?: number;

  /** (int) Survived single digit HP count. */
  survivedSingleDigitHpCount?: number;

  /** (int) Survived three immobilizes in fight. */
  survivedThreeImmobilizesInFight?: number;

  /** (int) Takedown on first turret. */
  takedownOnFirstTurret?: number;

  /** (int) Takedowns. */
  takedowns?: number;

  /** (int) Takedowns after gaining level advantage. */
  takedownsAfterGainingLevelAdvantage?: number;

  /** (int) Takedowns before jungle minion spawn. */
  takedownsBeforeJungleMinionSpawn?: number;

  /** (int) Takedowns first X minutes. */
  takedownsFirstXMinutes?: number;

  /** (int) Takedowns in alcove. */
  takedownsInAlcove?: number;

  /** (int) Takedowns in enemy fountain. */
  takedownsInEnemyFountain?: number;

  /** (int) Team baron kills. */
  teamBaronKills?: number;

  /** (float) Team damage percentage. */
  teamDamagePercentage?: number;

  /** (int) Team elder dragon kills. */
  teamElderDragonKills?: number;

  /** (int) Team rift herald kills. */
  teamRiftHeraldKills?: number;

  /** (int) Took large damage survived. */
  tookLargeDamageSurvived?: number;

  /** (int) Turret plates taken. */
  turretPlatesTaken?: number;

  /** (int) Turrets taken with rift herald. */
  turretsTakenWithRiftHerald?: number;

  /** (int) Turret takedowns. */
  turretTakedowns?: number;

  /** (int) Twenty minions in 3 seconds count. */
  twentyMinionsIn3SecondsCount?: number;

  /** (int) Two wards one sweeper count. */
  twoWardsOneSweeperCount?: number;

  /** (int) Unseen recalls. */
  unseenRecalls?: number;

  /** (float) Vision score per minute. */
  visionScorePerMinute?: number;

  /** (int) Wards guarded. */
  wardsGuarded?: number;

  /** (int) Ward takedowns. */
  wardTakedowns?: number;

  /** (int) Ward takedowns before 20 minutes. */
  wardTakedownsBefore20M?: number;
}
