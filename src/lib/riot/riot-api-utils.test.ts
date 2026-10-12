import {
  fetchAccount,
  fetchAllMatchIds,
  fetchMatchHistory,
  fetchMatchInfo,
  fetchMatchTimeline,
} from "~/lib/riot/riot-api-utils";
import type { AccountDto } from "./dtos/account/account.dto";
import type { MatchDto } from "./dtos/match/match.dto";
import type { TimelineDto } from "./dtos/timeline/timeline.dto";

// Mock the global fetch function
global.fetch = jest.fn();

describe("Riot API helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchAccount", () => {
    it("returns data when fetch succeeds", async () => {
      const mockData: AccountDto = {
        puuid: "puuid123",
        gameName: "Summoner",
        tagLine: "NA1",
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchAccount("Summoner Name", "NA1");
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/accounts/by-riot-id/Summoner%20Name/NA1"),
        expect.objectContaining({
          headers: { "X-Riot-Token": "test-api-key" },
        }),
      );
    });

    it("throws an error when fetch fails", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => "Not Found",
      } as Response);

      await expect(fetchAccount("Summoner", "NA1")).rejects.toThrow(
        /Request failed/,
      );
    });
  });

  describe("fetchAllMatchIds", () => {
    it("requests ranked solo/duo games from the previous year", async () => {
      const matchIds = ["NA1_123"];
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => matchIds,
      } as Response);

      const result = await fetchAllMatchIds(
        "puuid123",
        new URLSearchParams(),
      );

      expect(result).toEqual(matchIds);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/startTime=\d+&queue=420&type=ranked/),
        expect.objectContaining({
          headers: { "X-Riot-Token": "test-api-key" },
        }),
      );
    });
  });

  describe("fetchMatchHistory", () => {
    it("returns match ids when fetch succeeds", async () => {
      const mockData: string[] = ["NA1_123", "NA1_456"];

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchMatchHistory("puuid123", new URLSearchParams());
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/matches/by-puuid/puuid123/ids?"),
        expect.objectContaining({
          headers: { "X-Riot-Token": "test-api-key" },
        }),
      );
    });

    it("throws an error when fetch fails", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => "Server Error",
      } as Response);

      await expect(
        fetchMatchHistory("puuid123", new URLSearchParams()),
      ).rejects.toThrow(/HTTP 500/);
    });
  });

  describe("fetchMatchInfo", () => {
    it("returns match info when fetch succeeds", async () => {
      const mockData: Partial<MatchDto> = {
        metadata: {
          dataVersion: "1",
          matchId: "2",
          participants: ["a", "b"],
        },
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchMatchInfo("match123");
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/matches/match123"),
        expect.objectContaining({
          headers: { "X-Riot-Token": "test-api-key" },
        }),
      );
    });

    it("throws an error when fetch fails", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => "Not Found",
      } as Response);

      await expect(fetchMatchInfo("match123")).rejects.toThrow(/HTTP 404/);
    });
  });

  describe("fetchMatchTimeline", () => {
    it("returns timeline data when fetch succeeds", async () => {
      const mockData: Partial<TimelineDto> = {
        metadata: {
          dataVersion: "1",
          matchId: "2",
          participants: ["a", "b"],
        },
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchMatchTimeline("match123");
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/matches/match123/timeline"),
        expect.objectContaining({
          headers: { "X-Riot-Token": "test-api-key" },
        }),
      );
    });

    it("throws an error when fetch fails", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => "Server Error",
      } as Response);

      await expect(fetchMatchTimeline("match123")).rejects.toThrow(/HTTP 500/);
    });
  });
});
