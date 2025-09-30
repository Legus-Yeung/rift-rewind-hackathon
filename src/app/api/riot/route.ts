import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const API_KEY = process.env.RIOT_API_KEY;

if (!API_KEY) {
  throw new Error('RIOT_API_KEY environment variable is not set');
}

const riotApiKey: string = API_KEY;
const BASE_URL = "https://americas.api.riotgames.com";

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
  const action = searchParams.get('action');
  const gameName = searchParams.get('gameName');
  const tagLine = searchParams.get('tagLine');
  const puuid = searchParams.get('puuid');
  const matchId = searchParams.get('matchId');

  try {
    switch (action) {
      case 'account':
        if (!gameName || !tagLine) {
          return NextResponse.json(
            { error: 'gameName and tagLine are required for account lookup' },
            { status: 400 }
          );
        }
        return await getAccount(gameName, tagLine);

      case 'match-history':
        if (!puuid) {
          return NextResponse.json(
            { error: 'puuid is required for match history lookup' },
            { status: 400 }
          );
        }
        return await getMatchHistory(puuid, searchParams);

      case 'match-info':
        if (!matchId) {
          return NextResponse.json(
            { error: 'matchId is required for match info lookup' },
            { status: 400 }
          );
        }
        return await getMatchInfo(matchId);

      case 'match-timeline':
        if (!matchId) {
          return NextResponse.json(
            { error: 'matchId is required for match timeline lookup' },
            { status: 400 }
          );
        }
        return await getMatchTimeline(matchId);

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "account", "match-history", "match-info", or "match-timeline"' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getAccount(gameName: string, tagLine: string) {
  const url = `${BASE_URL}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        "X-Riot-Token": riotApiKey
      }
    });

    if (!res.ok) {
      throw new Error(`Request failed with ${res.status}: ${await res.text()}`);
    }

    const data = await res.json() as Record<string, unknown>;
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching account:", err);
    return NextResponse.json(
      { error: 'Failed to fetch account data' },
      { status: 500 }
    );
  }
}

async function getMatchHistory(puuid: string, searchParams: URLSearchParams) {
  const params = new URLSearchParams();
  params.append('api_key', riotApiKey);
  
  const start = searchParams.get('start') ?? '0';
  const count = searchParams.get('count') ?? '100';
  params.append('start', start);
  params.append('count', count);
  
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  const queue = searchParams.get('queue');
  const type = searchParams.get('type');
  
  if (startTime) params.append('startTime', startTime);
  if (endTime) params.append('endTime', endTime);
  if (queue) params.append('queue', queue);
  if (type) params.append('type', type);
  
  const url = `${BASE_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?${params.toString()}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    
    const matchIds = await res.json() as string[];
    return NextResponse.json({ matchIds });
  } catch (err) {
    console.error("Failed to fetch match IDs:", err);
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    );
  }
}

async function getMatchInfo(matchId: string) {
  const url = `${BASE_URL}/lol/match/v5/matches/${matchId}?api_key=${riotApiKey}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    
    const matchInfo = await res.json() as Record<string, unknown>;
    return NextResponse.json(matchInfo);
  } catch (err) {
    console.error("Failed to fetch match info:", err);
    return NextResponse.json(
      { error: 'Failed to fetch match info' },
      { status: 500 }
    );
  }
}

async function getMatchTimeline(matchId: string) {
  const url = `${BASE_URL}/lol/match/v5/matches/${matchId}/timeline?api_key=${riotApiKey}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    
    const timeline = await res.json() as Record<string, unknown>;
    return NextResponse.json(timeline);
  } catch (err) {
    console.error("Failed to fetch match timeline:", err);
    return NextResponse.json(
      { error: 'Failed to fetch match timeline' },
      { status: 500 }
    );
  }
}
