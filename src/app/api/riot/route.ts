import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  fetchAccount,
  fetchMatchHistory,
  fetchMatchInfo,
  fetchMatchTimeline,
} from "~/lib/riot";
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
 *    - start: Start index (default: 0)
 *    - count: Number of matches to return, 0-100 (default: 100)
 *    - startTime: Epoch timestamp in seconds (matches after June 16th, 2021)
 *    - endTime: Epoch timestamp in seconds
 *    - queue: Queue ID filter (mutually inclusive with type)
 *    - type: Match type filter - "ranked" (mutually inclusive with queue)
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
): Promise<NextResponse> {
  const response = await fetchAccount(gameName, tagLine);
  
  const responseClone = response.clone();
  const data = await responseClone.json();
  
  return NextResponse.json(data, { status: response.status });
}

async function getMatchHistory(
  puuid: string,
  searchParams: URLSearchParams,
): Promise<NextResponse> {
  const response = await fetchMatchHistory(puuid, searchParams);
  const responseClone = response.clone();
  const data = await responseClone.json();
  
  return NextResponse.json(data, { status: response.status });
}

async function getMatchInfo(
  matchId: string,
): Promise<NextResponse> {
  const response = await fetchMatchInfo(matchId);
  const responseClone = response.clone();
  const data = await responseClone.json();
  
  return NextResponse.json(data, { status: response.status });
}

async function getMatchTimeline(
  matchId: string,
): Promise<NextResponse> {
  const response = await fetchMatchTimeline(matchId);
  const responseClone = response.clone();
  const data = await responseClone.json();
  
  return NextResponse.json(data, { status: response.status });
}
