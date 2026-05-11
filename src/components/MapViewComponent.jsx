import { useEffect, useRef, useState } from "react";

// ── ArcGIS Core Imports ──────────────────────────────────────────
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

// Widgets
import Zoom from "@arcgis/core/widgets/Zoom";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Search from "@arcgis/core/widgets/Search";
import Legend from "@arcgis/core/widgets/Legend";
import Swipe from "@arcgis/core/widgets/Swipe";
import Expand from "@arcgis/core/widgets/Expand";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

// Utilities
import {
  FEATURE_LAYER_URL,
  createRenderer,
  createPopupTemplate,
  HIGHLIGHT_OPTIONS,
} from "../utils/mapUtils";

import "./MapViewComponent.css";

/**
 * MapViewComponent
 * ================
 * Core GIS component. Handles:
 *   1. Map + MapView initialisation (once)
 *   2. FeatureLayer with continent-based renderer
 *   3. ArcGIS widgets (Swipe toggled on demand)
 *   4. Country selection → highlight + zoom + popup
 *   5. Highlight removal when popup is closed
 *   6. Cleanup on unmount
 */
export default function MapViewComponent({ selectedCountry, onDeselectCountry }) {
  // ── Refs ────────────────────────────────────────────────────────
  const mapDiv = useRef(null);
  const viewRef = useRef(null);
  const layerRef = useRef(null);
  const layerViewRef = useRef(null);
  const highlightRef = useRef(null);
  const swipeRef = useRef(null);
  const swipeLayerRef = useRef(null);

  // ── Swipe toggle state ──────────────────────────────────────────
  const [swipeActive, setSwipeActive] = useState(false);

  // ── EFFECT 1: Initialise map, layer, and widgets ───────────────
  useEffect(() => {
    if (!mapDiv.current) return;

    // ── 1. Create FeatureLayer ─────────────────────────────────
    const countriesLayer = new FeatureLayer({
      url: FEATURE_LAYER_URL,
      title: "World Countries",
      outFields: ["*"],
      renderer: createRenderer(),
      popupTemplate: createPopupTemplate(),
      opacity: 0.8,
    });

    layerRef.current = countriesLayer;

    // ── 2. Swipe comparison layer (hidden by default) ─────────
    const swipeLayer = new FeatureLayer({
      url: FEATURE_LAYER_URL,
      title: "Countries (Solid)",
      outFields: ["COUNTRY", "CONTINENT"],
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: [220, 225, 230, 200],
          outline: { color: [180, 185, 190, 160], width: 0.3 },
        },
      },
      popupEnabled: false,
      opacity: 0.85,
      visible: false,
    });

    swipeLayerRef.current = swipeLayer;

    // ── 3. Create Map ──────────────────────────────────────────
    // Using "gray-vector" — a clean, professional light basemap
    // commonly used in ArcGIS Online dashboards and Portal apps.
    const map = new Map({
      basemap: "gray-vector",
      layers: [swipeLayer, countriesLayer],
    });

    // ── 4. Create MapView ──────────────────────────────────────
    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [20, 20],
      zoom: 3,
      ui: {
        components: [],
      },
      popup: {
        dockEnabled: true,
        dockOptions: {
          position: "bottom-center",
          breakpoint: false,
        },
      },
      highlightOptions: HIGHLIGHT_OPTIONS,
      constraints: {
        minZoom: 2,
      },
    });

    viewRef.current = view;

    // ── 5. Get the LayerView for highlighting ──────────────────
    view.whenLayerView(countriesLayer).then((lv) => {
      layerViewRef.current = lv;
    });

    // ── 6. Watch for popup close → clear highlight ─────────────
    // When the user closes the popup, we remove the highlight
    // and notify the parent to deselect the country in the sidebar.
    reactiveUtils.watch(
      () => view.popup.visible,
      (visible) => {
        if (!visible) {
          if (highlightRef.current) {
            highlightRef.current.remove();
            highlightRef.current = null;
          }
          onDeselectCountry?.();
        }
      }
    );

    // ── 7. Add Widgets ─────────────────────────────────────────

    // Zoom controls
    const zoom = new Zoom({ view });
    view.ui.add(zoom, "top-right");

    // Scale bar
    const scaleBar = new ScaleBar({
      view,
      unit: "dual",
      style: "ruler",
    });
    view.ui.add(scaleBar, "bottom-left");

    // Basemap Gallery (inside Expand)
    const basemapGallery = new BasemapGallery({ view });
    const bgExpand = new Expand({
      view,
      content: basemapGallery,
      expandIcon: "basemap",
      expandTooltip: "Basemap Gallery",
      group: "top-right",
    });
    view.ui.add(bgExpand, "top-right");

    // Search widget
    const search = new Search({
      view,
      allPlaceholder: "Search places or coordinates…",
    });
    view.ui.add(search, "top-left");

    // Legend (inside Expand) — positioned top-right to avoid
    // overlapping with the Compare button in bottom-right.
    const legend = new Legend({ view });
    const legendExpand = new Expand({
      view,
      content: legend,
      expandIcon: "legend",
      expandTooltip: "Legend",
      group: "top-right",
    });
    view.ui.add(legendExpand, "top-right");

    // ── 8. Cleanup ─────────────────────────────────────────────
    return () => {
      if (highlightRef.current) {
        highlightRef.current.remove();
        highlightRef.current = null;
      }
      if (view) {
        view.destroy();
      }
      viewRef.current = null;
      layerRef.current = null;
      layerViewRef.current = null;
      swipeRef.current = null;
      swipeLayerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── EFFECT 2: Toggle Swipe widget on/off ──────────────────────
  useEffect(() => {
    const view = viewRef.current;
    const layer = layerRef.current;
    const swipeLayer = swipeLayerRef.current;

    if (!view || !layer || !swipeLayer) return;

    if (swipeActive) {
      swipeLayer.visible = true;
      const swipe = new Swipe({
        view,
        leadingLayers: [layer],
        trailingLayers: [swipeLayer],
        direction: "horizontal",
        position: 50,
      });
      view.ui.add(swipe);
      swipeRef.current = swipe;
    } else {
      if (swipeRef.current) {
        view.ui.remove(swipeRef.current);
        swipeRef.current.destroy();
        swipeRef.current = null;
      }
      swipeLayer.visible = false;
    }

    return () => {
      if (swipeRef.current) {
        swipeRef.current.destroy();
        swipeRef.current = null;
      }
    };
  }, [swipeActive]);

  // ── EFFECT 3: React to country selection ──────────────────────
  useEffect(() => {
    if (!selectedCountry) return;

    const view = viewRef.current;
    const layer = layerRef.current;
    const layerView = layerViewRef.current;

    if (!view || !layer || !layerView) return;

    layer
      .queryFeatures({
        where: `COUNTRY = '${selectedCountry.replace(/'/g, "''")}'`,
        outFields: ["*"],
        returnGeometry: true,
      })
      .then((result) => {
        const features = result.features;
        if (!features || features.length === 0) return;

        // Remove previous highlight
        if (highlightRef.current) {
          highlightRef.current.remove();
          highlightRef.current = null;
        }

        // Highlight all geometries for this country
        highlightRef.current = layerView.highlight(features);

        // Zoom to the country — on desktop we offset left for the
        // sidebar; on mobile the sidebar is a closed drawer so no offset.
        const isMobile = window.innerWidth < 768;
        view.goTo(
          {
            target: features,
            padding: {
              top: 50,
              bottom: 50,
              left: isMobile ? 30 : 350,
              right: 30,
            },
          },
          { duration: 1500, easing: "ease-in-out" }
        );

        // Open popup
        view.openPopup({
          features,
          updateLocationEnabled: true,
        });
      })
      .catch((err) => {
        console.error("Failed to select country:", err);
      });
  }, [selectedCountry]);

  return (
    <div className="map-container" id="map-container">
      <div className="map-view" ref={mapDiv} id="map-view" />

      {/* ── Swipe Toggle Button ── */}
      <button
        className={`swipe-toggle ${swipeActive ? "swipe-toggle--active" : ""}`}
        onClick={() => setSwipeActive((prev) => !prev)}
        title={swipeActive ? "Disable layer swipe" : "Enable layer swipe"}
        aria-label="Toggle layer swipe"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="12" y1="3" x2="12" y2="21" />
          <polyline points="8 10 5 12 8 14" />
          <polyline points="16 10 19 12 16 14" />
        </svg>
        <span>{swipeActive ? "Swipe ON" : "Swipe Layers"}</span>
      </button>
    </div>
  );
}
