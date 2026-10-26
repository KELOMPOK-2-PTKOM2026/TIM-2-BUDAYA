import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { getApiErrorMessage } from '../lib/errors';
import { resolveImageUrl, getCultureGallery, handleImageError } from '../lib/media';
import '../styles/DetailPage.css';

// Pisahkan "Nama Sumber (https://...)" menjadi teks dan tautan agar URL bisa diklik
function parseSource(source) {
  const match = source.match(/https?:\/\/[^\s)]+/);
  return match ? { text: source.replace(match[0], '').replace(/\(\s*\)/, '').trim(), url: match[0] } : { text: source, url: null };
}

export default function DetailPage() {
  const { slug } = useParams();
  
  // States
  const [culture, setCulture] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [bookmarked, setBookmarked] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [activeModalImage, setActiveModalImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/cultures/${slug}`);
        setCulture(response.data.data);
        setRelatedItems(response.data.related);
      } catch (err) {
        console.error('Fetch detail error:', err);
        setError(err.response?.status === 404 ? 'NotFound' : getApiErrorMessage(err, 'Gagal memuat detail budaya.'));
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 2500); };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: culture?.title || 'JelajahSumatera',
        text: culture?.desc || 'Jelajahi kekayaan warisan budaya Sumatera di JelajahSumatera.',
        url: window.location.href,
      }).catch(() => {});
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
  
  if (loading) {
    return (
      <div className="detail-page" aria-busy="true" aria-label="Memuat detail budaya">
        <div className="detail-topbar">
          <div className="container-wide">
            <div className="detail-topbar__inner">
              <div className="skeleton" style={{ width: '220px', height: '18px' }} />
              <div className="detail-actions">
                <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
              </div>
            </div>
          </div>
        </div>

        <section className="detail-hero-section">
          <div className="container-wide">
            <div className="detail-banner-card skeleton" />
          </div>
        </section>

        <section className="detail-main-section">
          <div className="container-wide">
            <div className="detail-layout-grid">
              <div className="detail-content-col">
                <div className="detail-tags-row">
                  <div className="skeleton skeleton-tag" style={{ width: '80px', height: '24px', borderRadius: '9999px' }} />
                  <div className="skeleton skeleton-tag" style={{ width: '90px', height: '24px', borderRadius: '9999px' }} />
                </div>
                <div className="skeleton skeleton-text" style={{ width: '60%', height: '36px', marginBottom: '24px' }} />
                <div className="skeleton skeleton-text" style={{ height: '16px', marginBottom: '12px' }} />
                <div className="skeleton skeleton-text" style={{ height: '16px', marginBottom: '12px' }} />
                <div className="skeleton skeleton-text" style={{ height: '16px', marginBottom: '12px', width: '85%' }} />
                <div className="skeleton skeleton-text" style={{ height: '16px', marginBottom: '12px', width: '70%' }} />

                <div className="detail-gallery-block" style={{ marginTop: '40px' }}>
                  <div className="skeleton skeleton-text" style={{ width: '180px', height: '22px', marginBottom: '16px' }} />
                  <div className="detail-gallery-grid">
                    <div className="detail-gallery-card skeleton" style={{ height: '140px' }} />
                    <div className="detail-gallery-card skeleton" style={{ height: '140px' }} />
                    <div className="detail-gallery-card skeleton" style={{ height: '140px' }} />
                  </div>
                </div>
              </div>

              <aside className="detail-sidebar-col">
                <div className="detail-facts-card">
                  <div className="skeleton skeleton-text" style={{ width: '120px', height: '20px', marginBottom: '20px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="skeleton" style={{ height: '48px' }} />
                    <div className="skeleton" style={{ height: '48px' }} />
                    <div className="skeleton" style={{ height: '48px' }} />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error && error !== 'NotFound') {
    return (
      <div className="detail-page">
        <div className="container-wide">
          <div className="detail-not-found">
            <h1 style={{ fontSize: '40px' }}>Gagal Memuat</h1>
            <p>{error}</p>
            <button type="button" className="detail-back-button" onClick={() => window.location.reload()} style={{ border: 'none', cursor: 'pointer' }}>
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error === 'NotFound' || (!culture && !loading)) {
    return (
      <div className="detail-page">
        <div className="container-wide">
          <div className="detail-not-found">
            <h1>404</h1>
            <p>Budaya yang Anda cari tidak ditemukan.</p>
            <Link to="/eksplorasi" className="detail-back-button">Kembali ke Eksplorasi</Link>
          </div>
        </div>
      </div>
    );
  }

  // Gunakan data relasi dan field langsung dari DB
  const pageTitle = culture.title;
  const regionTag = culture.province?.name;
  const categoryTag = culture.category?.name;
  const mainImage = resolveImageUrl(culture.image, culture.category);
  const onImageError = handleImageError(culture.category);

  // Galeri hanya berisi foto asli dari kolom `image` + `images`; tidak ada gambar dummy pengisi
  const galleryImages = getCultureGallery(culture).map((src, idx) => ({
    src,
    alt: `${pageTitle} - Foto ${idx + 1}`,
  }));
  const facts = Array.isArray(culture.facts) ? culture.facts.filter(Boolean) : [];
  const historyParagraphs = (culture.history || '').split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const source = culture.source ? parseSource(culture.source) : null;

  return (
    <div className="detail-page">
      {/* ============ BREADCRUMB ============ */}
      <div className="detail-topbar">
        <div className="container-wide">
          <div className="detail-topbar__inner">
            <nav className="detail-breadcrumb">
              <Link to="/" className="detail-breadcrumb__link">Beranda</Link> <span className="detail-breadcrumb__sep">›</span> <Link to="/eksplorasi" className="detail-breadcrumb__link">Eksplorasi</Link> <span className="detail-breadcrumb__sep">›</span> <span className="detail-breadcrumb__active">{pageTitle}</span>
            </nav>

            <div className="detail-actions">
              <button type="button" className="detail-action-btn" onClick={handleShare} title="Bagikan">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
              </button>
              <button type="button" className={`detail-action-btn ${bookmarked ? 'detail-action-btn--active' : ''}`} onClick={handleBookmark} title={bookmarked ? 'Tersimpan' : 'Simpan'}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill={bookmarked ? '#c4542e' : 'none'} stroke={bookmarked ? '#c4542e' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="detail-hero-section">
        <div className="container-wide">
          <div className="detail-banner-card">
            <img src={mainImage} alt={pageTitle} className="detail-banner-card__img" onError={onImageError} />
          </div>
        </div>
      </section>

      <section className="detail-main-section">
        <div className="container-wide">
          <div className="detail-layout-grid">
            
            <div className="detail-content-col">
              <div className="detail-tags-row">
                <span className="detail-pill detail-pill--primary">{regionTag}</span>
                <span className="detail-pill detail-pill--secondary">{categoryTag}</span>
              </div>
              <h1 className="detail-title">{pageTitle}</h1>
              <div className="detail-narrative">
                <p>{culture.desc}</p>
              </div>

              {historyParagraphs.length > 0 && (
                <div className="detail-gallery-block">
                  <h2 className="detail-gallery-title">Sejarah &amp; Asal-usul</h2>
                  <div className="detail-narrative">
                    {historyParagraphs.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery List */}
              <div className="detail-gallery-block">
                <h2 className="detail-gallery-title">Galeri Visual Tradisi</h2>
                {galleryImages.length > 0 ? (
                  <div className="detail-gallery-grid">
                    {galleryImages.map((img) => (
                      <button
                        type="button"
                        key={img.src}
                        className="detail-gallery-card"
                        onClick={() => setActiveModalImage(img.src)}
                        aria-label={`Perbesar ${img.alt}`}
                        style={{ border: 'none', padding: 0 }}
                      >
                        <img src={img.src} alt={img.alt} loading="lazy" onError={onImageError} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="detail-gallery-empty">
                    Belum ada foto dokumentasi untuk budaya ini. Punya foto?{' '}
                    <Link to="/kontribusi">Bantu lengkapi lewat halaman Kontribusi</Link>.
                  </p>
                )}
              </div>

              {source && (
                <div className="detail-source">
                  <span className="detail-source__label">Sumber Rujukan</span>
                  <p className="detail-source__text">
                    {source.text}
                    {source.url && (
                      <>
                        {source.text && ' — '}
                        <a href={source.url} target="_blank" rel="noreferrer noopener">
                          {source.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                        </a>
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar Fakta */}
            <aside className="detail-sidebar-col">
              <div className="detail-facts-card">
                <h3 className="detail-facts-title">Fakta Menarik</h3>
                <div className="detail-facts-list">
                  {[
                    { headline: 'Asal Daerah', caption: `Warisan budaya dari ${regionTag}` },
                    { headline: 'Kategori', caption: categoryTag },
                    ...facts.map((fact, idx) => ({ headline: `Fakta ${idx + 1}`, caption: fact })),
                  ]
                    .filter((item) => item.caption)
                    .map((item) => (
                      <div className="detail-fact-item" key={item.headline}>
                        <div className="detail-fact-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e59a28" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        </div>
                        <div className="detail-fact-body">
                          <h4 className="detail-fact-headline">{item.headline}</h4>
                          <p className="detail-fact-caption">{item.caption}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ============ WARISAN TERKAIT (DARI DATABASE) ============ */}
      {relatedItems && relatedItems.length > 0 && (
        <section className="detail-related-section">
          <div className="container-wide">
            <h2 className="detail-related-title">Warisan Terkait</h2>
            <div className="detail-related-grid">
              {relatedItems.map((item) => (
                <article className="detail-related-card" key={item.id}>
                  <Link to={`/budaya/${item.slug}`} className="detail-related-card__media">
                    <img
                      src={resolveImageUrl(item.image, item.category)}
                      alt={item.title}
                      loading="lazy"
                      onError={handleImageError(item.category)}
                    />
                  </Link>
                  <div className="detail-related-card__body">
                    <div className="detail-related-card__tags">
                      <span className="tag-pill tag-pill--prov">{item.province?.name}</span>
                    </div>
                    <h3 className="detail-related-card__heading">
                      <Link to={`/budaya/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <p className="detail-related-card__desc line-clamp-2">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Toast & Lightbox */}
      {toastMsg && <div className="detail-toast-alert">{toastMsg}</div>}
      
      {activeModalImage && (
        <div className="detail-lightbox-overlay" onClick={() => setActiveModalImage(null)}>
          <div className="detail-lightbox-modal">
            <img src={activeModalImage} alt="Perbesar" />
            <button className="detail-lightbox-close" onClick={() => setActiveModalImage(null)}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
}
