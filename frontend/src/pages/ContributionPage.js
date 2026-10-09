import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProposalForm from '../components/ProposalForm';
import '../styles/ContactPage.css';

export default function ContributionPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Kontribusi Budaya — JelajahSumatera';
  }, []);

  return (
    <div className="contact-page">
      <div className="container-wide">
        <nav className="contact-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="contact-breadcrumb__link">Beranda</Link>
          <span className="contact-breadcrumb__separator">&rsaquo;</span>
          <span className="contact-breadcrumb__current">Kontribusi</span>
        </nav>

        <div className="contact-layout">
          <section className="contact-form-card">
            <h1 className="contact-form-card__title">Ajukan Budaya Lokal</h1>
            <p className="contact-form-card__intro">
              Bagikan pengetahuan tentang tradisi, seni, kuliner, atau warisan budaya Sumatera. Tim admin akan memverifikasi setiap ajuan.
            </p>
            <ProposalForm />
          </section>

          <aside className="contact-sidebar">
            <div className="contact-info-card">
              <h2 className="contact-info-card__title">Cara Berkontribusi</h2>
              <ul className="contact-info-list">
                <li className="contact-info-item"><span>1.</span><span>Isi nama budaya, provinsi, kategori, dan deskripsi dengan lengkap.</span></li>
                <li className="contact-info-item"><span>2.</span><span>Tambahkan URL foto jika tersedia untuk mendukung dokumentasi.</span></li>
                <li className="contact-info-item"><span>3.</span><span>Pantau hasil verifikasi pada halaman profil Anda.</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
