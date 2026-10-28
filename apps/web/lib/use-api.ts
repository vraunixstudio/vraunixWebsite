"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "./api";
import type { PaginationMeta } from "@vraunix/shared";

type ResourceState<T> = {
  data: T | null;
  meta?: PaginationMeta;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useApiResource<T>(path: string | null): ResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | undefined>();
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);

    api<T>(path)
      .then((result) => {
        if (!active) return;
        setData(result.data);
        setMeta(result.meta);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof ApiError
            ? cause.message
            : "The requested information could not be loaded."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [path, version]);

  return { data, meta, loading, error, reload };
}

export function useDebouncedValue<T>(value: T, delay = 280): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useApiAction() {
  const [busy, setBusy] = useState(false);
  const run = useCallback(
    async <T,>(
      path: string,
      options: {
        method?: string;
        body?: unknown;
      } = {}
    ): Promise<T> => {
      setBusy(true);
      try {
        const result = await api<T>(path, {
          method: options.method ?? "POST",
          body: options.body,
        });
        return result.data;
      } finally {
        setBusy(false);
      }
    },
    []
  );
  return { busy, run };
}
