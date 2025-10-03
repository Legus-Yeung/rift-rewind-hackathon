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
    it("returns response when fetch succeeds", async () => {
      const mockData: RiotAccountResponse = {
        puuid: "puuid123",
        gameName: "Summoner",
        tagLine: "NA1",
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => mockData,
        clone: jest.fn().mockReturnThis(),
      } as unknown as Response;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(mockResponse);

      const result = await fetchAccount("Summoner", "NA1");
      expect(result).toBe(mockResponse);
      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("returns response when fetch fails", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: async () => "Not Found",
        clone: jest.fn().mockReturnThis(),
      } as unknown as Response;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(mockResponse);

      const result = await fetchAccount("Summoner", "NA1");
      expect(result).toBe(mockResponse);
      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("fetchMatchHistory", () => {
    it("returns response when fetch succeeds", async () => {
      const mockData: RiotMatchHistoryResponse = ["NA1_123", "NA1_456"];

      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => mockData,
        clone: jest.fn().mockReturnThis(),
      } as unknown as Response;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(mockResponse);

      const result = await fetchMatchHistory("puuid123", new URLSearchParams());
      expect(result).toBe(mockResponse);
      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("returns response when fetch fails", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: async () => "Server Error",
        clone: jest.fn().mockReturnThis(),
      } as unknown as Response;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(mockResponse);

      const result = await fetchMatchHistory("puuid123", new URLSearchParams());
      expect(result).toBe(mockResponse);
      expect(result.ok).toBe(false);
      expect(result.status).toBe(500);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("fetchMatchInfo", () => {
    it("returns response when fetch succeeds", async () => {
      const mockData: RiotMatchInfoResponse = {
        // populate with minimal fields needed for the type
      } as RiotMatchInfoResponse;

      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => mockData,
        clone: jest.fn().mockReturnThis(),
      } as unknown as Response;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(mockResponse);

      const result = await fetchMatchInfo("match123");
      expect(result).toBe(mockResponse);
      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("returns response when fetch fails", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: async () => "Not Found",
        clone: jest.fn().mockReturnThis(),
      } as unknown as Response;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(mockResponse);

      const result = await fetchMatchInfo("match123");
      expect(result).toBe(mockResponse);
      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("fetchMatchTimeline", () => {
    it("returns response when fetch succeeds", async () => {
      const mockData: RiotMatchTimelineResponse = {
        // minimal fields for the type
      } as RiotMatchTimelineResponse;

      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => mockData,
        clone: jest.fn().mockReturnThis(),
      } as unknown as Response;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(mockResponse);

      const result = await fetchMatchTimeline("match123");
      expect(result).toBe(mockResponse);
      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("returns response when fetch fails", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: async () => "Server Error",
        clone: jest.fn().mockReturnThis(),
      } as unknown as Response;

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(mockResponse);

      const result = await fetchMatchTimeline("match123");
      expect(result).toBe(mockResponse);
      expect(result.ok).toBe(false);
      expect(result.status).toBe(500);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});
