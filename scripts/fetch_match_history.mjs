const RIOT_API_KEY = "";
const puuid = "6aRgHzMxyiZYg1bLGe7lAzgV8dgrU2OH5kERLffwt3Aaljz62aub2CgLJ4rm0DhGby37StURRQBvOg";
const baseUrl = "https://americas.api.riotgames.com";
const endpoint = `/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=100`;

async function fetchMatchIds() {
  const url = `${baseUrl}${endpoint}&api_key=${RIOT_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    const matchIds = await res.json();
    console.log("Match IDs:", matchIds);
    return matchIds;
  } catch (err) {
    console.error("Failed to fetch match IDs:", err.message);
    return null;
  }
}

fetchMatchIds();
