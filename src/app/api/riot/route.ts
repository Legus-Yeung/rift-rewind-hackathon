import { NextRequest, NextResponse } from 'next/server';

const API_KEY = "RGAPI-14d98752-4a87-42e2-b27c-2f2b4aa7ab6b";
const BASE_URL = "https://americas.api.riotgames.com";

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
        return await getMatchHistory(puuid);

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

async function getMatchHistory(puuid: string) {
  const url = `${BASE_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=100&api_key=${API_KEY}`;
  
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
