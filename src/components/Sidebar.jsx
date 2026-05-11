import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import CountryList from "./CountryList";
import "./Sidebar.css";

/**
 * Sidebar
 * -------
 * Container for search + country list.
 *
 * On desktop: always visible in the grid.
 * On mobile (< 768px): slides in as a fixed drawer.
 *   - `isOpen` controls visibility via a CSS class.
 *   - `onClose` is wired to the close button inside the drawer.
 *
 * Search logic lives here because it's purely a UI concern.
 * Filtering rule: search only triggers after 3+ characters.
 */
export default function Sidebar({
  countries,
  loading,
  selectedCountry,
  onSelectCountry,
  isOpen,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = useMemo(() => {
    if (searchTerm.length < 3) return countries;
    const term = searchTerm.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.continent.toLowerCase().includes(term)
    );
  }, [countries, searchTerm]);

  return (
    <aside
      className={`sidebar ${isOpen ? "sidebar--open" : ""}`}
      id="sidebar"
    >
      {/* ── Mobile close button ── */}
      <button
        className="sidebar__close-btn"
        onClick={onClose}
        aria-label="Close sidebar"
        title="Close sidebar"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* ── Header strip ── */}
      <div className="sidebar__header">
        <h2 className="sidebar__title">Countries</h2>
        <span className="sidebar__count">
          {loading ? "Loading…" : `${filteredCountries.length} countries`}
        </span>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {loading ? (
        <div className="sidebar__loading">
          <div className="sidebar__spinner" />
          <p>Loading countries…</p>
        </div>
      ) : (
        <CountryList
          countries={filteredCountries}
          selectedCountry={selectedCountry}
          onSelectCountry={onSelectCountry}
        />
      )}
    </aside>
  );
}
