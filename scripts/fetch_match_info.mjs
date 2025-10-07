import fs from 'fs';
import path from 'path';

const API_KEY = "RGAPI-14d98752-4a87-42e2-b27c-2f2b4aa7ab6b";
const matchId = "NA1_5371575881";

const baseUrl = "https://americas.api.riotgames.com";
const endpoint = `/lol/match/v5/matches/${matchId}`;

async function fetchMatchDetails() {
  const url = `${baseUrl}${endpoint}?api_key=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    const match = await res.json();
    console.log("Match details:", JSON.stringify(match, null, 2));
    
    const dataDir = path.join(process.cwd(), 'data');
    const filename = `match_${matchId}.json`;
    const filepath = path.join(dataDir, filename);
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(filepath, JSON.stringify(match, null, 2));
    console.log(`Match data saved to: ${filepath}`);
    
    return match;
  } catch (err) {
    console.error("Failed to fetch match details:", err.message);
    return null;
  }
}

fetchMatchDetails();
