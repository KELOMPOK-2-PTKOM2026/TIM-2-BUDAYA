import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer id="kontak" className="footer">
      <div className="container-wide">
        <div className="footer__inner">
          <div className="footer__grid">
            {/* Column 1: Brand & Bio */}
            <div className="footer__brand-block">
              <div className="footer__brand">
                <div className="footer__logo">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E5A83B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <path d="M7 8h10" />
                    <path d="M12 8v8" />
                    <path d="M9 16h6" />
                  </svg>
                </div>
                <span className="footer__brand-text">
                  Jelajah<span className="footer__brand-bold">Sumatera</span>
                </span>
              </div>
              <p className="footer__desc">
                Platform eksplorasi budaya digital independen yang didedikasikan untuk mendokumentasikan, memverifikasi, dan menyebarkan kekayaan warisan budaya Sumatera.
              </p>
              <div className="footer__social">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Website">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Twitter">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="Instagram">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer__social-link" aria-label="YouTube">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Eksplorasi */}
            <div className="footer__nav-col">
              <h3 className="footer__heading">EKSPLORASI</h3>
              <ul className="footer__list">
                <li><Link to="/eksplorasi?province=aceh">Budaya Aceh</Link></li>
                <li><Link to="/eksplorasi?province=sumatera-utara">Sumatera Utara</Link></li>
                <li><Link to="/eksplorasi?province=sumatera-barat">Minangkabau</Link></li>
                <li><Link to="/eksplorasi?category=tari">Seni &amp; Tradisi</Link></li>
                <li><Link to="/eksplorasi?category=kuliner">Kuliner Sumatra</Link></li>
              </ul>
            </div>

            {/* Column 3: Komunitas */}
            <div className="footer__nav-col">
              <h3 className="footer__heading">KOMUNITAS</h3>
              <ul className="footer__list">
                <li><Link to="/kontribusi">Jadi Kontributor</Link></li>
                <li><Link to="/eksplorasi">Verifikasi Ahli</Link></li>
                <li><Link to="/eksplorasi">Forum Diskusi</Link></li>
                <li><Link to="/kontribusi">Pengajuan Budaya</Link></li>
              </ul>
            </div>

            {/* Column 4: Sekretariat */}
            <div className="footer__nav-col">
              <h3 className="footer__heading">SEKRETARIAT</h3>
              <ul className="footer__contact-list">
                <li className="footer__address">
                  Jl. Jenderal Sudirman No. 45, Padang, Sumatera Barat, Indonesia
                </li>
                <li>
                  <a href="mailto:kontak@jelajahsumatera.id" className="footer__email">
                    kontak@jelajahsumatera.id
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer__bottom">
            <span className="footer__copy">&copy; 2025 JelajahSumatera. Seluruh Hak Cipta Dilindungi.</span>
            <div className="footer__legal">
              <Link to="/eksplorasi">Kebijakan Privasi</Link>
              <span className="footer__legal-divider"></span>
              <Link to="/eksplorasi">Syarat &amp; Ketentuan</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
