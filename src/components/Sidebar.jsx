import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import CountryList from "./CountryList";
import "./Sidebar.css";

/**
 * Sidebar
 * -------
 * Container for search + country list.
 *
 * Search logic lives here because it's purely a UI concern —
 * the map component doesn't need to know about search terms,
 * only about the *selected* country (which is lifted to App).
 *
 * Filtering rule: search only triggers after 3+ characters.
 * Below that threshold, we show the full list.
 */
export default function Sidebar({
  countries,
  loading,
  selectedCountry,
  onSelectCountry,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // ── Filter logic ──────────────────────────────────────────────
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
    <aside className="sidebar" id="sidebar">
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
