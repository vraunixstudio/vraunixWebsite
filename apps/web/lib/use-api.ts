"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { api, ApiError, type ApiResult } from "./api";
import type { PaginationMeta } from "@vraunix/shared";

type ResourceState<T> = {
  data: T | null;
  meta?: PaginationMeta;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  reload: () => void;
  mutate: (updater: T | null | ((current: T | null) => T | null)) => void;
};

type CacheEntry = {
  data: unknown;
  meta?: PaginationMeta;
  updatedAt: number;
};

type ResourceSnapshot<T> = {
  path: string | null;
  data: T | null;
  meta?: PaginationMeta;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
};

const CACHE_TTL_MS = 30_000;
const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<ApiResult<unknown>>>();
const generations = new Map<string, number>();

let activeFetches = 0;
const activityListeners = new Set<() => void>();

function notifyActivity() {
  activityListeners.forEach((listener) => listener());
}

function beginActivity() {
  activeFetches += 1;
  notifyActivity();
}

function endActivity() {
  activeFetches = Math.max(0, activeFetches - 1);
  notifyActivity();
}

function subscribeActivity(listener: () => void) {
  activityListeners.add(listener);
  return () => activityListeners.delete(listener);
}

function getActivitySnapshot() {
  return activeFetches;
}

function getServerActivitySnapshot() {
  return 0;
}

export function useApiActivity(): number {
  return useSyncExternalStore(
    subscribeActivity,
    getActivitySnapshot,
    getServerActivitySnapshot
  );
}

function bumpGeneration(path: string) {
  generations.set(path, (generations.get(path) ?? 0) + 1);
}

export function invalidateApiCache(pathPrefix?: string): void {
  if (!pathPrefix) {
    cache.clear();
    for (const key of inFlight.keys()) {
      bumpGeneration(key);
      inFlight.delete(key);
    }
    return;
  }
  for (const key of cache.keys()) {
    if (!key.startsWith(pathPrefix)) continue;
    cache.delete(key);
    bumpGeneration(key);
  }
  for (const key of inFlight.keys()) {
    if (!key.startsWith(pathPrefix)) continue;
    bumpGeneration(key);
    inFlight.delete(key);
  }
}

function fetchShared<T>(path: string): Promise<ApiResult<T>> {
  const pending = inFlight.get(path);
  if (pending) return pending as Promise<ApiResult<T>>;

  const request = api<T>(path);
  const tracked = request.finally(() => {
    if (inFlight.get(path) === tracked) inFlight.delete(path);
  });
  inFlight.set(path, tracked as Promise<ApiResult<unknown>>);
  return tracked;
}

function initialSnapshot<T>(path: string | null): ResourceSnapshot<T> {
  if (!path) {
    return {
      path: null,
      data: null,
      loading: false,
      refreshing: false,
      error: null,
    };
  }
  const cached = cache.get(path);
  return {
    path,
    data: (cached?.data as T | undefined) ?? null,
    meta: cached?.meta,
    loading: !cached,
    refreshing: Boolean(cached),
    error: null,
  };
}

function errorMessage(cause: unknown): string {
  return cause instanceof ApiError
    ? cause.message
    : "The requested information could not be loaded.";
}

export function useApiResource<T>(path: string | null): ResourceState<T> {
  const [snapshot, setSnapshot] = useState<ResourceSnapshot<T>>(() =>
    initialSnapshot<T>(path)
  );
  const [version, setVersion] = useState(0);
  const forceRefresh = useRef(false);
  const currentPath = useRef(path);
  currentPath.current = path;

  const reload = useCallback(() => {
    forceRefresh.current = true;
    setVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!path) {
      setSnapshot({
        path: null,
        data: null,
        loading: false,
        refreshing: false,
        error: null,
      });
      return;
    }

    const cached = cache.get(path);
    const force = forceRefresh.current;
    forceRefresh.current = false;

    setSnapshot((current) => {
      if (current.path === path) {
        return {
          ...current,
          loading: current.data === null && !cached,
          refreshing: current.data !== null || Boolean(cached),
        };
      }
      return {
        path,
        data: (cached?.data as T | undefined) ?? null,
        meta: cached?.meta,
        loading: !cached,
        refreshing: Boolean(cached),
        error: null,
      };
    });

    if (
      cached &&
      !force &&
      Date.now() - cached.updatedAt < CACHE_TTL_MS
    ) {
      setSnapshot((current) =>
        current.path === path
          ? { ...current, loading: false, refreshing: false }
          : current
      );
      return;
    }

    let active = true;
    const generation = generations.get(path) ?? 0;
    beginActivity();

    fetchShared<T>(path)
      .then((result) => {
        if (!active || (generations.get(path) ?? 0) !== generation) return;
        cache.set(path, {
          data: result.data,
          meta: result.meta,
          updatedAt: Date.now(),
        });
        setSnapshot((current) =>
          current.path === path
            ? {
                ...current,
                data: result.data,
                meta: result.meta,
                loading: false,
                refreshing: false,
                error: null,
              }
            : current
        );
      })
      .catch((cause: unknown) => {
        if (!active || (generations.get(path) ?? 0) !== generation) return;
        setSnapshot((current) => {
          if (current.path !== path) return current;
          return {
            ...current,
            loading: false,
            refreshing: false,
            error: current.data === null ? errorMessage(cause) : null,
          };
        });
      })
      .finally(() => {
        endActivity();
        if (!active || (generations.get(path) ?? 0) !== generation) return;
        setSnapshot((current) =>
          current.path === path
            ? { ...current, loading: false, refreshing: false }
            : current
        );
      });

    return () => {
      active = false;
    };
  }, [path, version]);

  const mutate = useCallback(
    (updater: T | null | ((current: T | null) => T | null)) => {
      if (!path) return;
      setSnapshot((current) => {
        const base: ResourceSnapshot<T> =
          current.path === path
            ? current
            : {
                path,
                data: (cache.get(path)?.data as T | undefined) ?? null,
                meta: cache.get(path)?.meta,
                loading: false,
                refreshing: false,
                error: null,
              };
        const data =
          typeof updater === "function"
            ? (updater as (current: T | null) => T | null)(base.data)
            : updater;
        const entry = cache.get(path);
        cache.set(path, {
          data,
          meta: base.meta,
          updatedAt: entry?.updatedAt ?? Date.now(),
        });
        return { ...base, data };
      });
    },
    [path]
  );

  const current =
    snapshot.path === path
      ? snapshot
      : path
        ? initialSnapshot<T>(path)
        : initialSnapshot<T>(null);

  return {
    data: current.data,
    meta: current.meta,
    loading: current.loading,
    refreshing: current.refreshing,
    error: current.error,
    reload,
    mutate,
  };
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
