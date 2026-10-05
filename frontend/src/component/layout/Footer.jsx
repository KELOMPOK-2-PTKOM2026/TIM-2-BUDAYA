import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-wide footer__inner">
        <div className="footer__grid">
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
              Platform digital yang mendokumentasikan kekayaan budaya 10 provinsi di Pulau Sumatera secara terkurasi dan terpercaya.
            </p>
            <div className="footer__social">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="footer__social-link" aria-label="social">
                  <Icon style={{ width: 16, height: 16 }} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer__heading">Jelajahi</h4>
            <ul className="footer__list">
              {['Beranda', 'Eksplorasi Budaya', 'Per Provinsi', 'Artikel', 'Kuliner'].map((item) => (
                <li key={item}><Link to="/">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer__heading">Komunitas</h4>
            <ul className="footer__list">
              {['Kontribusi', 'Panduan Pengajuan', 'Forum Diskusi', 'Pelatihan Kurator', 'FAQ'].map((item) => (
                <li key={item}><Link to="/">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer__heading">Hubungi Kami</h4>
            <ul className="footer__list footer__list--muted">
              <li>Jl. Sudirman No. 25<br />Kota Padang, Sumatera Barat</li>
              <li><Mail style={{ width: 16, height: 16, marginTop: 2 }} /> halo@jelajahsumatera.id</li>
              <li>+62 751 123 4567</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© 2025 JelajahSumatera. Hak cipta dilindungi.</p>
          <div className="footer__legal">
            <Link to="/">Kebijakan Privasi</Link>
            <Link to="/">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
