/**
 * SearchBar
 * ---------
 * Controlled input with a magnifying-glass icon.
 * Filters the sidebar country list (not map geocoding).
 * Only triggers after 3+ characters to avoid noisy results.
 */

import "./SearchBar.css";

export default function SearchBar({ value, onChange }) {
  const isFiltering = value.length >= 3;

  return (
    <div className="searchbar" id="country-search">
      <div className="searchbar__input-wrapper">
        {/* Magnifying glass icon */}
        <svg
          className="searchbar__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>

        <input
          type="text"
          className="searchbar__input"
          placeholder="Filter countries…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Filter countries"
        />

        {/* Clear button */}
        {value.length > 0 && (
          <button
            className="searchbar__clear"
            onClick={() => onChange("")}
            aria-label="Clear search"
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Helper hint */}
      {value.length > 0 && !isFiltering && (
        <span className="searchbar__hint">
          Type {3 - value.length} more character{3 - value.length !== 1 ? "s" : ""} to filter
        </span>
      )}
      {isFiltering && (
        <span className="searchbar__hint searchbar__hint--active">
          Filtering results…
        </span>
      )}
    </div>
  );
}
