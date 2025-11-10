/**
 * URL utility class for global URL generation
 */

declare global {
  var baseUrl: string | undefined;
}

/**
 * Gets the base URL used by the application
 *
 * @returns an URL string respresenting the base URL of the application
 */
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

globalThis.baseUrl ??= getBaseUrl();

export const baseUrl = globalThis.baseUrl;
