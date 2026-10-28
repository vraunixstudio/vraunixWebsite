"use client";

import { Icon } from "@/components/icons";

export function SearchBox({
  value,
  onChange,
  placeholder = "Search",
  className = "",
  clearable = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  clearable?: boolean;
}) {
  return (
    <label className={`search-box ${className}`.trim()}>
      <Icon name="search" size={17} />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {clearable && value && (
        <button
          type="button"
          className="search-box__clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <Icon name="x" size={13} />
        </button>
      )}
    </label>
  );
}
