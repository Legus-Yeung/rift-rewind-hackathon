import {
  fetchAccount,
  fetchMatchHistory,
  fetchMatchInfo,
  fetchMatchTimeline,
} from "~/lib/riot";

import type {
  RiotAccountResponse,
  RiotMatchHistoryResponse,
  RiotMatchInfoResponse,
  RiotMatchTimelineResponse,
} from "~/types/riot";

// Mock the global fetch function
global.fetch = jest.fn();

describe("Riot API helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchAccount", () => {
    it("returns data when fetch succeeds", async () => {
      const mockData: RiotAccountResponse = {
        puuid: "puuid123",
        gameName: "Summoner",
        tagLine: "NA1",
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchAccount("Summoner", "NA1");
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1);
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

  describe("fetchMatchHistory", () => {
    it("returns match ids when fetch succeeds", async () => {
      const mockData: RiotMatchHistoryResponse = ["NA1_123", "NA1_456"];

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchMatchHistory("puuid123", new URLSearchParams());
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1);
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
      const mockData: RiotMatchInfoResponse = {
        // populate with minimal fields needed for the type
      } as RiotMatchInfoResponse;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchMatchInfo("match123");
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1);
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
      const mockData: RiotMatchTimelineResponse = {
        // minimal fields for the type
      } as RiotMatchTimelineResponse;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchMatchTimeline("match123");
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1);
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
