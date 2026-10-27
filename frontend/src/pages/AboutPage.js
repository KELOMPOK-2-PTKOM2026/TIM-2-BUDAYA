import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { aboutMilestones } from '../data/Mock';
import AccessLevels from '../components/AccessLevels';
import { getAccessLevel } from '../lib/roles';
import StatBanner from '../components/StatBanner';
import '../styles/AboutPage.css';

export default function AboutPage() {
  const { user } = useContext(AuthContext);

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

      {/* ================= HAK AKSES PENGGUNA ================= */}
      <section className="about-access">
        <div className="container-wide">
          <div className="about-milestones__header">
            <span className="about-milestones__eyebrow">
              HAK AKSES PENGGUNA
            </span>
            <h2 className="about-milestones__title">
              Siapa Bisa Melakukan Apa?
            </h2>
          </div>
          <AccessLevels currentKey={getAccessLevel(user).key} />
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

      {/* ================= CARA BERKONTRIBUSI ================= */}
      <StatBanner />
    </div>
  );
}
