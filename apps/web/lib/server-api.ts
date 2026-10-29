const DEFAULT_API_INTERNAL_URL = "http://127.0.0.1:4000";

export const SERVER_API_TIMEOUT_MS = 8_000;

export function getApiInternalUrl(): string {
  const configured = process.env.API_INTERNAL_URL?.trim();
  const normalized = (configured || DEFAULT_API_INTERNAL_URL).replace(/\/+$/, "");

  try {
    const url = new URL(normalized);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("unsupported protocol");
    }
  } catch {
    throw new Error(
      `API_INTERNAL_URL must be an absolute http(s) URL. Received "${configured ?? ""}".`
    );
  }

  return normalized;
}
