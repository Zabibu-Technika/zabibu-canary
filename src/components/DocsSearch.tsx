"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchDocs } from "@/lib/docs-index";

export function DocsSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => searchDocs(query), [query]);
  const showPanel = focused && query.trim().length > 0;

  // ⌘K / Ctrl+K focuses search from anywhere on the page.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Click outside closes the panel.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => setActive(0), [query]);

  function go(href: string) {
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].href);
    } else if (e.key === "Escape") {
      setQuery("");
      setFocused(false);
      inputRef.current?.blur();
    }
  }

  const activeId = results[active] ? `docs-search-opt-${results[active].id}` : undefined;

  return (
    <div className="docs-search" ref={wrapRef} role="search">
      <div className="docs-search-field">
        <Search size={15} strokeWidth={1.75} aria-hidden="true" className="docs-search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="docs-search-input"
          placeholder="search docs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-label="Search the documentation"
          aria-expanded={showPanel}
          aria-controls="docs-search-results"
          aria-autocomplete="list"
          aria-activedescendant={showPanel ? activeId : undefined}
          autoComplete="off"
          spellCheck={false}
        />
        {query ? (
          <button
            type="button"
            className="docs-search-clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            <X size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        ) : (
          <kbd className="docs-search-kbd" aria-hidden="true">
            ⌘K
          </kbd>
        )}
      </div>

      {showPanel && (
        <ul className="docs-search-results" id="docs-search-results" role="listbox" aria-label="Search results">
          {results.length === 0 && (
            <li className="docs-search-empty" role="presentation">
              no matches for “{query.trim()}”
            </li>
          )}
          {results.map((r, i) => (
            <li key={r.id} role="option" id={`docs-search-opt-${r.id}`} aria-selected={i === active}>
              <button
                type="button"
                className={`docs-search-item${i === active ? " active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r.href)}
                tabIndex={-1}
              >
                <span className="docs-search-item-title">{r.title}</span>
                <span className="docs-search-item-section">{r.section}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
