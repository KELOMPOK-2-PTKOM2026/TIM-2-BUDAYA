import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer__inner">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand-block">
              <div className="footer__brand">
                <div className="footer__logo">
                  <span className="footer__logo-letter">J</span>
                </div>
                <span className="footer__brand-text">
                  Jelajah<span className="footer__brand-accent">Sumatera</span>
                </span>
              </div>
              <p className="footer__desc">
                Platform digital untuk melestarikan dan mempromosikan kekayaan budaya Sumatera kepada dunia.
              </p>
              <div className="footer__social">
                <a href="#" className="footer__social-link" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="footer__social-link" aria-label="Twitter">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a href="#" className="footer__social-link" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Jelajahi */}
            <div>
              <h3 className="footer__heading">Jelajahi</h3>
              <ul className="footer__list">
                <li><Link to="/">Beranda</Link></li>
                <li><Link to="/eksplorasi">Eksplorasi Budaya</Link></li>
                <li><Link to="/eksplorasi?category=tari">Tari Tradisional</Link></li>
                <li><Link to="/eksplorasi?category=kuliner">Kuliner Khas</Link></li>
                <li><Link to="/eksplorasi?category=kain">Kain Tenun</Link></li>
              </ul>
            </div>

            {/* Provinsi */}
            <div>
              <h3 className="footer__heading">Provinsi</h3>
              <ul className="footer__list">
                <li><Link to="/eksplorasi?province=aceh">Aceh</Link></li>
                <li><Link to="/eksplorasi?province=sumatera-utara">Sumatera Utara</Link></li>
                <li><Link to="/eksplorasi?province=sumatera-barat">Sumatera Barat</Link></li>
                <li><Link to="/eksplorasi?province=sumatera-selatan">Sumatera Selatan</Link></li>
                <li><Link to="/eksplorasi?province=lampung">Lampung</Link></li>
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h3 className="footer__heading">Kontak</h3>
              <ul className="footer__list footer__list--muted">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>info@jelajahsumatera.id</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Medan, Sumatera Utara</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+62 61 123 4567</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="footer__bottom">
            <span className="footer__copy">&copy; 2025 JelajahSumatera. Semua hak dilindungi.</span>
            <div className="footer__legal">
              <a href="#">Kebijakan Privasi</a>
              <a href="#">Syarat &amp; Ketentuan</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
