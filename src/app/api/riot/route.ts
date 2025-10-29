import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  fetchAccount,
  fetchMatchHistory,
  fetchMatchInfo,
  fetchMatchTimeline,
} from "~/lib/riot/riot-api-utils";

import type { ErrorResponse } from "~/lib/api/responses/error.reponse";
import type { AccountDto } from "~/lib/riot/dtos/account/account.dto";
import type { MatchDto } from "~/lib/riot/dtos/match/match.dto";
import type { TimelineDto } from "~/lib/riot/dtos/timeline/timeline.dto";
/**
 * Riot Games API Route
 *
 * Endpoints:
 *
 * 1. Account Lookup:
 *    GET /api/riot?action=account&gameName=<name>&tagLine=<tag>
 *    Returns account information including PUUID
 *
 * 2. Match History:
 *    GET /api/riot?action=match-history&puuid=<puuid>&[optional_params]
 *
 *    Required parameters:
 *    - puuid: Player's unique identifier
 *
 *    Optional parameters:
 *    - start: Start index (default: 0, used internally for pagination)
 *    - count: Number of matches per batch, 0-100 (default: 100, used internally)
 *    - startTime: Epoch timestamp in seconds (default: 12 months ago)
 *    - endTime: Epoch timestamp in seconds
 *    - queue: Queue ID filter (mutually inclusive with type)
 *    - type: Match type filter - "ranked" (mutually inclusive with queue)
 *
 *    Note: By default, this endpoint fetches ALL matches from the last 12 months,
 *    automatically paginating through results. The API is limited to 100 matches per
 *    request, so multiple requests are made internally until all matches within the
 *    time window are retrieved.
 *
 * 3. Match Info:
 *    GET /api/riot?action=match-info&matchId=<matchId>
 *    Returns detailed match information
 *
 *    Required parameters:
 *    - matchId: Match identifier (e.g., "NA1_5371575881")
 *
 * 4. Match Timeline:
 *    GET /api/riot?action=match-timeline&matchId=<matchId>
 *    Returns match timeline data with events
 *
 *    Required parameters:
 *    - matchId: Match identifier (e.g., "NA1_5371575881")
 *
 * Examples:
 * - Basic match history: /api/riot?action=match-history&puuid=<puuid>
 * - Recent 20 matches: /api/riot?action=match-history&puuid=<puuid>&count=20
 * - Ranked matches only: /api/riot?action=match-history&puuid=<puuid>&type=ranked
 * - Matches from last week: /api/riot?action=match-history&puuid=<puuid>&startTime=<timestamp>
 * - Match details: /api/riot?action=match-info&matchId=NA1_5371575881
 * - Match timeline: /api/riot?action=match-timeline&matchId=NA1_5371575881
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");
  const puuid = searchParams.get("puuid");
  const matchId = searchParams.get("matchId");

  try {
    switch (action) {
      case "account":
        if (!gameName || !tagLine) {
          return NextResponse.json(
            { error: "gameName and tagLine are required for account lookup" },
            { status: 400 },
          );
        }
        return await getAccount(gameName, tagLine);

      case "match-history":
        if (!puuid) {
          return NextResponse.json(
            { error: "puuid is required for match history lookup" },
            { status: 400 },
          );
        }
        return await getMatchHistory(puuid, searchParams);

      case "match-info":
        if (!matchId) {
          return NextResponse.json(
            { error: "matchId is required for match info lookup" },
            { status: 400 },
          );
        }
        return await getMatchInfo(matchId);

      case "match-timeline":
        if (!matchId) {
          return NextResponse.json(
            { error: "matchId is required for match timeline lookup" },
            { status: 400 },
          );
        }
        return await getMatchTimeline(matchId);

      default:
        return NextResponse.json(
          {
            error:
              'Invalid action. Use "account", "match-history", "match-info", or "match-timeline"',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function getAccount(
  gameName: string,
  tagLine: string,
): Promise<NextResponse<AccountDto | ErrorResponse>> {
  try {
    const data: AccountDto = await fetchAccount(gameName, tagLine);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching account:", err);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to fetch account data" },
      { status: 500 },
    );
  }
}

async function getMatchHistory(
  puuid: string,
  searchParams: URLSearchParams,
): Promise<NextResponse<string[] | ErrorResponse>> {
  try {
    const allMatchIds: string[] = [];
    const now = Date.now();
    const twelveMonthsAgoMs = now - 12 * 30 * 24 * 60 * 60 * 1000;
    const twelveMonthsAgoSeconds = Math.floor(twelveMonthsAgoMs / 1000);

    const providedStartTime = searchParams.get("startTime");
    const startTime = providedStartTime ?? twelveMonthsAgoSeconds.toString();

    let start = 0;
    const count = 100;
    let hasMore = true;

    while (hasMore) {
      const paginatedParams = new URLSearchParams(searchParams);
      paginatedParams.set("start", start.toString());
      paginatedParams.set("count", count.toString());
      paginatedParams.set("startTime", startTime);

      const batch: string[] = await fetchMatchHistory(puuid, paginatedParams);

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

          if (lastMatchTimestamp < twelveMonthsAgoMs) {
            const validMatches: string[] = [];
            for (const matchId of batch) {
              try {
                const matchInfo = await fetchMatchInfo(matchId);
                const matchTimestamp = matchInfo.info.gameEndTimestamp ?? matchInfo.info.gameStartTimestamp;
                if (matchTimestamp >= twelveMonthsAgoMs) {
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
            console.warn("Reached 1000 matches limit, stopping pagination");
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

    return NextResponse.json(allMatchIds);
  } catch (err) {
    console.error("Failed to fetch match IDs:", err);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to fetch match history" },
      { status: 500 },
    );
  }
}

async function getMatchInfo(
  matchId: string,
): Promise<NextResponse<MatchDto | ErrorResponse>> {
  try {
    const matchInfo: MatchDto = await fetchMatchInfo(matchId);
    return NextResponse.json(matchInfo);
  } catch (err) {
    console.error("Failed to fetch match info:", err);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to fetch match info" },
      { status: 500 },
    );
  }
}

async function getMatchTimeline(
  matchId: string,
): Promise<NextResponse<TimelineDto | ErrorResponse>> {
  try {
    const timeline: TimelineDto = await fetchMatchTimeline(matchId);
    return NextResponse.json(timeline);
  } catch (err) {
    console.error("Failed to fetch match timeline:", err);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to fetch match timeline" },
      { status: 500 },
    );
  }
}
