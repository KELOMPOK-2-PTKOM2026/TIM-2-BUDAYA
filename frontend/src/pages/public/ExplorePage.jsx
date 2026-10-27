import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { cultures, categories, provinces } from '../data/mock';
import './ExplorePage.css';

const ExplorePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [provinceFilter, setProvinceFilter] = useState('all');
  const perPage = 9;

  const filtered = useMemo(() => {
    return cultures.filter((c) => {
      const matchCat = activeCategory === 'all' || c.category.toLowerCase() === categories.find(x => x.id === activeCategory)?.name.toLowerCase();
      const matchQ = !query || c.title.toLowerCase().includes(query.toLowerCase()) || c.province.toLowerCase().includes(query.toLowerCase());
      const matchProv = provinceFilter === 'all' || c.province === provinceFilter;
      return matchCat && matchQ && matchProv;
    });
  }, [activeCategory, query, provinceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container-wide explore-page">
      <div className="breadcrumb">
        <Link to="/">Beranda</Link>
        <span className="breadcrumb__sep">/</span>
        <span className="breadcrumb__current">Eksplorasi</span>
      </div>

      <div className="explore-header">
        <h1 className="explore-title">Jelajahi Warisan Budaya</h1>
        <p className="explore-desc">Lebih dari 400 entri budaya dari 10 provinsi di Sumatera. Saring berdasarkan kategori, provinsi, atau cari langsung berdasarkan nama.</p>
      </div>

      <div className="explore-filters">
        <div className="search-wrap">
          <Search className="search-icon" style={{ width: 16, height: 16 }} />
          <input
            type="text"
            placeholder="Cari warisan budaya, misal: Rumah Gadang, Pempek..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="search-input"
          />
        </div>
        <select
          value={provinceFilter}
          onChange={(e) => { setProvinceFilter(e.target.value); setPage(1); }}
          className="province-select"
        >
          <option value="all">Semua Provinsi</option>
          {provinces.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
        <button className="filter-btn-icon">
          <SlidersHorizontal style={{ width: 16, height: 16, marginRight: 8 }} /> Filter
        </button>
      </div>

      <div className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setPage(1); }}
            className={`category-pill ${activeCategory === cat.id ? 'category-pill--active' : ''}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {paged.length === 0 ? (
        <div className="empty-state">Tidak ada hasil yang cocok.</div>
      ) : (
        <div className="explore-grid">
          {paged.map((c) => (
            <Link to={`/budaya/${c.slug}`} key={c.id} className="explore-card card-lift">
              <div className="explore-media img-zoom">
                <img src={c.image} alt={c.title} />
              </div>
              <div className="explore-body">
                <div className="explore-meta">
                  <span className="pill-category">{c.category}</span>
                  <span>•</span>
                  <span>{c.province}</span>
                </div>
                <h3 className="explore-card-title">{c.title}</h3>
                <p className="explore-card-desc">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="page-btn"
          aria-label="Previous"
        >
          <ChevronLeft style={{ width: 16, height: 16 }} />
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`page-btn ${page === i + 1 ? 'page-btn--active' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="page-btn"
          aria-label="Next"
        >
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
};

export default ExplorePage;
