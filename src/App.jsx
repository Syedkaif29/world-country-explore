import { useState, useEffect, useCallback } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapViewComponent from "./components/MapViewComponent";
import { FEATURE_LAYER_URL } from "./utils/mapUtils";

/**
 * App — Root layout & state owner
 * ================================
 * Uses CSS Grid for a three-region layout:
 *   ┌─────────────────────────────────────┐
 *   │              Header                 │
 *   ├──────────┬──────────────────────────┤
 *   │ Sidebar  │        Map               │
 *   │          │                          │
 *   └──────────┴──────────────────────────┘
 *
 * On mobile (< 768px), the sidebar becomes a slide-in drawer
 * toggled via a hamburger button in the header.
 *
 * State lives here so both Sidebar and Map can communicate:
 *  - countries:        full list of {name, continent} objects
 *  - selectedCountry:  the country name the user picked
 *  - loading:          true while the initial query runs
 *  - sidebarOpen:      whether sidebar drawer is visible (mobile)
 */
export default function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Load country list once on mount ────────────────────────────
  useEffect(() => {
    const layer = new FeatureLayer({ url: FEATURE_LAYER_URL });

    layer
      .queryFeatures({
        where: "LAND_TYPE = 'Primary Land'",
        outFields: ["COUNTRY", "CONTINENT"],
        orderByFields: ["COUNTRY ASC"],
        returnGeometry: false,
        num: 300,
      })
      .then((result) => {
        const seen = new Set();
        const list = [];
        for (const f of result.features) {
          const name = f.attributes.COUNTRY;
          if (name && !seen.has(name)) {
            seen.add(name);
            list.push({
              name,
              continent: f.attributes.CONTINENT || "Unknown",
            });
          }
        }
        setCountries(list);
      })
      .catch((err) => console.error("Failed to load countries:", err))
      .finally(() => setLoading(false));
  }, []);

  // When a country is selected, auto-close the drawer on mobile
  const handleSelectCountry = useCallback((countryName) => {
    setSelectedCountry(countryName);
    setSidebarOpen(false);
  }, []);

  const handleDeselectCountry = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="app-layout">
      <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Backdrop overlay — visible only on mobile when sidebar is open */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar} />
      )}

      <Sidebar
        countries={countries}
        loading={loading}
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      <MapViewComponent
        selectedCountry={selectedCountry}
        onDeselectCountry={handleDeselectCountry}
      />
    </div>
  );
}
