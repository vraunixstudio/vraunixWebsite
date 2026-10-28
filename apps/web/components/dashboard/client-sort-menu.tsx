"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icons";

const options = [
  { value: "-createdAt", label: "Newest first" },
  { value: "-updatedAt", label: "Recently updated" },
  { value: "name", label: "Name A–Z" },
  { value: "email", label: "Email A–Z" },
] as const;

export function ClientSortMenu({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

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
    const active =
      menuRef.current?.querySelector<HTMLButtonElement>(
        '[aria-selected="true"]'
      ) ?? menuRef.current?.querySelector<HTMLButtonElement>('[role="option"]');
    active?.focus();
  }, [open]);

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
    <div className="clients-sort" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="clients-sort__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Sort clients: ${selected.label}`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <Icon name="filter" size={15} />
        <span>{selected.label}</span>
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
          className="clients-sort__menu"
          role="listbox"
          aria-label="Sort clients"
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
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                className={`clients-sort__option ${active ? "is-selected" : ""}`}
                onClick={() => choose(option.value)}
              >
                <span>{option.label}</span>
                {active && <Icon name="check" size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
