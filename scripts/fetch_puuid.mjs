const API_KEY = process.env.RIOT_API_KEY;
const url = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/c9loki/kr3";

async function getAccount() {
  try {
    if (!API_KEY) throw new Error("RIOT_API_KEY environment variable is not set");
    const res = await fetch(url, {
      headers: {
        "X-Riot-Token": API_KEY
      }
    });

    if (!res.ok) {
      throw new Error(`Request failed with ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("Error fetching account:", err.message);
  }
}

getAccount();