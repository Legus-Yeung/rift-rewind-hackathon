import { NextRequest, NextResponse } from 'next/server';

const API_KEY = "RGAPI-14d98752-4a87-42e2-b27c-2f2b4aa7ab6b";
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
 * Examples:
 * - Basic match history: /api/riot?action=match-history&puuid=<puuid>
 * - Recent 20 matches: /api/riot?action=match-history&puuid=<puuid>&count=20
 * - Ranked matches only: /api/riot?action=match-history&puuid=<puuid>&type=ranked
 * - Matches from last week: /api/riot?action=match-history&puuid=<puuid>&startTime=<timestamp>
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const gameName = searchParams.get('gameName');
  const tagLine = searchParams.get('tagLine');
  const puuid = searchParams.get('puuid');

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

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "account" or "match-history"' },
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
        "X-Riot-Token": API_KEY
      }
    });

    if (!res.ok) {
      throw new Error(`Request failed with ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
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
  params.append('api_key', API_KEY);
  
  const start = searchParams.get('start') || '0';
  const count = searchParams.get('count') || '100';
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
    
    const matchIds = await res.json();
    return NextResponse.json({ matchIds });
  } catch (err) {
    console.error("Failed to fetch match IDs:", err);
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    );
  }
}
