import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProposalForm from '../components/ProposalForm';
import AccessLevels from '../components/AccessLevels';
import { getAccessLevel } from '../lib/roles';
import '../styles/ContributionPage.css';
import '../styles/AccessLevels.css';

export default function ContributionPage() {
  const { user } = useContext(AuthContext);
  const access = getAccessLevel(user);

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
            <div className="contribution-access-row">
              <span className="contribution-access-row__label">Akses Anda:</span>
              <span className={`role-badge role-badge--${access.key}`}>{access.label}</span>
            </div>
            <h1 className="contact-form-card__title">Ajukan Budaya Lokal</h1>

            {user ? (
              <>
                <p className="contact-form-card__intro">
                  Bagikan pengetahuan tentang tradisi, seni, kuliner, atau warisan budaya Sumatera. Tim admin akan memverifikasi setiap ajuan.
                </p>
                <ProposalForm />
              </>
            ) : (
              <div className="contribution-gate">
                <p className="contact-form-card__intro">
                  Sebagai <strong>Pengunjung</strong>, Anda dapat melihat dan menjelajahi seluruh informasi budaya.
                  Untuk <strong>mengajukan budaya baru</strong>, Anda perlu menjadi <strong>Kontributor</strong> dengan
                  mendaftar dan memverifikasi email terlebih dahulu.
                </p>
                <AccessLevels currentKey="guest" />
                <div className="contribution-gate__actions">
                  <Link to="/register" className="contribution-gate__btn contribution-gate__btn--primary">
                    Daftar Jadi Kontributor
                  </Link>
                  <Link
                    to="/login"
                    state={{ from: '/kontribusi', reason: 'Masuk sebagai Kontributor untuk mengajukan budaya.' }}
                    className="contribution-gate__btn"
                  >
                    Sudah Punya Akun? Masuk
                  </Link>
                </div>
                <Link to="/eksplorasi" className="contribution-gate__explore">
                  Atau lanjut jelajahi budaya tanpa akun &rarr;
                </Link>
              </div>
            )}
          </section>

          <aside className="contact-sidebar">
            <div className="contact-info-card">
              <h2 className="contact-info-card__title">Cara Berkontribusi</h2>
              <ul className="contact-info-list">
                <li className="contact-info-item"><span>1.</span><span>Daftar akun dan verifikasi email untuk menjadi Kontributor.</span></li>
                <li className="contact-info-item"><span>2.</span><span>Isi nama budaya, provinsi, kategori, dan deskripsi dengan lengkap.</span></li>
                <li className="contact-info-item"><span>3.</span><span>Unggah foto dokumentasi (maks. 5 foto, JPG/PNG/WebP, &lt; 5 MB).</span></li>
                <li className="contact-info-item"><span>4.</span><span>Pantau hasil verifikasi admin pada halaman profil Anda.</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
