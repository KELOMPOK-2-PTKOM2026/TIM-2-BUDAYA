import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { heroImage } from '../data/Mock';
import '../styles/Hero.css';

const STORAGE_URL = process.env.REACT_APP_STORAGE_URL || 'http://localhost:8000/storage/';

const DEFAULT_SLIDES = [
  {
    id: 'default',
    title: 'Jelajahi Kekayaan Budaya Sumatra',
    desc: 'Arsip digital terlengkap yang mengurasi seni, tradisi, kuliner, dan arsitektur peninggalan leluhur dari 10 provinsi di pulau Sumatra. Dibangun bersama para ahli dan kontributor terverifikasi.',
    image: heroImage,
    province: { name: 'Sumatra' },
  },
];

const Hero = () => {
  const [cultures, setCultures] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch featured cultures from API
  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedCultures = async () => {
      try {
        const response = await api.get('/cultures', {
          params: { featured: 1 },
        });

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        if (isMounted && data.length > 0) {
          setCultures(data);
        }
      } catch (error) {
        console.error('Gagal mengambil data budaya unggulan:', error);
      }
    };

    fetchFeaturedCultures();

    return () => {
      isMounted = false;
    };
  }, []);

  const slides = cultures.length > 0 ? cultures : DEFAULT_SLIDES;

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, currentIndex]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Slide hero butuh foto asli; ilustrasi dummy diganti foto hero default
  const getImageUrl = (imagePath) => {
    if (!imagePath || /\/images\/dummy-[a-z]+\.svg$/.test(imagePath)) return heroImage;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/images/')) return imagePath;
    return `${STORAGE_URL}${imagePath}`;
  };

  const currentCulture = slides[currentIndex] || slides[0];

  return (
    <section className="hero" aria-label="Budaya Unggulan Sumatra">
      <div className="container-wide">
        <div className="hero__banner">
          {/* Dynamic Slideshow Backgrounds with Fade-in Effect */}
          <div className="hero__slides" aria-hidden="true">
            {slides.map((slide, index) => (
              <div
                key={slide.id || index}
                className={`hero__slide ${index === currentIndex ? 'hero__slide--active' : ''}`}
              >
                <img
                  src={getImageUrl(slide.image)}
                  alt={slide.title || 'Budaya Sumatra'}
                  className="hero__bg"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = heroImage;
                  }}
                />
                <div className="hero__gradient-overlay" />
              </div>
            ))}
          </div>

          {/* Dynamic Content */}
          <div className="hero__content" key={currentCulture.id || currentIndex}>
            <span className="hero__eyebrow">
              — {currentCulture.province?.name ? `BUDAYA UNGGULAN: ${currentCulture.province.name}` : 'WARISAN NUSANTARA'}
            </span>

            <h1 className="hero__title">
              {currentCulture.title || 'Jelajahi Kekayaan Budaya Sumatra'}
            </h1>

            <p className="hero__desc">
              {currentCulture.desc || 'Arsip digital terlengkap yang mengurasi seni, tradisi, kuliner, dan arsitektur peninggalan leluhur dari 10 provinsi di pulau Sumatra.'}
            </p>

            <div className="hero__actions">
              {currentCulture.slug ? (
                <Link to={`/budaya/${currentCulture.slug}`} className="hero__btn-primary">
                  Jelajahi Budaya
                </Link>
              ) : (
                <Link to="/eksplorasi" className="hero__btn-primary">
                  Mulai Jelajah
                </Link>
              )}
              <Link to="/eksplorasi" className="hero__btn-secondary">
                Semua Budaya
                <span className="hero__btn-arrow">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Indicators Dots */}
          {slides.length > 1 && (
            <div className="hero__indicators" role="tablist" aria-label="Slide budaya unggulan">
              {slides.map((slide, index) => (
                <button
                  key={slide.id || index}
                  type="button"
                  className={`hero__dot ${index === currentIndex ? 'hero__dot--active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Slide ${index + 1}: ${slide.title || 'Budaya'}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
