import { cookies } from "next/headers";
import type { SessionResponse } from "@vraunix/shared";

const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ?? "http://127.0.0.1:4000";

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
