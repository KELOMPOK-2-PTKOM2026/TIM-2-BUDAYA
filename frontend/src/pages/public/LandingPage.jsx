import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, Users, BadgeCheck, ArrowRight, PlayCircle, Sparkles } from 'lucide-react';
import { provinces, features, cultures, articles, heroImage } from '../data/mock';
import './LandingPage.css';

const iconMap = { Compass, Users, BadgeCheck };

const LandingPage = () => {
  const featured = cultures.filter((c) => c.featured);

  return (
    <div>
      {/* HERO */}
      <section className="hero-section">
        <div className="container-wide">
          <div className="hero-wrapper grain-overlay">
            <img src={heroImage} alt="Sumatera" className="hero-img" />
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles style={{ width: 14, height: 14 }} />
                <span>Platform Budaya 10 Provinsi Sumatera</span>
              </div>
              <h1 className="hero-title fade-in">
                Jelajahi Kekayaan<br/>Budaya <em>Sumatra</em>
              </h1>
              <p className="hero-desc fade-in">
                Satu portal untuk mendokumentasikan, menjelajahi, dan merayakan warisan budaya dari ujung Aceh hingga Lampung — dikurasi bersama komunitas dan dijaga oleh para ahli.
              </p>
              <div className="hero-actions fade-in">
                <Link to="/eksplorasi">
                  <Button className="btn-primary hero-btn-primary">
                    Mulai Jelajah <ArrowRight style={{ width: 16, height: 16, marginLeft: 8 }} />
                  </Button>
                </Link>
                <Button variant="ghost" className="hero-btn-ghost">
                  <PlayCircle style={{ width: 16, height: 16, marginRight: 8 }} /> Tentang Kami
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="container-wide">
          <div className="features-grid">
            {features.map((f, idx) => {
              const Icon = iconMap[f.icon];
              return (
                <div key={idx} className="feature-card card-lift">
                  <div className="feature-icon">
                    <Icon style={{ width: 20, height: 20 }} />
                  </div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROVINSI GRID */}
      <section id="provinsi" className="provinsi-section">
        <div className="container-wide">
          <div className="section-header">
            <span className="section-eyebrow">Nusantara Barat</span>
            <h2 className="section-title deco-underline">Eksplorasi Per Provinsi</h2>
          </div>
          <div className="provinsi-grid">
            {provinces.map((p) => (
              <Link to="/eksplorasi" key={p.id} className="provinsi-card card-lift">
                <div className="provinsi-media img-zoom">
                  <img src={p.image} alt={p.name} />
                  <div className="provinsi-count">{p.count} Entri</div>
                  <div className="provinsi-caption">
                    <p className="provinsi-tag">{p.tag}</p>
                    <h3 className="provinsi-name">{p.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED HERITAGE */}
      <section className="featured-section">
        <div className="container-wide">
          <div className="featured-header">
            <div>
              <span className="section-eyebrow">Terkurasi</span>
              <h2 className="section-title">Warisan Agung Sumatra<br/>Pilihan Redaksi</h2>
            </div>
            <Link to="/eksplorasi">
              <Button variant="outline" style={{ borderColor: '#1C3B2E', color: '#1C3B2E', borderRadius: '0.375rem' }}>
                Lihat Semua Warisan <ArrowRight style={{ width: 16, height: 16, marginLeft: 8 }} />
              </Button>
            </Link>
          </div>
          <div className="featured-grid">
            {featured.map((c) => (
              <Link to={`/budaya/${c.slug}`} key={c.id} className="featured-card">
                <div className="featured-media img-zoom">
                  <img src={c.image} alt={c.title} />
                </div>
                <div className="featured-meta">
                  <span className="pill-category">{c.category}</span>
                  <span className="featured-meta-province">{c.province}</span>
                </div>
                <h3 className="featured-title">{c.title}</h3>
                <p className="featured-desc">{c.desc}</p>
                <span className="featured-cta">
                  Baca Selengkapnya <ArrowRight style={{ width: 14, height: 14 }} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ARTIKEL */}
      <section id="artikel" className="artikel-section">
        <div className="container-wide">
          <div className="section-header">
            <span className="section-eyebrow">Jurnal Budaya</span>
            <h2 className="section-title deco-underline">Artikel & Cerita</h2>
          </div>
          <div className="artikel-grid">
            {articles.map((a) => (
              <article key={a.id} className="artikel-card">
                <div className="artikel-media img-zoom">
                  <img src={a.image} alt={a.title} />
                </div>
                <div className="artikel-date">{a.date} • {a.author}</div>
                <h3 className="artikel-title">{a.title}</h3>
                <p className="artikel-excerpt">{a.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container-wide">
          <div className="cta-box grain-overlay">
            <div className="cta-inner">
              <div className="cta-text">
                <span className="cta-eyebrow">Berkontribusi</span>
                <h3 className="cta-title">Punya Pengetahuan Budaya Setempat?</h3>
                <p className="cta-desc">
                  Bagikan warisan desamu bersama ribuan kontributor lain. Setiap pengetahuan kecil adalah warisan besar.
                </p>
              </div>
              <Button className="btn-primary cta-btn">
                Usulkan Budaya <ArrowRight style={{ width: 16, height: 16, marginLeft: 8 }} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;