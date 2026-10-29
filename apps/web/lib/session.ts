import { cookies } from "next/headers";
import type { SessionResponse } from "@vraunix/shared";
import { SERVER_API_TIMEOUT_MS, getApiInternalUrl } from "./server-api";

const API_INTERNAL_URL = getApiInternalUrl();

export async function getServerSession(): Promise<SessionResponse | null> {
  try {
    const store = await cookies();
    const cookieHeader = store
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    if (!cookieHeader) return null;

    const response = await fetch(`${API_INTERNAL_URL}/api/v1/auth/session`, {
      cache: "no-store",
      signal: AbortSignal.timeout(SERVER_API_TIMEOUT_MS),
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
      },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as
      | { success: true; data: SessionResponse }
      | { success: false };
    return payload.success ? payload.data : null;
  } catch {
    return null;
  }
}
