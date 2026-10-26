import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { getApiErrorMessage } from '../lib/errors';
import { resolveImageUrl, handleImageError } from '../lib/media';
import '../styles/ExplorePage.css';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlProvince = searchParams.get('province') || '';
  const urlCategory = searchParams.get('category') || 'all';

  // Filter States
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeProvince, setActiveProvince] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Data States
  const [cultures, setCultures] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Filter Options (Provinces & Categories) once on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [provRes, catRes] = await Promise.all([
          api.get('/provinces'),
          api.get('/categories')
        ]);
        setProvinces(provRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Gagal mengambil opsi filter:', err);
      }
    };
    fetchOptions();
  }, []);

  // Sync URL params to state (supports slug and ID)
  useEffect(() => {
    if (urlProvince && provinces.length > 0) {
      const match = provinces.find((p) => p.slug === urlProvince || String(p.id) === String(urlProvince));
      if (match) setActiveProvince(String(match.id));
    } else if (!urlProvince) {
      setActiveProvince('');
    }
  }, [urlProvince, provinces]);

  useEffect(() => {
    if (urlCategory && urlCategory !== 'all' && categories.length > 0) {
      const match = categories.find((c) => c.slug === urlCategory || String(c.id) === String(urlCategory));
      if (match) setActiveCategory(String(match.id));
    } else if (urlCategory === 'all') {
      setActiveCategory('all');
    }
  }, [urlCategory, categories]);

  // Fetch Data Cultures based on filters and pagination
  useEffect(() => {
    const fetchCultures = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          per_page: 12
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (activeProvince) {
          params.province_id = activeProvince;
        }

        if (activeCategory && activeCategory !== 'all') {
          params.category_id = activeCategory;
        }

        const response = await api.get('/cultures', { params });

        // Laravel Pagination Mapping
        const responseData = response.data;
        setCultures(responseData.data || []);
        setTotalPages(responseData.last_page || 1);
        setTotalItems(responseData.total || 0);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Gagal memuat data budaya. ${getApiErrorMessage(err)}`);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchCultures();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, activeCategory, activeProvince, currentPage]);

  const handleCategoryChange = (catId) => {
    const val = String(catId);
    setActiveCategory(val);
    setCurrentPage(1);

    const nextParams = {};
    if (val !== 'all') {
      const matchCat = categories.find((c) => String(c.id) === val);
      nextParams.category = matchCat ? matchCat.slug : val;
    }
    if (activeProvince) {
      const matchProv = provinces.find((p) => String(p.id) === String(activeProvince));
      nextParams.province = matchProv ? matchProv.slug : activeProvince;
    }
    setSearchParams(nextParams);
  };

  const handleProvinceChange = (e) => {
    const val = e.target.value;
    setActiveProvince(val);
    setCurrentPage(1);

    const nextParams = {};
    if (activeCategory !== 'all') {
      const matchCat = categories.find((c) => String(c.id) === String(activeCategory));
      nextParams.category = matchCat ? matchCat.slug : activeCategory;
    }
    if (val) {
      const matchProv = provinces.find((p) => String(p.id) === String(val));
      nextParams.province = matchProv ? matchProv.slug : val;
    }
    setSearchParams(nextParams);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="explore-page">
      <div className="container-wide">
        {/* Breadcrumb */}
        <nav className="explore-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">Beranda</Link>
          <span className="breadcrumb-sep">&gt;</span>
          <span className="breadcrumb-current">Eksplorasi</span>
        </nav>

        {/* Header */}
        <header className="explore-header">
          <h1 className="explore-title">Jelajahi Warisan Budaya</h1>
          <p className="explore-desc">
            Gunakan filter provinsi dan kategori di bawah untuk menemukan dokumentasi tradisi yang ingin Anda pelajari lebih mendalam.
          </p>
        </header>

        {/* Toolbar */}
        <div className="explore-toolbar">
          <div className="toolbar-left">
            <div className="province-select-wrapper">
              <select
                className="province-dropdown"
                value={activeProvince}
                onChange={handleProvinceChange}
                aria-label="Pilih Provinsi"
              >
                <option value="">Semua Provinsi</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="toolbar-center">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="Cari budaya sumatera..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="toolbar-right">
            <span className="entries-count">Menampilkan total {totalItems} Entri</span>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="category-pills-bar">
          <button
            type="button"
            className={`category-pill${activeCategory === 'all' ? ' category-pill--active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-pill${String(activeCategory) === String(cat.id) ? ' category-pill--active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading / Error / Data */}
        {loading ? (
          <div className="explore-grid" aria-busy="true" aria-label="Memuat data budaya">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div className="explore-card skeleton-card" key={idx}>
                <div className="explore-card__image-wrap skeleton" />
                <div className="explore-card__body">
                  <div className="explore-card__tags">
                    <span className="skeleton skeleton-tag" />
                    <span className="skeleton skeleton-tag" />
                  </div>
                  <div className="skeleton skeleton-text skeleton-text--title" />
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text skeleton-text--short" />
                  <div className="skeleton skeleton-tag" style={{ marginTop: '0.85rem', width: '90px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-10 font-bold text-red-500">{error}</div>
        ) : cultures.length > 0 ? (
          <div className="explore-grid">
            {cultures.map((item) => (
              <article className="explore-card" key={item.id}>
                <Link to={`/budaya/${item.slug}`} className="explore-card__media-link">
                  <div className="explore-card__image-wrap">
                    <img
                      src={resolveImageUrl(item.image, item.category)}
                      alt={item.title}
                      className="explore-card__img"
                      loading="lazy"
                      onError={handleImageError(item.category)}
                    />
                  </div>
                </Link>
                <div className="explore-card__body">
                  <div className="explore-card__tags">
                    <span className="tag-province">{item.province?.name}</span>
                    <span className="tag-category">{item.category?.name}</span>
                  </div>
                  <h2 className="explore-card__title">
                    <Link to={`/budaya/${item.slug}`}>{item.title}</Link>
                  </h2>
                  <p className="explore-card__desc">{item.desc}</p>
                  <Link to={`/budaya/${item.slug}`} className="explore-card__cta">
                    Lihat Detail &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="explore-empty">
            <h3 className="explore-empty__title">Tidak Ada Entri Budaya</h3>
            <p className="explore-empty__desc">Coba sesuaikan kata kunci pencarian atau ubah pilihan filter Anda.</p>
          </div>
        )}

        {/* Pagination (BEM) */}
        {totalPages > 1 && (
          <nav className="pagination" aria-label="Navigasi Halaman Budaya">
            <button
              type="button"
              className="pagination__btn pagination__btn--prev"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &larr; Sebelumnya
            </button>

            <div className="pagination__pages">
              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={`pagination__btn pagination__btn--page ${
                      currentPage === pageNum ? 'pagination__btn--active' : ''
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <div className="pagination__info">
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
            </div>

            <button
              type="button"
              className="pagination__btn pagination__btn--next"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Selanjutnya &rarr;
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
