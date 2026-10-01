import { useParams, Link } from 'react-router-dom';
import { cultures, detailCulture } from '../data/Mock';
import '../styles/DetailPage.css';

export default function DetailPage() {
  const { slug } = useParams();
  const culture = cultures.find((c) => c.slug === slug);

  if (!culture) {
    return (
      <div className="detail-page">
        <div className="container-wide">
          <div className="detail-not-found">
            <h1>404</h1>
            <p>Budaya yang Anda cari tidak ditemukan.</p>
            <Link to="/eksplorasi" className="detail-back-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Kembali ke Eksplorasi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Use detailed data if available, otherwise use basic culture data
  const detail = detailCulture.slug === slug ? detailCulture : null;

  return (
    <div className="detail-page">
      {/* ============ HERO ============ */}
      <section className="detail-hero">
        <img src={detail?.heroImage || culture.image} alt={culture.title} className="detail-hero__image" />
        <div className="detail-hero__overlay" />
        <div className="container-wide" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
          <div className="detail-hero__content">
            <div>
              <Link to="/eksplorasi" className="detail-back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Kembali
              </Link>
            </div>
            <div className="detail-hero__text">
              <span className="detail-category">{detail?.category || culture.category}</span>
              <h1>{culture.title}</h1>
              <div className="detail-location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {culture.province}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <div className="detail-content">
        <div className="container-wide">
          <div className="detail-intro">
            <div>
              <span className="detail-label">Tentang Budaya</span>
              <h2>{culture.title}</h2>
              <p className="detail-description">
                {detail?.description || culture.desc}
              </p>
              {detail?.longDescription && (
                <>
                  <h3>Sejarah &amp; Filosofi</h3>
                  <p className="detail-description">{detail.longDescription}</p>
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              <div className="detail-info-card">
                {detail?.facts ? (
                  detail.facts.map((fact) => (
                    <div className="detail-info-item" key={fact.label}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <div>
                        <span>{fact.label}</span>
                        <strong>{fact.value}</strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="detail-info-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <div>
                        <span>Asal Daerah</span>
                        <strong>{culture.province}</strong>
                      </div>
                    </div>
                    <div className="detail-info-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                      <div>
                        <span>Kategori</span>
                        <strong>{culture.category}</strong>
                      </div>
                    </div>
                  </>
                )}
                <button className="detail-share">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Bagikan
                </button>
              </div>
            </aside>
          </div>

          {/* ============ GALLERY ============ */}
          {detail?.gallery && (
            <div className="detail-section">
              <span className="detail-label">Galeri</span>
              <h2>Galeri Visual</h2>
              <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {detail.gallery.map((img, i) => (
                  <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '4/3' }}>
                    <img src={img} alt={`${culture.title} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ HERITAGE ============ */}
          {detail?.heritage && (
            <div className="detail-section">
              <span className="detail-label">Warisan Terkait</span>
              <h2>Jelajahi Lebih Lanjut</h2>
              <div className="detail-grid">
                {detail.heritage.map((h) => (
                  <div className="detail-grid-item" key={h.title} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', aspectRatio: '16/10' }}>
                      <img src={h.image} alt={h.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <span>{h.title}</span>
                      <p>{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ CTA ============ */}
          <div className="detail-cta">
            <div>
              <span className="detail-label">Ingin Tahu Lebih?</span>
              <h2>Jelajahi Budaya Lainnya</h2>
              <p>Temukan lebih banyak warisan budaya Sumatera yang menakjubkan.</p>
            </div>
            <Link to="/eksplorasi" className="detail-cta__button">
              Eksplorasi Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
