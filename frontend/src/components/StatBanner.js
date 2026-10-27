import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/StatBanner.css';

const steps = [
  {
    number: '01',
    stepLabel: 'Langkah 1',
    title: 'Buat Akun',
    desc: 'Daftar sebagai kontributor untuk mulai mendokumentasikan warisan budaya daerah Anda.',
    link: '/daftar',
    linkText: 'Daftar Sekarang',
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    number: '02',
    stepLabel: 'Langkah 2',
    title: 'Tulis Usulan',
    desc: 'Lengkapi narasi tradisi, pilih provinsi dan kategori, serta unggah dokumentasi foto pendukung.',
    link: '/kontribusi',
    linkText: 'Mulai Usulan',
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    number: '03',
    stepLabel: 'Langkah 3',
    title: 'Proses Kurasi',
    desc: 'Tim kurator dan verifikator memeriksa kelayakan, keaslian data, dan keakuratan literatur.',
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    number: '04',
    stepLabel: 'Langkah 4',
    title: 'Publikasi',
    desc: 'Usulan yang disetujui terbit di katalog resmi dan dapat dijelajahi publik nusantara.',
    link: '/eksplorasi',
    linkText: 'Lihat Katalog',
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function StatBanner() {
  return (
    <section className="stat-banner" aria-label="Cara Berkontribusi">
      <div className="container-wide">
        <div className="stat-banner__header">
          <span className="stat-banner__eyebrow">PANDUAN KOMUNITAS</span>
          <h2 className="stat-banner__title">Cara Berkontribusi</h2>
          <p className="stat-banner__subtitle">
            Empat langkah mudah bagi masyarakat untuk ikut serta mendokumentasikan dan melestarikan warisan budaya Sumatra.
          </p>
        </div>

        <div className="stat-banner__grid">
          {steps.map((item) => (
            <div className="stat-banner__card" key={item.number}>
              <div className="stat-banner__card-header">
                <span className="stat-banner__step-number">{item.number}</span>
                <div className="stat-banner__icon-wrap">
                  {item.icon}
                </div>
              </div>

              <span className="stat-banner__step-badge">{item.stepLabel}</span>
              <h3 className="stat-banner__card-title">{item.title}</h3>
              <p className="stat-banner__card-desc">{item.desc}</p>

              {item.link && (
                <Link to={item.link} className="stat-banner__card-link">
                  {item.linkText} <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { StatBanner as CaraBerkontribusi };
