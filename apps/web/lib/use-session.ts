"use client";

import { useEffect, useState } from "react";
import type { SessionResponse, SessionUser } from "@vraunix/shared";
import { api } from "./api";

export function useSessionUser(): {
  user: SessionUser | null;
  ready: boolean;
} {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    api<SessionResponse>("/auth/session", { signal: controller.signal })
      .then((result) => {
        if (active) setUser(result.data.user);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return { user, ready };
}
