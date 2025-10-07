import { GET } from "./route";
import { NextRequest } from "next/server";

import type { ErrorResponse } from "~/lib/api/responses/error.reponse";
import type { AccountDto } from "~/lib/riot/dtos/account/account.dto";
import type { MatchDto } from "~/lib/riot/dtos/match/match.dto";
import type { TimelineDto } from "~/lib/riot/dtos/timeline/timeline.dto";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("GET default case", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("returns 400 if invalid action", async () => {
    const url = new URL("http://localhost/api/riot?action=badaction");
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as ErrorResponse;

    expect(response.status).toBe(400);
    expect(json.error).toBe(
      'Invalid action. Use "account", "match-history", "match-info", or "match-timeline"',
    );
  });
});
describe("GET account", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("returns 400 if tagLine is excluded", async () => {
    const url = new URL(
      "http://localhost/api/riot?action=account&gameName=test",
    );
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as ErrorResponse;

    expect(response.status).toBe(400);
    expect(json.error).toBe(
      "gameName and tagLine are required for account lookup",
    );
  });
  it("returns 400 if gameName is excluded", async () => {
    const url = new URL(
      "http://localhost/api/riot?action=account&tagLine=test",
    );
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as ErrorResponse;

    expect(response.status).toBe(400);
    expect(json.error).toBe(
      "gameName and tagLine are required for account lookup",
    );
  });
  it("returns 200 with account details if valid gameName and tagLine are set", async () => {
    const mockResponse: AccountDto = {
      puuid: "12345",
      gameName: "TestUser",
      tagLine: "testTag",
    };
    (mockFetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
      headers: new Headers(),
      redirected: false,
      status: 200,
      statusText: "OK",
      type: "basic",
      url: "",
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
      bytes: jest.fn(),
    } as unknown as Response);
    const url = new URL(
      "http://localhost/api/riot?action=account&gameName=TestUser&tagLine=testTag",
    );
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as AccountDto;

    expect(response.status).toBe(200);
    expect(json).toEqual(mockResponse);
  });
  it("returns 500 if invalid gameName and tagLine are set", async () => {
    const mockResponse = {
      status: {
        status_code: 404,
        message:
          "Data not found - No results found for player with riot id TestUser#testTag",
      },
    };
    (mockFetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: false,
      json: async () => mockResponse,
      headers: new Headers(),
      redirected: false,
      status: 404,
      statusText: "Not Found",
      type: "basic",
      url: "",
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
      bytes: jest.fn(),
    } as unknown as Response);
    const url = new URL(
      "http://localhost/api/riot?action=account&gameName=TestUser&tagLine=testTag",
    );
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as ErrorResponse;

    expect(response.status).toBe(500);
    expect(json.error).toEqual("Failed to fetch account data");
  });
});

describe("GET match-history", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("returns 400 if puuid is excluded", async () => {
    const url = new URL("http://localhost/api/riot?action=match-history");
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as ErrorResponse;

    expect(response.status).toBe(400);
    expect(json.error).toBe("puuid is required for match history lookup");
  });
  it("returns 200 with match history if valid puuid", async () => {
    const matches = ["NA_testmatch1", "NA_testmatch2"];
    const mockResponse: string[] = matches;
    (mockFetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => matches,
      headers: new Headers(),
      redirected: false,
      status: 200,
      statusText: "OK",
      type: "basic",
      url: "",
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
      bytes: jest.fn(),
    } as unknown as Response);
    const url = new URL(
      "http://localhost/api/riot?action=match-history&puuid=12345",
    );
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as string[];

    expect(response.status).toBe(200);
    expect(json).toEqual(mockResponse);
  });
  it("returns 500 if invalid puuid is set", async () => {
    const mockResponse = {
      status: {
        message: "Bad Request - Exception decrypting 12345",
        status_code: 400,
      },
    };
    (mockFetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: false,
      json: async () => mockResponse,
      headers: new Headers(),
      redirected: false,
      status: 404,
      statusText: "Not Found",
      type: "basic",
      url: "",
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
      bytes: jest.fn(),
    } as unknown as Response);
    const url = new URL(
      "http://localhost/api/riot?action=match-history&puuid=12345",
    );
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as ErrorResponse;

    expect(response.status).toBe(500);
    expect(json.error).toEqual("Failed to fetch match history");
  });
});

describe("GET match-info", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("returns 400 if matchId is excluded", async () => {
    const url = new URL("http://localhost/api/riot?action=match-info");
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as ErrorResponse;

    expect(response.status).toBe(400);
    expect(json.error).toBe("matchId is required for match info lookup");
  });
  it("returns 200 with match info if valid match id", async () => {
    const mockResponse: MatchDto = { metadata: {}, info: {} };
    (mockFetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
      headers: new Headers(),
      redirected: false,
      status: 200,
      statusText: "OK",
      type: "basic",
      url: "",
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
      bytes: jest.fn(),
    } as unknown as Response);
    const url = new URL(
      "http://localhost/api/riot?action=match-info&matchId=NA_testmatch",
    );
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as MatchDto;

    expect(response.status).toBe(200);
    expect(json).toEqual(mockResponse);
  });
  it("returns 500 if invalid match id is set", async () => {
    const mockResponse = {
      httpStatus: 404,
      errorCode: "RESOURCE_NOT_FOUND",
      message: "match file not found",
    };
    (mockFetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: false,
      json: async () => mockResponse,
      headers: new Headers(),
      redirected: false,
      status: 404,
      statusText: "Not Found",
      type: "basic",
      url: "",
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
      bytes: jest.fn(),
    } as unknown as Response);
    const url = new URL(
      "http://localhost/api/riot?action=match-info&matchId=NA_testmatch",
    );
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as ErrorResponse;

    expect(response.status).toBe(500);
    expect(json.error).toEqual("Failed to fetch match info");
  });
});

describe("GET match-timeline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("returns 400 if matchId is excluded", async () => {
    const url = new URL("http://localhost/api/riot?action=match-timeline");
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as ErrorResponse;

    expect(response.status).toBe(400);
    expect(json.error).toBe("matchId is required for match timeline lookup");
  });
  it("returns 200 with match info if valid match id", async () => {
    const mockResponse: TimelineDto = { metadata: {}, info: {} };
    (mockFetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
      headers: new Headers(),
      redirected: false,
      status: 200,
      statusText: "OK",
      type: "basic",
      url: "",
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
      bytes: jest.fn(),
    } as unknown as Response);
    const url = new URL(
      "http://localhost/api/riot?action=match-timeline&matchId=NA_testmatch",
    );
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as TimelineDto;

    expect(response.status).toBe(200);
    expect(json).toEqual(mockResponse);
  });
  it("returns 500 if invalid match id is set", async () => {
    const mockResponse = {
      httpStatus: 404,
      errorCode: "RESOURCE_NOT_FOUND",
      message: "match file not found",
    };
    (mockFetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: false,
      json: async () => mockResponse,
      headers: new Headers(),
      redirected: false,
      status: 404,
      statusText: "Not Found",
      type: "basic",
      url: "",
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
      bytes: jest.fn(),
    } as unknown as Response);
    const url = new URL(
      "http://localhost/api/riot?action=match-timeline&matchId=NA_testmatch",
    );
    const request = new NextRequest(url);

    const response = await GET(request);
    const json = (await response.json()) as ErrorResponse;

    expect(response.status).toBe(500);
    expect(json.error).toEqual("Failed to fetch match timeline");
  });
});
