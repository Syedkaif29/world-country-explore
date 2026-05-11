import "./Header.css";

/**
 * Header
 * ------
 * Fixed top bar with app title, branding badges, and a hamburger
 * menu button that is visible only on mobile (< 768px).
 */
export default function Header({ onToggleSidebar, sidebarOpen }) {
  return (
    <header className="header" id="app-header">
      {/* ── Hamburger button (mobile only) ── */}
      <button
        className="header__menu-btn"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        title={sidebarOpen ? "Close menu" : "Open menu"}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {sidebarOpen ? (
            /* X icon when open */
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            /* Hamburger icon when closed */
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

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
