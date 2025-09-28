const API_KEY = "RGAPI-14d98752-4a87-42e2-b27c-2f2b4aa7ab6b";
const url = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/IcemanRai/ICE";

async function getAccount() {
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
    console.log(data);
  } catch (err) {
    console.error("Error fetching account:", err.message);
  }
}

getAccount();
