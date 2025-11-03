import type { ErrorResponse } from "./responses/error.reponse";

/**
 * Wraps an internal API request for error handling purposes.
 * Performs error response handling by throwing an error on non-okay responses.
 *
 * @param url the internal API route for the request.
 * (Note: server-side components must pass the full URL for the request)
 * @returns the response object of the type expected by the request
 * @throws an {@link Error} on a non-ok response
 */
export async function apiRequest<T>(url: string): Promise<T> {
  const res: Response = await fetch(url);
  if (!res.ok) {
    const { error } = (await res.json()) as ErrorResponse;
    throw new Error(error);
  }
  return (await res.json()) as T;
}
