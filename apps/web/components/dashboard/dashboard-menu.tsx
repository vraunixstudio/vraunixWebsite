"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/icons";

export type DashboardMenuOption = {
  value: string;
  label: string;
  hint?: string;
  tone?: "danger";
};

export function DashboardMenu({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = "Select",
  icon,
  searchable = false,
  searchPlaceholder = "Search…",
  disabled = false,
  className,
}: {
  value: string;
  options: DashboardMenuOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  icon?: IconName;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuId = useId();
  const selected = options.find((option) => option.value === value);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) ||
        option.hint?.toLowerCase().includes(needle)
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      if (searchable) {
        searchRef.current?.focus();
      } else {
        const active =
          menuRef.current?.querySelector<HTMLButtonElement>(
            '[aria-selected="true"]'
          ) ??
          menuRef.current?.querySelector<HTMLButtonElement>('[role="option"]');
        active?.focus();
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, searchable]);

  function choose(next: string) {
    onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function moveFocus(direction: 1 | -1) {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ??
        []
    );
    if (items.length === 0) return;
    const currentIndex = items.indexOf(
      document.activeElement as HTMLButtonElement
    );
    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + direction + items.length) % items.length;
    items[nextIndex]?.focus();
  }

  return (
    <div
      className={`clients-sort dashboard-select ${className ?? ""}`}
      ref={rootRef}
    >
      <button
        ref={triggerRef}
        type="button"
        className="clients-sort__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${ariaLabel}: ${selected?.label ?? placeholder}`}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <Icon name={icon ?? "filter"} size={15} />
        <span className={selected ? undefined : "dashboard-select__placeholder"}>
          {selected?.label ?? placeholder}
        </span>
        <Icon
          name="chevron-down"
          size={14}
          className={open ? "is-open" : undefined}
        />
      </button>

      {open && (
        <div
          id={menuId}
          ref={menuRef}
          className="clients-sort__menu dashboard-select__menu"
          role="listbox"
          aria-label={ariaLabel}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              moveFocus(1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              moveFocus(-1);
            } else if (event.key === "Home") {
              event.preventDefault();
              menuRef.current
                ?.querySelector<HTMLButtonElement>('[role="option"]')
                ?.focus();
            } else if (event.key === "End") {
              event.preventDefault();
              const items = menuRef.current?.querySelectorAll<HTMLButtonElement>(
                '[role="option"]'
              );
              items?.[items.length - 1]?.focus();
            }
          }}
        >
          {searchable && (
            <div className="dashboard-select__search">
              <Icon name="search" size={14} />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
              />
            </div>
          )}
          {visible.length === 0 ? (
            <p className="dashboard-select__empty">No matches</p>
          ) : (
            visible.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`clients-sort__option dashboard-select__option ${
                    active ? "is-selected" : ""
                  } ${option.tone === "danger" ? "is-danger" : ""}`}
                  onClick={() => choose(option.value)}
                >
                  <span>
                    {option.label}
                    {option.hint && <small>{option.hint}</small>}
                  </span>
                  {active && <Icon name="check" size={14} />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
