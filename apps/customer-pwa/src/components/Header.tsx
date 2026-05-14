import { Link } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <header className="header" id="site-header">
      <div className="container header-inner">
        <Link to="/" className="header-brand" id="brand-link">
          <span className="header-logo" aria-hidden="true">🏘️</span>
          <span className="header-title">mohalla</span>
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          <Link to="/search" className="header-nav-link" id="nav-search">
            <svg className="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span>Search</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
