import type { AccountDto } from "./dtos/account/account.dto";
import type { MatchDto } from "./dtos/match/match.dto";
import type { TimelineDto } from "./dtos/timeline/timeline.dto";

const API_KEY = process.env.RIOT_API_KEY;

if (!API_KEY) {
  throw new Error("RIOT_API_KEY environment variable is not set");
}

const riotApiKey: string = API_KEY;
const BASE_URL = "https://americas.api.riotgames.com";

/**
 * Accesses the riot API to get a user's puuid for use in other riot API calls.
 *
 * See the [Riot API docs]("https://developer.riotgames.com/apis#account-v1/GET_getByRiotId")
 *
 * @param gameName - player's summoner name
 * @param tagLine - player's tag line (unique identifier alongside gameName)
 * @returns A promise for a {@link RiotAccountResponse} - throws an error when query fails
 */
export async function fetchAccount(
  gameName: string,
  tagLine: string,
): Promise<AccountDto> {
  const url = `${BASE_URL}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;

  const res = await fetch(url, {
    headers: {
      "X-Riot-Token": riotApiKey,
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed with ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as AccountDto;
  return data;
}

/**
 * Accesses the riot API to get the match ids in a player's match history
 *
 * See the [Riot API docs]("https://developer.riotgames.com/apis#match-v5/GET_getMatchIdsByPUUID")
 *
 * @param puuid - the player's unique identifier
 * @param searchParams - search parameters for the riot api
 * @returns A promise for a {@link string[]} - throws an error when query fails
 */
export async function fetchMatchHistory(
  puuid: string,
  searchParams: URLSearchParams,
): Promise<string[]> {
  const params = new URLSearchParams();
  params.append("api_key", riotApiKey);

  const start = searchParams.get("start") ?? "0";
  const count = searchParams.get("count") ?? "100";
  params.append("start", start);
  params.append("count", count);

  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const queue = searchParams.get("queue");
  const type = searchParams.get("type") ?? "ranked";

  if (startTime) params.append("startTime", startTime);
  if (endTime) params.append("endTime", endTime);
  if (queue) params.append("queue", queue);
  if (type) params.append("type", type);

  const url = `${BASE_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const matchIds = (await res.json()) as string[];
  return matchIds;
}

export async function fetchAllMatchIds(
  puuid: string,
  searchParams: URLSearchParams,
): Promise<string[]> {
  const allMatchIds: string[] = [];
  const seasonStartMs = 1736380800000;
  const seasonStartSeconds = Math.floor(seasonStartMs / 1000);

  const providedStartTime = searchParams.get("startTime");
  const startTime = providedStartTime ?? seasonStartSeconds.toString();

  let start = 0;
  const count = 100;
  let hasMore = true;

  while (hasMore) {
    const paginatedParams = new URLSearchParams(searchParams);
    paginatedParams.set("start", start.toString());
    paginatedParams.set("count", count.toString());
    paginatedParams.set("startTime", startTime);

    const batch = await fetchMatchHistory(puuid, paginatedParams);

    if (batch.length === 0) {
      hasMore = false;
      break;
    }

    if (batch.length < count) {
      allMatchIds.push(...batch);
      hasMore = false;
      break;
    }

    const lastMatchId = batch[batch.length - 1];
    let batchToAdd = batch;

    if (lastMatchId) {
      try {
        const lastMatchInfo = await fetchMatchInfo(lastMatchId);
        const lastMatchTimestamp = lastMatchInfo.info.gameEndTimestamp ?? lastMatchInfo.info.gameStartTimestamp;

        if (lastMatchTimestamp < seasonStartMs) {
          const validMatches: string[] = [];
          for (const matchId of batch) {
            try {
              const matchInfo = await fetchMatchInfo(matchId);
              const matchTimestamp = matchInfo.info.gameEndTimestamp ?? matchInfo.info.gameStartTimestamp;
              if (matchTimestamp >= seasonStartMs) {
                validMatches.push(matchId);
              } else {
                break;
              }
            } catch {
              validMatches.push(matchId);
            }
          }
          batchToAdd = validMatches;
          hasMore = false;
        }
      } catch {
        if (allMatchIds.length + batch.length >= 1500) {
          console.warn("Reached 1500 matches limit, stopping pagination");
          hasMore = false;
        }
      }
    }

    allMatchIds.push(...batchToAdd);

    if (batchToAdd.length < batch.length) {
      hasMore = false;
    } else {
      start += count;
    }

    if (allMatchIds.length >= 1500) {
      console.warn("Reached 1500 matches limit, stopping pagination");
      hasMore = false;
    }
  }

  return allMatchIds;
}

/**
 * Accesses the riot API to get match info for a given match id
 *
 * See the [Riot API docs]("https://developer.riotgames.com/apis#match-v5/GET_getMatch")
 *
 * @param matchId - a unique identifier for a match
 * @returns A promise for a {@link RiotMatchInfoResponse}
 */
export async function fetchMatchInfo(matchId: string): Promise<MatchDto> {
  const url = `${BASE_URL}/lol/match/v5/matches/${matchId}?api_key=${riotApiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const matchInfo = (await res.json()) as MatchDto;
  return matchInfo;
}

/**
 * Accesses the riot API to get a timeline for a given match
 *
 * See the [Riot API docs]("https://developer.riotgames.com/apis#match-v5/GET_getTimeline")
 *
 * @param matchId - a unique identifier for a match
 * @returns A promise for a {@link RiotMatchTimelineResponse}
 */
export async function fetchMatchTimeline(
  matchId: string,
): Promise<TimelineDto> {
  const url = `${BASE_URL}/lol/match/v5/matches/${matchId}/timeline?api_key=${riotApiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const timeline = (await res.json()) as TimelineDto;
  return timeline;
}
