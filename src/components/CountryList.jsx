/**
 * CountryList
 * -----------
 * Scrollable list of countries with continent badges.
 */

import "./CountryList.css";

// ── Continent → badge color mapping (light theme, muted) ────────
const CONTINENT_BADGE = {
  Africa:          { bg: "#faf0e6", color: "#9e7c4f" },
  Antarctica:      { bg: "#eaf2f8", color: "#6a8da8" },
  Asia:            { bg: "#edf5ea", color: "#5d8a4e" },
  Europe:          { bg: "#eaf0f8", color: "#4a7ab5" },
  "North America": { bg: "#f8eaea", color: "#a65d5d" },
  Oceania:         { bg: "#f0ecf5", color: "#7a5f9e" },
  "South America": { bg: "#f2f2e6", color: "#7a7a3e" },
};

export default function CountryList({
  countries,
  selectedCountry,
  onSelectCountry,
}) {
  if (countries.length === 0) {
    return (
      <div className="country-list__empty" id="country-list-empty">
        <svg
          className="country-list__empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M8 11h6" />
        </svg>
        <p>No countries match your filter</p>
      </div>
    );
  }

  return (
    <ul className="country-list" id="country-list">
      {countries.map((c) => {
        const isSelected = c.name === selectedCountry;
        const badge = CONTINENT_BADGE[c.continent] || {
          bg: "#f0f0f0",
          color: "#888",
        };

        return (
          <li
            key={c.name}
            className={`country-list__item ${isSelected ? "country-list__item--active" : ""}`}
            onClick={() => onSelectCountry(c.name)}
            role="button"
            tabIndex={0}
            aria-selected={isSelected}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectCountry(c.name);
              }
            }}
          >
            <span className="country-list__name">{c.name}</span>
            <span
              className="country-list__badge"
              style={{ background: badge.bg, color: badge.color }}
            >
              {c.continent}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
