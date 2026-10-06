import { useEffect } from 'react';
import { aboutStats, aboutMilestones } from '../data/Mock';
import '../styles/AboutPage.css';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Tentang JelajahSumatera — Mengenal Platform Kami';
  }, []);

  return (
    <div className="about-page">
      {/* ================= HERO BANNER ================= */}
      <section className="about-hero">
        <img
          src="/images/about-forest-hero.jpg"
          alt="Hutan Pinus Berkabut Sumatra"
          className="about-hero__bg"
        />
        <div className="about-hero__overlay" />
        <div className="container-wide">
          <div className="about-hero__content">
            <span className="about-hero__eyebrow">
              MENGENAL PLATFORM KAMI
            </span>
            <h1 className="about-hero__title">
              Tentang JelajahSumatera
            </h1>
          </div>
        </div>
      </section>

      {/* ================= VISI & MISI ================= */}
      <section className="about-vm">
        <div className="container-wide">
          <div className="about-vm__grid">
            {/* Visi */}
            <div className="about-vm__col">
              <h2 className="about-vm__title">
                Visi Pelestarian Budaya
              </h2>
              <p className="about-vm__desc">
                Menjadi database kebudayaan Sumatra digital terkemuka yang menyajikan keaslian, sejarah, dan nilai-nilai luhur adat istiadat setempat agar diakui secara global serta lestari di kalangan generasi penerus bangsa.
              </p>
            </div>

            {/* Misi */}
            <div className="about-vm__col">
              <h2 className="about-vm__title">
                Misi & Aksi Digital
              </h2>
              <p className="about-vm__desc">
                Membangun jaringan kurator lokal berlisensi, mendokumentasikan pengetahuan lisan suku-suku pedalaman, dan mengemas aset-aset warisan tak benda dalam format digital berkualitas tinggi yang divalidasi ketat secara akademis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS COUNTER BAR ================= */}
      <section className="about-stats">
        <div className="container-wide">
          <div className="about-stats__grid">
            {aboutStats.map((item, index) => (
              <div key={index} className="about-stats__item">
                <div className="about-stats__value">{item.value}</div>
                <div className="about-stats__label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TONGGAK SEJARAH PLATFORM ================= */}
      <section className="about-milestones">
        <div className="container-wide">
          <div className="about-milestones__header">
            <span className="about-milestones__eyebrow">
              JEJAK LANGKAH
            </span>
            <h2 className="about-milestones__title">
              Tonggak Sejarah Platform
            </h2>
          </div>

          <div className="about-milestones__list">
            {aboutMilestones.map((milestone) => (
              <div key={milestone.year} className="about-milestones__card">
                <div className="about-milestones__year">
                  {milestone.year}
                </div>
                <div className="about-milestones__content">
                  <div className="about-milestones__card-title">
                    {milestone.title}
                  </div>
                  <p className="about-milestones__card-desc">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
