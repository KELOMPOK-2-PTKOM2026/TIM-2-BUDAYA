import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Eksplorasi', path: '/eksplorasi' },
    { name: 'Provinsi', path: '/#provinsi' },
    { name: 'Artikel', path: '/#artikel' },
    { name: 'Tentang', path: '/#tentang' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('#')[0]) && path !== '/';
  };

  return (
    <nav className="navbar">
      <div className="container-wide">
        <div className="navbar__inner">
          <Link to="/" className="navbar__brand">
            <div className="navbar__logo">
              <span className="navbar__logo-letter">J</span>
            </div>
            <span className="navbar__brand-text">
              Jelajah<span className="navbar__brand-accent">Sumatera</span>
            </span>
          </Link>

          <div className="navbar__links">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`navbar__link ${isActive(item.path) ? 'navbar__link--active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="navbar__actions">
            <button className="navbar__icon-btn" aria-label="Cari">
              <Search style={{ width: 16, height: 16 }} />
            </button>
            <Button variant="ghost" style={{ color: '#1C3B2E', fontWeight: 500 }}>Masuk</Button>
            <Button className="btn-primary" style={{ fontWeight: 600 }}>Daftar</Button>
          </div>

          <button
            className="navbar__mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>

        {isOpen && (
          <div className="navbar__mobile">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="navbar__mobile-link"
              >
                {item.name}
              </Link>
            ))}
            <div className="navbar__mobile-actions">
              <Button variant="ghost" style={{ color: '#1C3B2E' }}>Masuk</Button>
              <Button className="btn-primary">Daftar</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;