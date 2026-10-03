import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cultures, provinces, categories } from '../data/Mock';
import '../styles/ExplorePage.css';

const ITEMS_PER_PAGE = 6;

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlProvince = searchParams.get('province') || '';
  const urlCategory = searchParams.get('category') || 'all';

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [activeProvince, setActiveProvince] = useState(urlProvince);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state when URL params change
  useEffect(() => {
    if (urlCategory) setActiveCategory(urlCategory);
    if (urlProvince) {
      // Find matching province name if slug provided
      const matched = provinces.find((p) => p.slug === urlProvince || p.name.toLowerCase() === urlProvince.toLowerCase());
      setActiveProvince(matched ? matched.name : urlProvince);
    }
  }, [urlCategory, urlProvince]);

  const filtered = useMemo(() => {
    return cultures.filter((c) => {
      // Search match
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.desc.toLowerCase().includes(search.toLowerCase()) ||
        c.province.toLowerCase().includes(search.toLowerCase());

      // Category match
      const matchCategory =
        activeCategory === 'all' ||
        c.category.toLowerCase().replace(/\s+/g, '-') === activeCategory.toLowerCase().replace(/\s+/g, '-');

      // Province match
      const matchProvince =
        !activeProvince ||
        c.province.toLowerCase().includes(activeProvince.toLowerCase());

      return matchSearch && matchCategory && matchProvince;
    });
  }, [search, activeCategory, activeProvince]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setCurrentPage(1);
    const params = {};
    if (catId !== 'all') params.category = catId;
    if (activeProvince) params.province = activeProvince;
    setSearchParams(params);
  };

  const handleProvinceChange = (e) => {
    const val = e.target.value;
    setActiveProvince(val);
    setCurrentPage(1);
    const params = {};
    if (activeCategory !== 'all') params.category = activeCategory;
    if (val) params.province = val;
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
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

        {/* Page Header */}
        <header className="explore-header">
          <h1 className="explore-title">Eksplorasi Khazanah Budaya</h1>
          <p className="explore-desc">
            Gunakan filter provinsi dan kategori di bawah untuk menemukan dokumentasi tradisi yang ingin Anda pelajari lebih mendalam.
          </p>
        </header>

        {/* Search & Filter Toolbar */}
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
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              <svg className="dropdown-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          <div className="toolbar-center">
            <div className="search-box">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
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
            <span className="entries-count">
              Menampilkan {filtered.length === cultures.length ? '120' : filtered.length} Entri Terverifikasi
            </span>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="category-pills-bar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill${activeCategory === cat.id ? ' category-pill--active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Cultural Cards Grid */}
        {paginated.length > 0 ? (
          <div className="explore-grid">
            {paginated.map((item) => (
              <article className="explore-card" key={item.id}>
                <Link to={`/budaya/${item.slug}`} className="explore-card__media-link">
                  <div className="explore-card__image-wrap">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="explore-card__img"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/dummy-budaya.svg';
                      }}
                    />
                  </div>
                </Link>

                <div className="explore-card__body">
                  <div className="explore-card__tags">
                    <span className="tag-province">{item.province}</span>
                    <span className="tag-category">{item.category}</span>
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
            <div className="explore-empty__icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C4542E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h3 className="explore-empty__title">Tidak Ada Entri Budaya</h3>
            <p className="explore-empty__desc">
              Tidak ditemukan data budaya dengan kata kunci atau filter yang Anda pilih. Silakan atur ulang filter pencarian.
            </p>
            <button
              className="explore-empty__reset"
              onClick={() => {
                setSearch('');
                setActiveCategory('all');
                setActiveProvince('');
                setSearchParams({});
              }}
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="explore-pagination" aria-label="Navigasi Halaman">
            <button
              className="pagination-btn pagination-arrow"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Halaman Sebelumnya"
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn${currentPage === i + 1 ? ' pagination-btn--active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="pagination-btn pagination-arrow"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Halaman Selanjutnya"
            >
              &gt;
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
