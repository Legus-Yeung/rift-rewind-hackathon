import fs from 'fs';
import path from 'path';

const RIOT_API_KEY = "";
const matchId = "NA1_5371642334";

const baseUrl = "https://americas.api.riotgames.com";
const endpoint = `/lol/match/v5/matches/${matchId}/timeline`;

async function fetchMatchTimeline() {
  const url = `${baseUrl}${endpoint}?api_key=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    const timeline = await res.json();
    console.log("Match timeline:", JSON.stringify(timeline, null, 2));
    
    const dataDir = path.join(process.cwd(), 'data');
    const filename = `match_${matchId}_timeline.json`;
    const filepath = path.join(dataDir, filename);
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(filepath, JSON.stringify(timeline, null, 2));
    console.log(`Match timeline data saved to: ${filepath}`);
    
    return timeline;
  } catch (err) {
    console.error("Failed to fetch match timeline:", err.message);
    return null;
  }
}

fetchMatchTimeline();