import { NextRequest } from "next/server";
import { POST } from "./route";
import { fetchAccount, fetchAllMatchIds } from "~/lib/riot/riot-api-utils";
import { getMatchStats } from "~/lib/summoner/summoner-api-utils";

jest.mock("~/lib/riot/riot-api-utils", () => ({
  fetchAccount: jest.fn(),
  fetchAllMatchIds: jest.fn(),
}));

jest.mock("~/lib/summoner/summoner-api-utils", () => ({
  getMatchStats: jest.fn(),
}));

describe("POST /api/summoner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requires a Riot ID", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/summoner"),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "gameName and tagLine are required",
    });
  });

  it("returns live account and aggregated match data", async () => {
    jest.mocked(fetchAccount).mockResolvedValue({
      puuid: "player-puuid",
      gameName: "Player Name",
      tagLine: "NA1",
    });
    jest.mocked(fetchAllMatchIds).mockResolvedValue(["NA1_123"]);
    const stats = { wins: {}, losses: {} };
    jest.mocked(getMatchStats).mockResolvedValue({
      stats: stats as never,
      profileIconId: 42,
    });

    const response = await POST(
      new NextRequest(
        "http://localhost/api/summoner?gameName=Player%20Name&tagLine=NA1",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      account: {
        gameName: "Player Name",
        tagLine: "NA1",
        profileIconId: 42,
      },
      stats,
    });
    expect(fetchAllMatchIds).toHaveBeenCalledWith(
      "player-puuid",
      expect.any(URLSearchParams),
    );
    expect(getMatchStats).toHaveBeenCalledWith("player-puuid", ["NA1_123"]);
  });

  it("reports Riot API failures instead of returning empty stats", async () => {
    jest.mocked(fetchAccount).mockRejectedValue(new Error("Riot API failed"));

    const response = await POST(
      new NextRequest(
        "http://localhost/api/summoner?gameName=Player&tagLine=NA1",
      ),
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: "Riot API failed",
    });
  });
});
