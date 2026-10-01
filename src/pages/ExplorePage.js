import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cultures, provinces, categories } from '../data/Mock';
import '../styles/ExplorePage.css';

const ITEMS_PER_PAGE = 6;

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeProvince, setActiveProvince] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync with URL params
  const urlCategory = searchParams.get('category') || 'all';
  const urlProvince = searchParams.get('province') || '';

  const filtered = useMemo(() => {
    return cultures.filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.desc.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === 'all' || c.category.toLowerCase() === activeCategory.toLowerCase();
      const matchProvince = !activeProvince || c.province.toLowerCase().includes(activeProvince.toLowerCase());
      return matchSearch && matchCategory && matchProvince;
    });
  }, [search, activeCategory, activeProvince]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    const params = {};
    if (cat !== 'all') params.category = cat;
    if (urlProvince) params.province = urlProvince;
    setSearchParams(params);
  };

  const handleProvinceChange = (e) => {
    const val = e.target.value;
    setActiveProvince(val);
    setCurrentPage(1);
    const params = {};
    if (urlCategory !== 'all') params.category = urlCategory;
    if (val) params.province = val;
    setSearchParams(params);
  };

  return (
    <div className="explore-page">
      <div className="container-wide">
        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ marginTop: '1.5rem' }}>
          <Link to="/">Beranda</Link>
          <span className="breadcrumb__sep">/</span>
          <span className="breadcrumb__current">Eksplorasi</span>
        </div>

        {/* Header */}
        <div className="explore-header">
          <h1 className="explore-title">Eksplorasi Budaya</h1>
          <p className="explore-desc">
            Jelajahi koleksi warisan budaya Sumatera yang telah dikurasi. Gunakan filter untuk menemukan budaya yang Anda cari.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="explore-filters">
          <div className="search-wrap">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Cari budaya..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <select className="province-select" value={activeProvince} onChange={handleProvinceChange}>
            <option value="">Semua Provinsi</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
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

        {/* Grid */}
        {paginated.length > 0 ? (
          <div className="explore-grid">
            {paginated.map((c) => (
              <Link to={`/budaya/${c.slug}`} className="explore-card card-lift" key={c.id}>
                <div className="explore-media img-zoom">
                  <img src={c.image} alt={c.title} />
                </div>
                <div className="explore-body">
                  <div className="explore-meta">
                    <span className="pill-category">{c.category}</span>
                    <span>{c.province}</span>
                  </div>
                  <h3 className="explore-card-title">{c.title}</h3>
                  <p className="explore-card-desc">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Tidak ada budaya yang ditemukan.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &larr;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`page-btn${currentPage === i + 1 ? ' page-btn--active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
