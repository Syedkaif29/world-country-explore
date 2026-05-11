import "./Header.css";

/**
 * Header
 * ------
 * Fixed top bar with app title and subtle branding.
 * Uses a gradient background with glassmorphism for premium feel.
 */
export default function Header() {
  return (
    <header className="header" id="app-header">
      <div className="header__brand">
        {/* Globe SVG icon */}
        <svg
          className="header__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
        </svg>
        <div className="header__text">
          <h1 className="header__title">World Country Explorer</h1>
          <span className="header__subtitle">Interactive GIS Map</span>
        </div>
      </div>

      <div className="header__meta">
        <span className="header__badge">ArcGIS SDK</span>
        <span className="header__badge header__badge--accent">Live Data</span>
      </div>
    </header>
  );
}
