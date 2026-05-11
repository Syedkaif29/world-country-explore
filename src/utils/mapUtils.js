/**
 * mapUtils.js
 * -----------
 * Centralized GIS configuration.
 */

// ── Feature Layer URL ──────────────────────────────────────────────
export const FEATURE_LAYER_URL =
  "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries/FeatureServer/0";

// ── Continent Color Palette ────────────────────────────────────────
// Soft, desaturated tones optimized for a LIGHT basemap.
// Professional cartographic style — readable without being garish.
export const CONTINENT_COLORS = {
  Africa:          [210, 180, 140, 170],   // tan
  Antarctica:      [190, 210, 225, 170],   // ice blue
  Asia:            [165, 200, 150, 170],   // sage
  Europe:          [155, 185, 220, 170],   // cornflower
  "North America": [200, 160, 160, 170],   // blush
  Oceania:         [185, 170, 205, 170],   // lavender
  "South America": [195, 195, 140, 170],   // olive gold
};

// ── Unique-Value Renderer (continent-based) ────────────────────────
export function createRenderer() {
  return {
    type: "unique-value",
    field: "CONTINENT",
    defaultSymbol: {
      type: "simple-fill",
      color: [200, 200, 200, 150],
      outline: { color: [160, 160, 160, 120], width: 0.4 },
    },
    uniqueValueInfos: Object.entries(CONTINENT_COLORS).map(
      ([continent, color]) => ({
        value: continent,
        symbol: {
          type: "simple-fill",
          color,
          outline: { color: [140, 145, 150, 140], width: 0.4 },
        },
        label: continent,
      })
    ),
  };
}

// ── Popup Template ─────────────────────────────────────────────────
export function createPopupTemplate() {
  return {
    title: "{COUNTRY}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          { fieldName: "COUNTRY",    label: "Country" },
          { fieldName: "ISO_CC",     label: "ISO Code" },
          { fieldName: "CONTINENT",  label: "Continent" },
          { fieldName: "COUNTRYAFF", label: "Affiliated Country" },
          { fieldName: "LAND_TYPE",  label: "Land Type" },
          { fieldName: "LAND_RANK",  label: "Land Rank" },
          {
            fieldName: "Shape__Area",
            label: "Area (sq m)",
            format: { digitSeparator: true, places: 0 },
          },
        ],
      },
    ],
  };
}

// ── Highlight Options ──────────────────────────────────────────────
// Professional blue highlight on a light basemap.
export const HIGHLIGHT_OPTIONS = {
  color: [0, 121, 193, 1],
  haloColor: [0, 121, 193, 0.4],
  haloOpacity: 0.6,
  fillOpacity: 0.15,
};
