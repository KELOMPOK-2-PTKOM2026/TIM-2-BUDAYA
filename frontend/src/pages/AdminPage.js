import { useCallback, useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../components/AlertModal';
import EditCultureModal from '../components/EditCultureModal';
import '../styles/AdminPage.css';

const STORAGE_URL = process.env.REACT_APP_STORAGE_URL || 'http://localhost:8000/storage/';

const statusLabels = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
};

export default function AdminPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals' | 'cultures'

  // Master data pilihan
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);

  // ================= TAB 1: USULAN / PROPOSALS STATE =================
  const [status, setStatus] = useState('pending');
  const [proposals, setProposals] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Dialog verifikasi (Setujui / Tolak + Catatan Admin)
  const [verifyModal, setVerifyModal] = useState({
    isOpen: false,
    proposal: null,
    nextStatus: 'approved',
    adminNote: '',
  });

  // ================= TAB 2: KATALOG BUDAYA STATE =================
  const [cultures, setCultures] = useState([]);
  const [culturePagination, setCulturePagination] = useState(null);
  const [cultureLoading, setCultureLoading] = useState(false);
  const [cultureSearch, setCultureSearch] = useState('');
  const [activeCultureId, setActiveCultureId] = useState(null);

  // Dialog edit budaya
  const [editModal, setEditModal] = useState({
    isOpen: false,
    culture: null,
  });

  // Alert feedback modal
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: 'success',
    eyebrow: '',
    title: '',
    message: '',
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/dummy-budaya.svg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/images/')) return imagePath;
    return `${STORAGE_URL}${imagePath}`;
  };

  // ================= FETCH PROPOSALS =================
  const loadProposals = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/admin/proposals', {
        params: { status, page },
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setProposals(data.data || []);
      setPagination(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Gagal mengambil data usulan.');
    } finally {
      setLoading(false);
    }
  }, [status, token]);

  // ================= FETCH CULTURES =================
  const loadCultures = useCallback(async (page = 1, search = '') => {
    setCultureLoading(true);
    try {
      const params = { page, per_page: 10 };
      if (search) params.search = search;
      const response = await api.get('/cultures', { params });
      const data = response.data;
      setCultures(data.data || []);
      setCulturePagination(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Gagal memuat katalog budaya.');
    } finally {
      setCultureLoading(false);
    }
  }, []);

  // Fetch master data provinsi & kategori untuk edit modal
  useEffect(() => {
    Promise.all([api.get('/provinces'), api.get('/categories')])
      .then(([provRes, catRes]) => {
        setProvinces(provRes.data.data || provRes.data || []);
        setCategories(catRes.data.data || catRes.data || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === 'proposals') {
      loadProposals();
    } else if (activeTab === 'cultures') {
      loadCultures(1, cultureSearch);
    }
  }, [activeTab, loadProposals, loadCultures, cultureSearch]);

  // Handle ESC dan kunci scroll saat modal aktif
  useEffect(() => {
    const isAnyModalOpen = verifyModal.isOpen || editModal.isOpen;
    if (!isAnyModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !activeId && !activeCultureId) {
        if (verifyModal.isOpen) setVerifyModal((prev) => ({ ...prev, isOpen: false }));
        if (editModal.isOpen) setEditModal((prev) => ({ ...prev, isOpen: false }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [verifyModal.isOpen, editModal.isOpen, activeId, activeCultureId]);

  // ================= PROPOSALS ACTIONS =================
  const openVerifyModal = (proposal, nextStatus) => {
    setVerifyModal({
      isOpen: true,
      proposal,
      nextStatus,
      adminNote: '',
    });
  };

  const closeVerifyModal = () => {
    if (activeId) return;
    setVerifyModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirmVerify = async (e) => {
    if (e) e.preventDefault();
    if (!verifyModal.proposal) return;

    const { proposal, nextStatus, adminNote } = verifyModal;
    const targetId = proposal.id;

    setActiveId(targetId);
    setError('');
    setMessage('');

    try {
      const response = await api.post(
        `/admin/proposals/${targetId}/verify`,
        { status: nextStatus, admin_note: adminNote.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const successMsg = response.data.message || 'Status usulan berhasil diperbarui.';
      setMessage(successMsg);
      setVerifyModal((prev) => ({ ...prev, isOpen: false }));

      setAlertConfig({
        isOpen: true,
        type: nextStatus === 'approved' ? 'success' : 'info',
        eyebrow: 'Kurasi Usulan Selesai',
        title: nextStatus === 'approved' ? 'Usulan Berhasil Disetujui' : 'Usulan Berhasil Ditolak',
        message: `Usulan "${proposal.title}" berhasil ${nextStatus === 'approved' ? 'disetujui' : 'ditolak'}.`,
      });

      await loadProposals(pagination?.current_page || 1);
    } catch (requestError) {
      const errorMsg = requestError.response?.data?.message || 'Gagal memperbarui status usulan.';
      setError(errorMsg);
      setAlertConfig({
        isOpen: true,
        type: 'error',
        eyebrow: 'Kurasi Gagal',
        title: 'Operasi Gagal',
        message: errorMsg,
      });
    } finally {
      setActiveId(null);
    }
  };

  // ================= CULTURES ACTIONS =================
  const handleToggleFeature = async (culture) => {
    const newFeatured = !culture.featured;
    setActiveCultureId(culture.id);

    try {
      await api.patch(
        `/admin/cultures/${culture.id}/feature`,
        { featured: newFeatured },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Perbarui state lokal
      setCultures((prev) =>
        prev.map((item) =>
          item.id === culture.id ? { ...item, featured: newFeatured } : item
        )
      );

      setAlertConfig({
        isOpen: true,
        type: 'success',
        eyebrow: 'Status Hero Diperbarui',
        title: newFeatured ? 'Jadikan Hero Aktif' : 'Hero Dinonaktifkan',
        message: newFeatured
          ? `"${culture.title}" kini tampil di rotasi Hero beranda.`
          : `"${culture.title}" dicabut dari rotasi Hero.`,
      });
    } catch (requestError) {
      const errorMsg = requestError.response?.data?.message || 'Gagal mengubah status hero budaya.';
      setAlertConfig({
        isOpen: true,
        type: 'error',
        eyebrow: 'Gagal Memperbarui',
        title: 'Operasi Gagal',
        message: errorMsg,
      });
    } finally {
      setActiveCultureId(null);
    }
  };

  const openEditModal = (culture) => {
    setEditModal({
      isOpen: true,
      culture,
    });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, culture: null });
  };

  const handleEditSuccess = (cultureTitle) => {
    setAlertConfig({
      isOpen: true,
      type: 'success',
      eyebrow: 'Katalog Budaya',
      title: 'Perubahan Disimpan',
      message: `Data budaya "${cultureTitle || 'terkait'}" berhasil diperbarui.`,
    });
    loadCultures(culturePagination?.current_page || 1, cultureSearch);
  };

  return (
    <section className="admin-page">
      <div className="admin-card">
        {/* Navigation Tabs */}
        <div className="admin-tabs" role="tablist" aria-label="Menu Admin">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'proposals'}
            className={`admin-tab ${activeTab === 'proposals' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('proposals')}
          >
            Verifikasi Usulan
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'cultures'}
            className={`admin-tab ${activeTab === 'cultures' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('cultures')}
          >
            Katalog Budaya & Hero
          </button>
        </div>

        {/* ================= TAB 1: VERIFIKASI PROPOSAL ================= */}
        {activeTab === 'proposals' && (
          <>
            <div className="admin-header">
              <div>
                <h1 className="admin-title">Panel Admin - Verifikasi Usulan</h1>
                <p className="admin-subtitle">Kelola usulan budaya dari pengguna.</p>
              </div>
              <select
                className="admin-filter"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                aria-label="Filter status usulan"
              >
                <option value="pending">Menunggu</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>

            {message && <div className="admin-message">{message}</div>}
            {error && <div className="admin-error">{error}</div>}

            {loading ? (
              <>
                <div className="admin-table-wrap" aria-busy="true" aria-label="Memuat usulan">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Usulan</th>
                        <th>Pengusul</th>
                        <th>Lokasi</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <tr key={idx} className="skeleton-card">
                          <td>
                            <div className="skeleton skeleton-text" style={{ width: '60%', height: '16px' }} />
                            <div className="skeleton skeleton-text" style={{ width: '80%', height: '12px', margin: 0 }} />
                          </td>
                          <td>
                            <div className="skeleton skeleton-text" style={{ width: '70%', height: '14px', margin: 0 }} />
                          </td>
                          <td>
                            <div className="skeleton skeleton-text" style={{ width: '60%', height: '14px', margin: 0 }} />
                          </td>
                          <td>
                            <div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '9999px' }} />
                          </td>
                          <td>
                            <div className="skeleton" style={{ width: '80px', height: '30px', borderRadius: '6px' }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-cards-mobile" aria-busy="true">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="admin-card-item skeleton-card">
                      <div className="skeleton skeleton-text" style={{ width: '60%', height: '18px', marginBottom: '8px' }} />
                      <div className="skeleton skeleton-text" style={{ width: '40%', height: '14px', marginBottom: '12px' }} />
                      <div className="skeleton skeleton-text" style={{ width: '80%', height: '14px' }} />
                      <div className="skeleton skeleton-text" style={{ width: '50%', height: '14px' }} />
                    </div>
                  ))}
                </div>
              </>
            ) : proposals.length === 0 ? (
              <div className="admin-empty">Tidak ada usulan dengan status ini.</div>
            ) : (
              <>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Usulan</th>
                        <th>Pengusul</th>
                        <th>Lokasi</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposals.map((proposal) => (
                        <tr key={proposal.id}>
                          <td>
                            <strong>{proposal.title}</strong>
                            <br />
                            <span>{proposal.category_name}</span>
                          </td>
                          <td>{proposal.user?.name || proposal.user?.email || '-'}</td>
                          <td>{proposal.province_name}</td>
                          <td>
                            <span className={`admin-status admin-status--${proposal.status}`}>
                              {statusLabels[proposal.status] || proposal.status}
                            </span>
                          </td>
                          <td>
                            {proposal.status === 'pending' ? (
                              <div className="admin-actions">
                                <button
                                  type="button"
                                  className="admin-button admin-button--approve"
                                  disabled={activeId === proposal.id}
                                  onClick={() => openVerifyModal(proposal, 'approved')}
                                >
                                  Setujui
                                </button>
                                <button
                                  type="button"
                                  className="admin-button admin-button--reject"
                                  disabled={activeId === proposal.id}
                                  onClick={() => openVerifyModal(proposal, 'rejected')}
                                >
                                  Tolak
                                </button>
                              </div>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-cards-mobile">
                  {proposals.map((proposal) => (
                    <div className="admin-card-item" key={proposal.id}>
                      <div className="admin-card-item__header">
                        <div>
                          <h2 className="admin-card-item__title">{proposal.title}</h2>
                          <span className="admin-card-item__category">{proposal.category_name}</span>
                        </div>
                        <span className={`admin-status admin-status--${proposal.status}`}>
                          {statusLabels[proposal.status] || proposal.status}
                        </span>
                      </div>

                      <div className="admin-card-item__meta">
                        <div className="admin-card-item__meta-row">
                          <span className="admin-card-item__meta-label">Pengusul</span>
                          <span className="admin-card-item__meta-value">{proposal.user?.name || proposal.user?.email || '-'}</span>
                        </div>
                        <div className="admin-card-item__meta-row">
                          <span className="admin-card-item__meta-label">Provinsi</span>
                          <span className="admin-card-item__meta-value">{proposal.province_name}</span>
                        </div>
                      </div>

                      {proposal.status === 'pending' && (
                        <div className="admin-card-item__actions">
                          <button
                            type="button"
                            className="admin-button admin-button--approve admin-button--full"
                            disabled={activeId === proposal.id}
                            onClick={() => openVerifyModal(proposal, 'approved')}
                          >
                            Setujui
                          </button>
                          <button
                            type="button"
                            className="admin-button admin-button--reject admin-button--full"
                            disabled={activeId === proposal.id}
                            onClick={() => openVerifyModal(proposal, 'rejected')}
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {pagination && pagination.last_page > 1 && (
                  <div className="admin-pagination">
                    <button
                      type="button"
                      disabled={!pagination.prev_page_url}
                      onClick={() => loadProposals(pagination.current_page - 1)}
                    >
                      Sebelumnya
                    </button>
                    <span>Halaman {pagination.current_page} dari {pagination.last_page}</span>
                    <button
                      type="button"
                      disabled={!pagination.next_page_url}
                      onClick={() => loadProposals(pagination.current_page + 1)}
                    >
                      Berikutnya
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ================= TAB 2: KATALOG BUDAYA ================= */}
        {activeTab === 'cultures' && (
          <>
            <div className="admin-header">
              <div>
                <h1 className="admin-title">Katalog Budaya & Pengaturan Hero</h1>
                <p className="admin-subtitle">Kelola budaya published dan atur gambar yang muncul pada rotasi Hero beranda.</p>
              </div>
            </div>

            <div className="admin-catalog-toolbar">
              <div className="admin-search-wrap">
                <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Cari judul budaya..."
                  value={cultureSearch}
                  onChange={(e) => setCultureSearch(e.target.value)}
                />
              </div>
            </div>

            {cultureLoading ? (
              <div className="admin-table-wrap" aria-busy="true" aria-label="Memuat budaya">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Budaya</th>
                      <th>Provinsi</th>
                      <th>Jadikan Hero</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="skeleton-card">
                        <td>
                          <div className="skeleton skeleton-text" style={{ width: '60%', height: '16px' }} />
                        </td>
                        <td>
                          <div className="skeleton skeleton-text" style={{ width: '50%', height: '14px' }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ width: '90px', height: '24px', borderRadius: '12px' }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ width: '60px', height: '30px', borderRadius: '6px' }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : cultures.length === 0 ? (
              <div className="admin-empty">Tidak ada budaya yang ditemukan.</div>
            ) : (
              <>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Budaya</th>
                        <th>Provinsi</th>
                        <th>Jadikan Hero</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cultures.map((culture) => (
                        <tr key={culture.id}>
                          <td>
                            <div className="admin-culture-cell">
                              <img
                                src={getImageUrl(culture.image)}
                                alt={culture.title}
                                className="admin-culture-thumb"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/images/dummy-budaya.svg';
                                }}
                              />
                              <div className="admin-culture-info">
                                <span className="admin-culture-title">{culture.title}</span>
                                <span className="admin-culture-cat">{culture.category?.name || '-'}</span>
                              </div>
                            </div>
                          </td>
                          <td>{culture.province?.name || '-'}</td>
                          <td>
                            <div className="admin-feature-toggle-cell">
                              <label
                                className="admin-switch"
                                title={culture.featured ? 'Aktif di Hero beranda' : 'Jadikan Hero beranda'}
                              >
                                <input
                                  type="checkbox"
                                  checked={Boolean(culture.featured)}
                                  disabled={activeCultureId === culture.id}
                                  onChange={() => handleToggleFeature(culture)}
                                />
                                <span className="admin-switch__slider" />
                              </label>
                              <span
                                className={`admin-feature-badge ${
                                  culture.featured ? 'admin-feature-badge--active' : ''
                                }`}
                              >
                                {culture.featured ? 'Hero Aktif' : 'Standar'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button
                                type="button"
                                className="admin-button admin-button--edit"
                                onClick={() => openEditModal(culture)}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards Alternative View for Cultures */}
                <div className="admin-cards-mobile">
                  {cultures.map((culture) => (
                    <div className="admin-card-item" key={culture.id}>
                      <div className="admin-card-item__header">
                        <div className="admin-culture-cell">
                          <img
                            src={getImageUrl(culture.image)}
                            alt={culture.title}
                            className="admin-culture-thumb"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/dummy-budaya.svg';
                            }}
                          />
                          <div className="admin-culture-info">
                            <h2 className="admin-card-item__title">{culture.title}</h2>
                            <span className="admin-card-item__category">{culture.category?.name || '-'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="admin-card-item__meta">
                        <div className="admin-card-item__meta-row">
                          <span className="admin-card-item__meta-label">Provinsi</span>
                          <span className="admin-card-item__meta-value">{culture.province?.name || '-'}</span>
                        </div>
                        <div className="admin-card-item__meta-row">
                          <span className="admin-card-item__meta-label">Status Hero</span>
                          <div className="admin-feature-toggle-cell">
                            <label className="admin-switch">
                              <input
                                type="checkbox"
                                checked={Boolean(culture.featured)}
                                disabled={activeCultureId === culture.id}
                                onChange={() => handleToggleFeature(culture)}
                              />
                              <span className="admin-switch__slider" />
                            </label>
                            <span
                              className={`admin-feature-badge ${
                                culture.featured ? 'admin-feature-badge--active' : ''
                              }`}
                            >
                              {culture.featured ? 'Hero Aktif' : 'Standar'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="admin-card-item__actions">
                        <button
                          type="button"
                          className="admin-button admin-button--edit admin-button--full"
                          onClick={() => openEditModal(culture)}
                        >
                          Edit Budaya
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {culturePagination && culturePagination.last_page > 1 && (
                  <div className="admin-pagination">
                    <button
                      type="button"
                      disabled={!culturePagination.prev_page_url}
                      onClick={() => loadCultures(culturePagination.current_page - 1, cultureSearch)}
                    >
                      Sebelumnya
                    </button>
                    <span>
                      Halaman {culturePagination.current_page} dari {culturePagination.last_page}
                    </span>
                    <button
                      type="button"
                      disabled={!culturePagination.next_page_url}
                      onClick={() => loadCultures(culturePagination.current_page + 1, cultureSearch)}
                    >
                      Berikutnya
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* ================= MODAL VERIFIKASI USULAN ================= */}
      {verifyModal.isOpen && verifyModal.proposal && (
        <div
          className="admin-modal-overlay"
          onClick={closeVerifyModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-modal-title"
        >
          <div
            className={`admin-modal-card admin-modal-card--${verifyModal.nextStatus}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={closeVerifyModal}
              disabled={Boolean(activeId)}
              aria-label="Tutup dialog"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="admin-modal-header">
              <div className={`admin-modal-icon-badge admin-modal-icon-badge--${verifyModal.nextStatus}`}>
                {verifyModal.nextStatus === 'approved' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                )}
              </div>
              <span className="admin-modal-eyebrow">
                {verifyModal.nextStatus === 'approved' ? 'Persetujuan Kurasi' : 'Penolakan Usulan'}
              </span>
              <h2 id="admin-modal-title" className="admin-modal-title">
                {verifyModal.nextStatus === 'approved' ? 'Setujui Usulan Budaya' : 'Tolak Usulan Budaya'}
              </h2>
            </div>

            <div className="admin-modal-target">
              <span className="admin-modal-target__label">Target Usulan</span>
              <p className="admin-modal-target__title">{verifyModal.proposal.title}</p>
              <div className="admin-modal-target__meta">
                <span>{verifyModal.proposal.category_name}</span>
                <span className="admin-modal-target__bullet">•</span>
                <span>{verifyModal.proposal.province_name}</span>
                <span className="admin-modal-target__bullet">•</span>
                <span>Pengusul: {verifyModal.proposal.user?.name || verifyModal.proposal.user?.email || '-'}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmVerify} className="admin-modal-form">
              <div className="admin-modal-field">
                <label htmlFor="admin-modal-note" className="admin-modal-label">
                  {verifyModal.nextStatus === 'approved' ? 'Catatan Kurasi (Opsional)' : 'Alasan Penolakan (Opsional)'}
                </label>
                <textarea
                  id="admin-modal-note"
                  className="admin-modal-textarea"
                  rows={3}
                  value={verifyModal.adminNote}
                  onChange={(e) => setVerifyModal((prev) => ({ ...prev, adminNote: e.target.value }))}
                  placeholder={
                    verifyModal.nextStatus === 'approved'
                      ? 'Tambahkan apresiasi atau catatan verifikasi...'
                      : 'Tuliskan alasan penolakan agar pengusul memahami catatan revisi...'
                  }
                  autoFocus
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-modal-btn admin-modal-btn--secondary"
                  onClick={closeVerifyModal}
                  disabled={Boolean(activeId)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`admin-modal-btn admin-modal-btn--${verifyModal.nextStatus}`}
                  disabled={Boolean(activeId)}
                >
                  {activeId === verifyModal.proposal.id ? (
                    <span className="admin-modal-btn__loading">
                      <span className="admin-modal-spinner" />
                      Memproses...
                    </span>
                  ) : verifyModal.nextStatus === 'approved' ? (
                    'Ya, Setujui Usulan'
                  ) : (
                    'Ya, Tolak Usulan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT BUDAYA & HERO ================= */}
      <EditCultureModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        cultureData={editModal.culture}
        provinces={provinces}
        categories={categories}
        onSuccess={handleEditSuccess}
      />

      {/* Alert Modal untuk Feedback Sukses / Error */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        eyebrow={alertConfig.eyebrow}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}
