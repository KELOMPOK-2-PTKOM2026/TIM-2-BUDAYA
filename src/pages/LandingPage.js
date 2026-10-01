import { Link } from 'react-router-dom';
import { provinces, features, cultures, articles, testimonials, heroImage } from '../data/Mock';
import '../styles/LandingPage.css';

const iconMap = {
  Compass: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  Users: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  BadgeCheck: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

export default function LandingPage() {
  const featuredCultures = cultures.filter((c) => c.featured);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="hero-section">
        <div className="container-wide">
          <div className="hero-wrapper grain-overlay">
            <img src={heroImage} alt="Danau Toba" className="hero-img" />
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="hero-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Warisan Budaya Sumatera</span>
              </div>
              <h1 className="hero-title">
                Jelajahi Kekayaan <em>Budaya</em> Sumatera
              </h1>
              <p className="hero-desc">
                Temukan pesona tarian, kuliner, kain tenun, dan rumah adat dari 10 provinsi di Sumatera. Satu platform, ribuan cerita warisan nusantara.
              </p>
              <div className="hero-actions">
                <Link to="/eksplorasi" className="btn-primary hero-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                  Mulai Eksplorasi
                </Link>
                <a href="#tentang" className="hero-btn-ghost" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  Tentang Kami
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="features-section">
        <div className="container-wide">
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card card-lift" key={f.title}>
                <div className="feature-icon">{iconMap[f.icon]}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROVINSI ============ */}
      <section className="provinsi-section">
        <div className="container-wide">
          <div className="section-header">
            <span className="section-eyebrow">Provinsi</span>
            <h2 className="section-title">Jelajahi per Provinsi</h2>
          </div>
          <div className="provinsi-grid">
            {provinces.map((p) => (
              <Link to={`/eksplorasi?province=${p.slug}`} className="provinsi-card" key={p.id}>
                <div className="provinsi-media img-zoom">
                  <img src={p.image} alt={p.name} />
                  <span className="provinsi-count">{p.count} entri</span>
                  <div className="provinsi-caption">
                    <div className="provinsi-tag">{p.tag}</div>
                    <div className="provinsi-name">{p.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED HERITAGE ============ */}
      <section className="featured-section">
        <div className="container-wide">
          <div className="featured-header">
            <div>
              <span className="section-eyebrow">Sorotan</span>
              <h2 className="section-title">Warisan Pilihan</h2>
            </div>
            <Link to="/eksplorasi" style={{ color: '#C4542E', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none' }}>
              Lihat Semua &rarr;
            </Link>
          </div>
          <div className="featured-grid">
            {featuredCultures.map((c) => (
              <Link to={`/budaya/${c.slug}`} className="featured-card" key={c.id}>
                <div className="featured-media img-zoom">
                  <img src={c.image} alt={c.title} />
                </div>
                <div className="featured-meta">
                  <span className="pill-category">{c.category}</span>
                  <span className="featured-meta-province">{c.province}</span>
                </div>
                <h3 className="featured-title">{c.title}</h3>
                <p className="featured-desc">{c.desc}</p>
                <span className="featured-cta">Baca Selengkapnya &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ARTIKEL ============ */}
      <section className="artikel-section">
        <div className="container-wide">
          <div className="section-header">
            <span className="section-eyebrow">Artikel</span>
            <h2 className="section-title">Cerita &amp; Tulisan</h2>
          </div>
          <div className="artikel-grid">
            {articles.map((a) => (
              <div className="artikel-card" key={a.id}>
                <div className="artikel-media img-zoom">
                  <img src={a.image} alt={a.title} />
                </div>
                <div className="artikel-date">{a.date}</div>
                <h3 className="artikel-title">{a.title}</h3>
                <p className="artikel-excerpt">{a.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="testimonial-section">
        <div className="container-wide">
          <div className="section-header">
            <span className="section-eyebrow">Testimoni</span>
            <h2 className="section-title">Apa Kata Mereka</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.id}>
                <svg className="testimonial-quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta-section">
        <div className="container-wide">
          <div className="cta-box grain-overlay">
            <div className="cta-inner">
              <div className="cta-text">
                <span className="cta-eyebrow">Bergabunglah</span>
                <h2 className="cta-title">Jadi Bagian dari Pelestarian Budaya</h2>
                <p className="cta-desc">
                  Bantu kami mendokumentasikan dan melestarikan warisan budaya Sumatera untuk generasi mendatang.
                </p>
              </div>
              <Link to="/eksplorasi" className="btn-primary cta-btn" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                Mulai Berkontribusi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
