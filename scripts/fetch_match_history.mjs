const API_KEY = "RGAPI-14d98752-4a87-42e2-b27c-2f2b4aa7ab6b";
const puuid = "tcFL7pPiMPSiofDC6iXUP09DTGMX5iDkgHf6jPpEvt7Y535Y3UQGA2iq1N5a30QxwelYmMY39YVWFA";
const baseUrl = "https://americas.api.riotgames.com";
const endpoint = `/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=100`;

async function fetchMatchIds() {
  const url = `${baseUrl}${endpoint}&api_key=${API_KEY}`;
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

// Run it
fetchMatchIds();
