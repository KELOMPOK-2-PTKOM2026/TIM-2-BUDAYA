import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import '../styles/ExplorePage.css';

// Gunakan prefix Storage Laravel dari environment variable
const STORAGE_URL = process.env.REACT_APP_STORAGE_URL || 'http://localhost:8000/storage/';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlProvince = searchParams.get('province') || '';
  const urlCategory = searchParams.get('category') || 'all';

  // States
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [activeProvince, setActiveProvince] = useState(urlProvince);
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
        setProvinces(provRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Gagal mengambil opsi filter:', err);
      }
    };
    fetchOptions();
  }, []);

  // Sync URL params to state
  useEffect(() => {
    if (urlCategory) setActiveCategory(urlCategory);
    if (urlProvince) setActiveProvince(urlProvince);
  }, [urlCategory, urlProvince]);

  // Fetch Data Cultures based on filters and pagination
  useEffect(() => {
    const fetchCultures = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page: currentPage, per_page: 6 };
        if (search) params.search = search;
        // Gunakan slug province dan category (jangan 'all')
        if (activeProvince) params.province = activeProvince;
        if (activeCategory !== 'all') params.category = activeCategory;

        const response = await api.get('/cultures', { params });
        
        // Laravel Pagination Mapping
        setCultures(response.data.data);
        setTotalPages(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Gagal memuat data budaya. Pastikan server backend berjalan.');
      } finally {
        setLoading(false);
      }
    };

    // Gunakan debounce sederhana menggunakan timeout
    const timeoutId = setTimeout(() => {
      fetchCultures();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [search, activeCategory, activeProvince, currentPage]);

  const handleCategoryChange = (catSlug) => {
    setActiveCategory(catSlug);
    setCurrentPage(1);
    const params = {};
    if (catSlug !== 'all') params.category = catSlug;
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/dummy-budaya.svg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/images/')) return imagePath;
    return `${STORAGE_URL}${imagePath}`;
  };

  return (
    <div className="explore-page">
      <div className="container-wide">
        {/* Breadcrumb & Header... */}
        <nav className="explore-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">Beranda</Link>
          <span className="breadcrumb-sep">&gt;</span>
          <span className="breadcrumb-current">Eksplorasi</span>
        </nav>

        <header className="explore-header">
          <h1 className="explore-title">Eksplorasi Khazanah Budaya</h1>
          <p className="explore-desc">Gunakan filter provinsi dan kategori di bawah untuk menemukan dokumentasi tradisi yang ingin Anda pelajari lebih mendalam.</p>
        </header>

        {/* Toolbar */}
        <div className="explore-toolbar">
          <div className="toolbar-left">
            <div className="province-select-wrapper">
              <select className="province-dropdown" value={activeProvince} onChange={handleProvinceChange}>
                <option value="">Semua Provinsi</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.slug}>{p.name}</option>
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
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
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
            className={`category-pill${activeCategory === 'all' ? ' category-pill--active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill${activeCategory === cat.slug ? ' category-pill--active' : ''}`}
              onClick={() => handleCategoryChange(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading / Error / Data */}
        {loading ? (
          <div className="text-center p-10 font-bold text-gray-500">⏳ Memuat Data...</div>
        ) : error ? (
          <div className="text-center p-10 font-bold text-red-500">{error}</div>
        ) : cultures.length > 0 ? (
          <div className="explore-grid">
            {cultures.map((item) => (
              <article className="explore-card" key={item.id}>
                <Link to={`/budaya/${item.slug}`} className="explore-card__media-link">
                  <div className="explore-card__image-wrap">
                    <img src={getImageUrl(item.image)} alt={item.title} className="explore-card__img" />
                  </div>
                </Link>
                <div className="explore-card__body">
                  <div className="explore-card__tags">
                    <span className="tag-province">{item.province?.name}</span>
                    <span className="tag-category">{item.category?.name}</span>
                  </div>
                  <h2 className="explore-card__title"><Link to={`/budaya/${item.slug}`}>{item.title}</Link></h2>
                  <p className="explore-card__desc">{item.desc}</p>
                  <Link to={`/budaya/${item.slug}`} className="explore-card__cta">Lihat Detail &rarr;</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="explore-empty">
            <h3 className="explore-empty__title">Tidak Ada Entri Budaya</h3>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="explore-pagination">
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} className={currentPage === i + 1 ? 'pagination-btn--active' : ''} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
          </nav>
        )}
      </div>
    </div>
  );
}
