import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
// Hapus `editorialPicks` dari Mock, tetap gunakan variabel mock untuk aset statis jika ada.
import { provinces, features, songketPattern } from '../data/Mock';
import Hero from '../components/Hero'; // Komponen Carousel Hero
import '../styles/LandingPage.css';

const STORAGE_URL = process.env.REACT_APP_STORAGE_URL || 'http://localhost:8000/storage/';

// Custom icons matching the 3 feature cards in the screenshot
const featureIconMap = {
  Museum: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16594C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V10" />
      <path d="M19 21V10" />
      <path d="M9 21V10" />
      <path d="M14 21V10" />
      <path d="M2 10h20" />
      <path d="m12 2 10 5H2z" />
    </svg>
  ),
  Users: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16594C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ShieldCheck: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16594C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

export default function LandingPage() {
  const [featuredCultures, setFeaturedCultures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/cultures', { params: { featured: 1, per_page: 6 } });
        // Ambil array dari property pagination data.data
        setFeaturedCultures(response.data.data);
      } catch (error) {
        console.error('Gagal memuat budaya pilihan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/dummy-budaya.svg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/images/')) return imagePath;
    return `${STORAGE_URL}${imagePath}`;
  };

  return (
    <div className="landing-page">
      {/* ================= HERO CAROUSEL SECTION ================= */}
      <Hero />

      {/* ================= 3 VALUE CARDS ================= */}
      <section className="value-props">
        <div className="container-wide">
          <div className="value-props__grid">
            {features.map((item) => (
              <div className="value-card" key={item.title}>
                <div className="value-card__icon">
                  {featureIconMap[item.icon] || featureIconMap.Museum}
                </div>
                <h3 className="value-card__title">{item.title}</h3>
                <p className="value-card__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EKSPLORASI PER PROVINSI ================= */}
      <section className="provinces-section">
        <div className="container-wide">
          <div className="section-heading text-center">
            <span className="section-eyebrow">Peta Budaya</span>
            <h2 className="section-title">Eksplorasi Per Provinsi</h2>
          </div>

          <div className="provinces-grid">
            {provinces.map((prov) => (
              <Link
                to={`/eksplorasi?province=${prov.slug}`}
                className="province-card"
                key={prov.id}
              >
                <div className="province-card__image-wrap">
                  <img
                    src={prov.image}
                    alt={prov.name}
                    className="province-card__img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/dummy-budaya.svg';
                    }}
                  />
                  <div className="province-card__overlay" />
                  <span className="province-card__badge">{prov.count} Budaya</span>
                  <div className="province-card__caption">
                    <h3 className="province-card__name">{prov.name}</h3>
                    <span className="province-card__link">
                      Lihat Budaya &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WARISAN AGUNG SUMATRA PILIHAN REDAKSI ================= */}
      <section id="tentang" className="editorial-section">
        <div className="container-wide">
          <div className="editorial-header">
            <div>
              <span className="section-eyebrow">SOROTAN UTAMA</span>
              <h2 className="section-title">Warisan Agung Sumatra Pilihan Redaksi</h2>
            </div>
            <Link to="/eksplorasi" className="editorial-btn-outline">
              Semua Warisan Budaya
            </Link>
          </div>

          {loading ? (
            <div className="editorial-grid" aria-busy="true" aria-label="Memuat sorotan budaya">
              {Array.from({ length: 3 }).map((_, idx) => (
                <article className="editorial-card skeleton-card" key={idx}>
                  <div className="editorial-card__image-wrap skeleton" />
                  <div className="editorial-card__tags">
                    <span className="skeleton skeleton-tag" />
                    <span className="skeleton skeleton-tag" />
                  </div>
                  <div className="skeleton skeleton-text skeleton-text--title" />
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text skeleton-text--short" />
                  <div className="skeleton skeleton-tag" style={{ marginTop: '0.85rem', width: '100px' }} />
                </article>
              ))}
            </div>
          ) : (
            <div className="editorial-grid">
              {featuredCultures.map((item) => (
                <article className="editorial-card" key={item.id}>
                  <Link to={`/budaya/${item.slug}`} className="editorial-card__media-link">
                    <div className="editorial-card__image-wrap">
                      <img src={getImageUrl(item.image)} alt={item.title} className="editorial-card__img" />
                    </div>
                  </Link>

                  <div className="editorial-card__tags">
                    {/* Menggunakan relasi province dan category dari backend */}
                    <span className="tag-province">{item.province?.name.toUpperCase()}</span>
                    <span className="tag-category">{item.category?.name.toUpperCase()}</span>
                  </div>

                  <h3 className="editorial-card__title">
                    <Link to={`/budaya/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="editorial-card__desc line-clamp-3">{item.desc}</p>
                  
                  <Link to={`/budaya/${item.slug}`} className="editorial-card__cta">
                    Pelajari Lebih Lanjut &rarr;
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= BANNER CTA PENGETAHUAN BUDAYA ================= */}
      <section className="cta-banner-section">
        <div className="container-wide">
          <div
            className="cta-banner"
            style={{
              backgroundImage: `linear-gradient(rgba(13, 36, 29, 0.88), rgba(13, 36, 29, 0.88)), url(${songketPattern})`,
            }}
          >
            <div className="cta-banner__content">
              <h2 className="cta-banner__title">Punya Pengetahuan Budaya Setempat?</h2>
              <p className="cta-banner__desc">
                Bantu kami memperluas peta warisan budaya Sumatera. Ajukan tulisan, foto, atau video tradisi unik di sekitar Anda untuk diverifikasi oleh tim kami.
              </p>
            </div>
            <div className="cta-banner__action">
              <Link to="/kontribusi" className="cta-banner__btn">
                Ajukan Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
