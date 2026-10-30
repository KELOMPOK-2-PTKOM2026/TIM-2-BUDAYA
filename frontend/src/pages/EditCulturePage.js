import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { compressImage } from '../lib/media';
import '../styles/AdminPage.css';

const STORAGE_BASE = (process.env.REACT_APP_STORAGE_URL || 'http://localhost:8000/storage/').replace(/\/+$/, '');

export default function EditCulturePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [cultureId, setCultureId] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    province_id: '',
    category_id: '',
    status: 'published',
    desc: '',
    history: '',
    source: '',
    featured: false,
  });
  const [facts, setFacts] = useState([]);
  const [newFact, setNewFact] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [deletedGalleryImages, setDeletedGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch data budaya berdasarkan slug dan master data (provinsi, kategori)
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Edit Detail Budaya — Admin JelajahSumatera';
    let isMounted = true;

    const loadData = async () => {
      setPageLoading(true);
      setErrorMessage('');
      try {
        const [cultureRes, provRes, catRes] = await Promise.all([
          api.get(`/cultures/${slug}`),
          api.get('/provinces'),
          api.get('/categories'),
        ]);

        if (!isMounted) return;

        const cultureData = cultureRes.data.data;
        setProvinces(provRes.data.data || provRes.data || []);
        setCategories(catRes.data.data || catRes.data || []);

        if (cultureData) {
          setCultureId(cultureData.id);
          setFormData({
            title: cultureData.title || '',
            province_id: cultureData.province_id || '',
            category_id: cultureData.category_id || '',
            status: cultureData.status || 'published',
            desc: cultureData.desc || '',
            history: cultureData.history || '',
            source: cultureData.source || '',
            featured: !!cultureData.featured,
          });

          // Parse facts
          let parsedFacts = [];
          if (Array.isArray(cultureData.facts)) {
            parsedFacts = cultureData.facts;
          } else if (typeof cultureData.facts === 'string') {
            try {
              const parsed = JSON.parse(cultureData.facts);
              parsedFacts = Array.isArray(parsed) ? parsed : [];
            } catch {
              parsedFacts = [];
            }
          }
          setFacts(parsedFacts);

          // Parse existing gallery images
          let parsedImages = [];
          if (Array.isArray(cultureData.images)) {
            parsedImages = cultureData.images;
          } else if (typeof cultureData.images === 'string') {
            try {
              const parsed = JSON.parse(cultureData.images);
              parsedImages = Array.isArray(parsed) ? parsed : [];
            } catch {
              parsedImages = [];
            }
          }
          setExistingGallery(parsedImages);

          // Initial image preview
          if (cultureData.image) {
            const src = cultureData.image.startsWith('http') || cultureData.image.startsWith('/images/')
              ? cultureData.image
              : `${STORAGE_BASE}/${cultureData.image.replace(/^\/?storage\//, '').replace(/^\//, '')}`;
            setImagePreview(src);
          } else {
            setImagePreview(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.response?.data?.message || 'Gagal memuat detail budaya.');
        }
      } finally {
        if (isMounted) {
          setPageLoading(false);
        }
      }
    };

    if (slug) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(files);
    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleAddFact = () => {
    const trimmed = newFact.trim();
    if (!trimmed) return;
    setFacts((prev) => [...prev, trimmed]);
    setNewFact('');
  };

  const handleRemoveFact = (index) => {
    setFacts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteGallery = (imagePath) => {
    setDeletedGalleryImages((prev) => [...prev, imagePath]);
    setExistingGallery((prev) => prev.filter((img) => img !== imagePath));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cultureId) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const submitData = new FormData();
      submitData.append('_method', 'PATCH');
      submitData.append('title', formData.title);
      submitData.append('province_id', formData.province_id);
      submitData.append('category_id', formData.category_id);
      submitData.append('status', formData.status);
      submitData.append('desc', formData.desc);
      submitData.append('featured', formData.featured ? '1' : '0');

      if (formData.history) {
        submitData.append('history', formData.history);
      }
      if (formData.source) {
        submitData.append('source', formData.source);
      }

      if (facts && facts.length > 0) {
        facts.forEach((fact, index) => {
          submitData.append(`facts[${index}]`, fact);
        });
      } else {
        submitData.append('facts', []);
      }

      if (imageFile) {
        const compressedMain = await compressImage(imageFile);
        submitData.append('image', compressedMain);
      }

      deletedGalleryImages.forEach((imagePath, index) => {
        submitData.append(`deleted_gallery_images[${index}]`, imagePath);
      });

      if (galleryFiles.length > 0) {
        const compressedGallery = await Promise.all(
          galleryFiles.map((file) => compressImage(file))
        );
        compressedGallery.forEach((file) => {
          submitData.append('images_gallery[]', file);
        });
      }

      await api.post(`/admin/cultures/${cultureId}`, submitData);
      navigate('/admin');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(' ')
          : 'Gagal memperbarui budaya.');
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatImageUrl = (path) => {
    if (!path) return '/images/dummy-budaya.svg';
    if (path.startsWith('http') || path.startsWith('/images/')) return path;
    return `${STORAGE_BASE}/${path.replace(/^\/?storage\//, '').replace(/^\//, '')}`;
  };

  if (pageLoading) {
    return (
      <div className="admin-page">
        <div className="admin-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Memuat data budaya...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        {/* Tombol Kembali */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="admin-button admin-button--back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali
        </button>

        {/* BANNER JUDUL */}
        <div className="bg-[#1b3b36] dark:bg-[#122824] p-6 sm:p-8 rounded-xl shadow-md mb-6 mt-4">
          <p className="text-xs font-bold text-teal-400/80 tracking-wider uppercase mb-1">
            Manajemen Katalog
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            Edit Detail Budaya
          </h2>
          <p className="text-gray-200 text-sm mt-2">
            Perbarui informasi budaya, gambar sampul, galeri, dan status publikasi.
          </p>
        </div>

        {/* Card Formulir */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          }}
        >
          {errorMessage && (
            <div
              style={{
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                borderRadius: '8px',
                backgroundColor: '#fdf2ed',
                color: '#b63e2c',
                border: '1px solid rgba(182, 62, 44, 0.25)',
                fontSize: '0.85rem',
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-modal-form">
            {/* Judul Budaya */}
            <div className="admin-modal-field">
              <label htmlFor="edit-title" className="admin-modal-label">
                Nama / Judul Budaya *
              </label>
              <input
                id="edit-title"
                type="text"
                name="title"
                className="admin-modal-input"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Grid 3 Kolom: Provinsi, Kategori, Status */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <label htmlFor="edit-province" className="admin-modal-label">
                  Provinsi *
                </label>
                <select
                  id="edit-province"
                  name="province_id"
                  className="admin-modal-input"
                  value={formData.province_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <label htmlFor="edit-category" className="admin-modal-label">
                  Kategori *
                </label>
                <select
                  id="edit-category"
                  name="category_id"
                  className="admin-modal-input"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <label htmlFor="edit-status" className="admin-modal-label">
                  Status Publikasi *
                </label>
                <select
                  id="edit-status"
                  name="status"
                  className="admin-modal-input"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Foto Sampul Utama */}
            <div className="admin-modal-field">
              <label htmlFor="edit-image" className="admin-modal-label">
                Foto Sampul (Hero Background)
              </label>
              <input
                id="edit-image"
                type="file"
                className="admin-modal-input"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>
                Format: JPG, PNG, WEBP. Maksimal ukuran: 2MB.
              </span>
              {imagePreview && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={imagePreview}
                    alt="Preview Sampul"
                    style={{ width: '80px', height: '52px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {imageFile ? `File baru: ${imageFile.name}` : 'Gambar saat ini'}
                  </span>
                </div>
              )}
            </div>

            {/* Galeri Foto Tambahan */}
            <div className="admin-modal-field">
              <label htmlFor="edit-gallery" className="admin-modal-label">
                Galeri Foto Tambahan (Bisa multi-pilih)
              </label>
              <input
                id="edit-gallery"
                type="file"
                multiple
                className="admin-modal-input"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleGalleryChange}
              />
              {galleryPreviews.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#2b6cb0', display: 'block', marginBottom: '0.25rem' }}>
                    Akan diunggah ({galleryPreviews.length} foto):
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {galleryPreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Preview ${i + 1}`}
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #3182ce' }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {existingGallery.length > 0 && (
                <div className="admin-gallery-section">
                  <p className="admin-gallery-title">
                    Foto galeri saat ini ({existingGallery.length} foto):
                  </p>
                  
                  {/* Container Grid untuk kartu foto */}
                  <div className="admin-gallery-grid">
                    {existingGallery.map((imagePath, index) => (
                      <div key={index} className="admin-gallery-card">
                        {/* Wadah Gambar */}
                        <div className="admin-gallery-thumb">
                          <img 
                            src={formatImageUrl(imagePath)} 
                            alt={`Galeri ${index + 1}`} 
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/dummy-budaya.svg';
                            }}
                          />
                        </div>

                        {/* Tombol Hapus Vertikal */}
                        <button
                          type="button"
                          onClick={() => handleDeleteGallery(imagePath)}
                          className="admin-gallery-delete-btn"
                          title="Hapus foto dari galeri"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Deskripsi Singkat */}
            <div className="admin-modal-field">
              <label htmlFor="edit-desc" className="admin-modal-label">
                Deskripsi Singkat *
              </label>
              <textarea
                id="edit-desc"
                name="desc"
                className="admin-modal-textarea"
                rows={3}
                value={formData.desc}
                onChange={handleInputChange}
                placeholder="Ringkasan budaya yang tampil di katalog dan kartu..."
                required
              />
            </div>

            {/* Sejarah & Latar Belakang */}
            <div className="admin-modal-field">
              <label htmlFor="edit-history" className="admin-modal-label">
                Sejarah & Nilai Budaya
              </label>
              <textarea
                id="edit-history"
                name="history"
                className="admin-modal-textarea"
                rows={4}
                value={formData.history}
                onChange={handleInputChange}
                placeholder="Sejarah mendalam, asal-usul, dan makna filosofis..."
              />
            </div>

            {/* Fakta Menarik (Daftar Dinamis) */}
            <div className="admin-modal-field">
              <label className="admin-modal-label">Fakta Menarik (Poin-poin)</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="admin-modal-input"
                  placeholder="Tulis fakta unik lalu tekan Tambah..."
                  value={newFact}
                  onChange={(e) => setNewFact(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFact();
                    }
                  }}
                />
                <button
                  type="button"
                  className="admin-modal-btn admin-modal-btn--secondary"
                  onClick={handleAddFact}
                  style={{ padding: '0 1rem', whiteSpace: 'nowrap', fontSize: '0.82rem' }}
                >
                  + Tambah
                </button>
              </div>

              {facts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {facts.map((fact, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--border-color)',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span>{fact}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFact(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#b63e2c',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          padding: '0 0.25rem',
                        }}
                        title="Hapus poin fakta"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sumber Referensi */}
            <div className="admin-modal-field">
              <label htmlFor="edit-source" className="admin-modal-label">
                Sumber Referensi
              </label>
              <input
                id="edit-source"
                type="text"
                name="source"
                className="admin-modal-input"
                value={formData.source}
                onChange={handleInputChange}
                placeholder="Contoh: Balai Pelestarian Kebudayaan Wilayah I, Kemendikbudristek"
              />
            </div>

            {/* Featured Checkbox */}
            <div className="admin-modal-field">
              <label className="admin-modal-checkbox-row">
                <input
                  id="edit-featured"
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                <span className="admin-modal-label" style={{ margin: 0, cursor: 'pointer' }}>
                  Tampilkan di Carousel Hero ("Budaya Unggulan")
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="admin-modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="admin-modal-btn admin-modal-btn--secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="admin-modal-btn admin-modal-btn--edit"
                disabled={loading}
              >
                {loading ? (
                  <span className="admin-modal-btn__loading">
                    <span className="admin-modal-spinner" />
                    Menyimpan...
                  </span>
                ) : (
                  'Simpan Perubahan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
