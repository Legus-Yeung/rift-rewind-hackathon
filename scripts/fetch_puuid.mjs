const RIOT_API_KEY = "";
const url = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/c9loki/kr3";

async function getAccount() {
  try {
    const res = await fetch(url, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY
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