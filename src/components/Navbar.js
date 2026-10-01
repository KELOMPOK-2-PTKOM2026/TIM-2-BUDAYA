import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="navbar">
      <div className="container-wide">
        <div className="navbar__inner">
          {/* Brand */}
          <Link to="/" className="navbar__brand" onClick={closeMobile}>
            <div className="navbar__logo">
              <span className="navbar__logo-letter">J</span>
            </div>
            <span className="navbar__brand-text">
              Jelajah<span className="navbar__brand-accent">Sumatera</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="navbar__links">
            <NavLink to="/" end className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
              Beranda
            </NavLink>
            <NavLink to="/eksplorasi" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
              Eksplorasi
            </NavLink>
            <a href="#tentang" className="navbar__link">Tentang</a>
          </div>

          {/* Desktop Actions */}
          <div className="navbar__actions">
            <button className="navbar__icon-btn" aria-label="Cari">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="navbar__mobile-toggle" onClick={toggleMobile} aria-label="Menu">
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="navbar__mobile">
            <NavLink to="/" end className="navbar__mobile-link" onClick={closeMobile}>
              Beranda
            </NavLink>
            <NavLink to="/eksplorasi" className="navbar__mobile-link" onClick={closeMobile}>
              Eksplorasi
            </NavLink>
            <a href="#tentang" className="navbar__mobile-link" onClick={closeMobile}>
              Tentang
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
