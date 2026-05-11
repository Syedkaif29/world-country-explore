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
 * State lives here so both Sidebar and Map can communicate:
 *  - countries:        full list of {name, continent} objects
 *  - selectedCountry:  the country name the user picked
 *  - loading:          true while the initial query runs
 */
export default function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Load country list once on mount ────────────────────────────
  // We use FeatureLayer.queryFeatures() rather than a raw fetch()
  // because it gives us typed FeatureSets, handles pagination,
  // and respects the layer's spatial reference automatically.
  useEffect(() => {
    const layer = new FeatureLayer({ url: FEATURE_LAYER_URL });

    layer
      .queryFeatures({
        where: "LAND_TYPE = 'Primary Land'", // one entry per country
        outFields: ["COUNTRY", "CONTINENT"],
        orderByFields: ["COUNTRY ASC"],
        returnGeometry: false,               // we only need names here
        num: 300,                            // more than enough
      })
      .then((result) => {
        // De-duplicate in case of any remaining duplicates
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

  // Memoised callback so Sidebar doesn't re-render MapViewComponent
  const handleSelectCountry = useCallback((countryName) => {
    setSelectedCountry(countryName);
  }, []);

  // Called when the popup is closed — clears the map highlight
  // and resets the sidebar selection.
  const handleDeselectCountry = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  return (
    <div className="app-layout">
      <Header />
      <Sidebar
        countries={countries}
        loading={loading}
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
      />
      <MapViewComponent
        selectedCountry={selectedCountry}
        onDeselectCountry={handleDeselectCountry}
      />
    </div>
  );
}
