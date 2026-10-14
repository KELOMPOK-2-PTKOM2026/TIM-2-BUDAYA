import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertModal from '../components/AlertModal';
import '../styles/ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Koreksi / Saran Akurasi Konten',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    eyebrow: '',
    message: '',
    confirmText: 'Saya Mengerti',
  });

  const showAlert = (config) => {
    setModalConfig({
      isOpen: true,
      type: config.type || 'warning',
      title: config.title || 'Perhatian',
      eyebrow: config.eyebrow || 'Perhatian',
      message: config.message,
      confirmText: config.confirmText || 'Saya Mengerti',
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Kontak & Masukan Budaya — JelajahSumatera';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showAlert({
        type: 'warning',
        eyebrow: 'Kelengkapan Formulir',
        title: 'Formulir Belum Lengkap',
        message: 'Mohon lengkapi seluruh formulir (nama, email, dan pesan) sebelum mengirim masukan Anda.',
        confirmText: 'Lengkapi Data',
      });
      return;
    }

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: 'Koreksi / Saran Akurasi Konten',
      message: '',
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <div className="contact-page">
      <div className="container-wide">
        {/* ================= BREADCRUMB ================= */}
        <nav className="contact-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="contact-breadcrumb__link">
            Beranda
          </Link>
          <span className="contact-breadcrumb__separator">&rsaquo;</span>
          <span className="contact-breadcrumb__current">Kontak</span>
        </nav>

        {/* ================= MAIN CONTENT ================= */}
        <div className="contact-layout">
          {/* Left Form Card */}
          <div className="contact-form-card">
            <h1 className="contact-form-card__title">
              Kirim Pesan atau Masukan Budaya
            </h1>

            {submitted && (
              <div className="contact-form__success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>
                  Terima kasih! Pesan dan masukan budaya Anda telah terkirim kepada dewan kurator JelajahSumatera.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              {/* Nama Lengkap */}
              <div className="contact-form__group">
                <label htmlFor="contact-name" className="contact-form__label">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="cth. Budi Siregar"
                  required
                  className="contact-form__input"
                />
              </div>

              {/* Email Aktif */}
              <div className="contact-form__group">
                <label htmlFor="contact-email" className="contact-form__label">
                  Email Aktif
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="cth. budi@email.com"
                  required
                  className="contact-form__input"
                />
              </div>

              {/* Subjek Hubungan */}
              <div className="contact-form__group">
                <label htmlFor="contact-subject" className="contact-form__label">
                  Subjek Hubungan
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="contact-form__select"
                >
                  <option value="Koreksi / Saran Akurasi Konten">
                    Koreksi / Saran Akurasi Konten
                  </option>
                  <option value="Pengajuan Dokumentasi Budaya Baru">
                    Pengajuan Dokumentasi Budaya Baru
                  </option>
                  <option value="Kerjasama & Kemitraan Komunitas">
                    Kerjasama & Kemitraan Komunitas
                  </option>
                  <option value="Pertanyaan Umum & Informasi">
                    Pertanyaan Umum & Informasi
                  </option>
                </select>
              </div>

              {/* Pesan atau Catatan Detail */}
              <div className="contact-form__group">
                <label htmlFor="contact-message" className="contact-form__label">
                  Pesan atau Catatan Detail
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tuliskan koreksi atau saran rincian adat di sini..."
                  required
                  className="contact-form__textarea"
                />
              </div>

              {/* Tombol Kirim */}
              <button type="submit" className="contact-form__btn-submit">
                Kirim Masukan
              </button>
            </form>
          </div>

          {/* Right Sidebar */}
          <aside className="contact-sidebar">
            {/* Card: Hubungi Kami */}
            <div className="contact-info-card">
              <h2 className="contact-info-card__title">
                Hubungi Kami
              </h2>

              <ul className="contact-info-list">
                <li className="contact-info-item">
                  <svg className="contact-info-item__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>
                    Jl. Jenderal Sudirman No. 45, Padang, Sumatera Barat
                  </span>
                </li>

                <li className="contact-info-item">
                  <svg className="contact-info-item__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <a href="mailto:kontak@jelajahsumatera.id" className="contact-info-item__link">
                    kontak@jelajahsumatera.id
                  </a>
                </li>

                <li className="contact-info-item">
                  <svg className="contact-info-item__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href="tel:+6275112345678" className="contact-info-item__link">
                    +62 751 1234 5678
                  </a>
                </li>
              </ul>
            </div>

            {/* Card: Peta Lokasi Kami */}
            <div className="contact-map-card">
              <img
                src="/images/sumatra-vintage-map.jpg"
                alt="Peta Lokasi Kami - JelajahSumatera"
                className="contact-map-card__img"
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Editorial Custom Alert Modal */}
      <AlertModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        type={modalConfig.type}
        title={modalConfig.title}
        eyebrow={modalConfig.eyebrow}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
      />
    </div>
  );
}
