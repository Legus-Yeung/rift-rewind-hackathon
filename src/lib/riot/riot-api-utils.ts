import type { AccountDto } from "./dtos/account/account.dto";
import type { MatchDto } from "./dtos/match/match.dto";
import type { TimelineDto } from "./dtos/timeline/timeline.dto";
import { RiotLimiter } from "./riot-rate-limiter";

function getRiotHeaders(): HeadersInit {
  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    throw new Error("RIOT_API_KEY environment variable is not set");
  }
  return { "X-Riot-Token": apiKey };
}

const BASE_URL = "https://americas.api.riotgames.com";

async function fetchRiot(url: string): Promise<Response> {
  return RiotLimiter.schedule(async () => {
    const response = await fetch(url, { headers: getRiotHeaders() });
    if (response.ok) return response;

    const body = await response.text();
    const error = new Error(
      `HTTP ${response.status}: ${body || response.statusText}`,
    );
    Object.assign(error, {
      retryable: response.status === 429,
    });

    if (response.status === 429) {
      const retryAfterSeconds = Number(response.headers.get("Retry-After"));
      Object.assign(error, {
        retryAfterMs:
          Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
            ? retryAfterSeconds * 1000
            : 60_000,
      });
    }

    throw error;
  });
}

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
  const url = `${BASE_URL}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

  const res = await fetchRiot(url);
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

  const res = await fetchRiot(url);

  const matchIds = (await res.json()) as string[];
  return matchIds;
}

export async function fetchAllMatchIds(
  puuid: string,
  searchParams: URLSearchParams,
): Promise<string[]> {
  const params = new URLSearchParams(searchParams);
  params.set("start", "0");
  params.set("count", "50");
  params.set("queue", "420");
  params.set("type", "ranked");

  return fetchMatchHistory(puuid, params);
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
  const url = `${BASE_URL}/lol/match/v5/matches/${encodeURIComponent(matchId)}`;

  const res = await fetchRiot(url);

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
  const url = `${BASE_URL}/lol/match/v5/matches/${encodeURIComponent(matchId)}/timeline`;

  const res = await fetchRiot(url);

  const timeline = (await res.json()) as TimelineDto;
  return timeline;
}
