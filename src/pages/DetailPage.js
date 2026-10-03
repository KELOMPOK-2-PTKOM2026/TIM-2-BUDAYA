import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cultures, detailCulture } from '../data/Mock';
import '../styles/DetailPage.css';

export default function DetailPage() {
  const { slug } = useParams();
  const [bookmarked, setBookmarked] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [activeModalImage, setActiveModalImage] = useState(null);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const culture = cultures.find((c) => c.slug === slug);

  const showToast = (message) => {
    setToastMsg(message);
    setTimeout(() => {
      setToastMsg(null);
    }, 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: culture?.title || 'JelajahSumatera',
          text: culture?.desc || 'Jelajahi kekayaan warisan budaya Sumatera di JelajahSumatera.',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan berhasil disalin ke clipboard!');
    }
  };

  const handleBookmark = () => {
    const nextState = !bookmarked;
    setBookmarked(nextState);
    showToast(nextState ? 'Tersimpan ke daftar bookmark!' : 'Dihapus dari bookmark.');
  };

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

  // Use detail data for Tari Saman or fallback gracefully
  const isSaman = slug === 'tari-saman';
  const detail = isSaman ? detailCulture : null;

  // Title: Tari Saman Gayo or culture.title
  const pageTitle = isSaman ? 'Tari Saman Gayo' : culture.title;
  const regionTag = culture.region || (culture.province === 'Aceh' ? 'Nanggroe Aceh Darussalam' : culture.province);
  const categoryTag = isSaman ? 'Seni Pertunjukan' : culture.category;

  // Helper to determine dummy image for category if needed
  const getDummyCategory = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('tari')) return '/images/dummy-tarian.svg';
    if (c.includes('kuliner')) return '/images/dummy-kuliner.svg';
    if (c.includes('musik')) return '/images/dummy-musik.svg';
    if (c.includes('upacara')) return '/images/dummy-upacara.svg';
    if (c.includes('kerajinan') || c.includes('kriya')) return '/images/dummy-kerajinan.svg';
    return '/images/dummy-budaya.svg';
  };

  const defaultDummy = getDummyCategory(culture.category);

  // Gallery: 4 images, ensuring we NEVER reuse Tari Saman's photos for other cultures
  const galleryImages = detail?.gallery || [
    { src: culture.image, alt: `${pageTitle} - Dokumentasi Utama` },
    { src: defaultDummy, alt: `${pageTitle} - Arsip Dokumentasi 2 (Dalam Kurasi)` },
    { src: defaultDummy, alt: `${pageTitle} - Arsip Dokumentasi 3 (Dalam Kurasi)` },
    { src: defaultDummy, alt: `${pageTitle} - Arsip Dokumentasi 4 (Dalam Kurasi)` },
  ];

  // Facts for the sidebar
  const factsList = detail?.facts || [
    {
      title: 'Asal Daerah',
      desc: `Warisan budaya luhur dari ${culture.province}`,
    },
    {
      title: 'Kategori Warisan',
      desc: `Terdaftar dalam ragam khazanah ${culture.category} kepulauan Sumatra`,
    },
    {
      title: 'Karakteristik Unik',
      desc: culture.desc,
    },
    {
      title: 'Status Dokumentasi',
      desc: 'Terverifikasi dalam Arsip Pustaka Digital Kebudayaan Sumatra',
    },
  ];

  // Related heritage cards: 3 cards
  const relatedItems = detail?.heritage || cultures
    .filter((c) => c.slug !== slug && (c.province === culture.province || c.category === culture.category))
    .slice(0, 3);

  return (
    <div className="detail-page">
      {/* ============ BREADCRUMB & ACTION BAR ============ */}
      <div className="detail-topbar">
        <div className="container-wide">
          <div className="detail-topbar__inner">
            <nav className="detail-breadcrumb" aria-label="Breadcrumb">
              <Link to="/" className="detail-breadcrumb__link">
                Beranda
              </Link>
              <span className="detail-breadcrumb__sep">›</span>
              <Link to="/eksplorasi" className="detail-breadcrumb__link">
                Eksplorasi
              </Link>
              <span className="detail-breadcrumb__sep">›</span>
              <span className="detail-breadcrumb__active">
                {isSaman ? 'Tari Saman' : culture.title}
              </span>
            </nav>

            <div className="detail-actions">
              <button
                type="button"
                className="detail-action-btn"
                onClick={handleShare}
                aria-label="Bagikan Halaman"
                title="Bagikan"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </button>

              <button
                type="button"
                className={`detail-action-btn ${bookmarked ? 'detail-action-btn--active' : ''}`}
                onClick={handleBookmark}
                aria-label="Simpan ke Bookmark"
                title={bookmarked ? 'Tersimpan' : 'Simpan'}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill={bookmarked ? '#c4542e' : 'none'}
                  stroke={bookmarked ? '#c4542e' : 'currentColor'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ CONTAINED HERO IMAGE BANNER ============ */}
      <section className="detail-hero-section">
        <div className="container-wide">
          <div className="detail-banner-card">
            <img
              src={detail?.heroImage || culture.image}
              alt={pageTitle}
              className="detail-banner-card__img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultDummy;
              }}
            />
          </div>
        </div>
      </section>

      {/* ============ MAIN TWO-COLUMN CONTENT ============ */}
      <section className="detail-main-section">
        <div className="container-wide">
          <div className="detail-layout-grid">
            {/* LEFT COLUMN: Narrative & Gallery */}
            <div className="detail-content-col">
              {/* Badges row */}
              <div className="detail-tags-row">
                <span className="detail-pill detail-pill--primary">
                  {regionTag}
                </span>
                <span className="detail-pill detail-pill--secondary">
                  {categoryTag}
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="detail-title">{pageTitle}</h1>

              {/* Story / Description Paragraphs */}
              <div className="detail-narrative">
                <p>
                  {detail?.description || culture.desc}
                </p>
                <p>
                  {detail?.longDescription ||
                    `Keunikan budaya ${culture.title} memancarkan nilai kearifan lokal masyarakat ${culture.province} yang telah dipelihara selama ratusan tahun secara turun-temurun, menjadi bagian integral dari mozaik kebudayaan agung kepulauan Sumatera.`}
                </p>
              </div>

              {/* Galeri Visual Tradisi */}
              <div className="detail-gallery-block">
                <h2 className="detail-gallery-title">Galeri Visual Tradisi</h2>
                <div className="detail-gallery-grid">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="detail-gallery-card"
                      onClick={() => setActiveModalImage(img.src)}
                      title="Klik untuk memperbesar foto"
                    >
                      <img
                        src={img.src}
                        alt={img.alt || `${pageTitle} ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = defaultDummy;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Fakta Menarik Sidebar */}
            <aside className="detail-sidebar-col">
              <div className="detail-facts-card">
                <h3 className="detail-facts-title">Fakta Menarik</h3>
                <div className="detail-facts-list">
                  {factsList.map((fact, idx) => (
                    <div className="detail-fact-item" key={idx}>
                      <div className="detail-fact-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e59a28" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <div className="detail-fact-body">
                        <h4 className="detail-fact-headline">{fact.title}</h4>
                        <p className="detail-fact-caption">{fact.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ============ WARISAN TERKAIT SECTION ============ */}
      <section className="detail-related-section">
        <div className="container-wide">
          <h2 className="detail-related-title">Warisan Terkait</h2>
          <div className="detail-related-grid">
            {relatedItems.map((item) => (
              <article className="detail-related-card" key={item.id || item.slug}>
                <Link to={`/budaya/${item.slug}`} className="detail-related-card__media">
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/dummy-budaya.svg';
                    }}
                  />
                </Link>
                <div className="detail-related-card__body">
                  <div className="detail-related-card__tags">
                    <span className="tag-pill tag-pill--prov">{item.province}</span>
                    <span className="tag-pill tag-pill--cat">{item.category}</span>
                  </div>
                  <h3 className="detail-related-card__heading">
                    <Link to={`/budaya/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="detail-related-card__desc">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="detail-toast-alert" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeModalImage && (
        <div className="detail-lightbox-overlay" onClick={() => setActiveModalImage(null)}>
          <div className="detail-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <img src={activeModalImage} alt="Perbesar Gambar Tradisi" />
            <button
              type="button"
              className="detail-lightbox-close"
              onClick={() => setActiveModalImage(null)}
              aria-label="Tutup"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
