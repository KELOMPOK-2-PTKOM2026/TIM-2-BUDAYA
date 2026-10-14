// file: d:\PTKOM\Baru\TIM-2-BUDAYA\frontend\src\pages\ProfilePage.js
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import '../styles/ProfilePage.css';

const statusLabels = {
  pending: 'Menunggu verifikasi',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  draft: 'Draf',
};

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    api.get('/proposals/mine')
      .then((response) => {
        if (!isMounted) return;
        const list = Array.isArray(response.data)
          ? response.data
          : (response.data?.data || []);
        setProposals(list);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.response?.status === 401) {
          setError('Sesi telah berakhir atau tidak valid. Silakan masuk kembali.');
        } else {
          setError(err.response?.data?.message || 'Gagal memuat riwayat ajuan budaya.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <section className="profile-page">
      <header className="profile-header">
        <h1 className="profile-title">Profil Saya</h1>
        <p className="profile-subtitle">Kelola akun dan pantau riwayat ajuan budaya Anda.</p>
      </header>

      {!user ? (
        <div className="profile-card" style={{ textAlign: 'center', padding: '36px 20px' }}>
          <p style={{ color: '#556b62', marginBottom: '16px' }}>
            Anda belum masuk atau sesi Anda telah berakhir.
          </p>
          <Link to="/login" className="proposal-submit-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Masuk ke Akun
          </Link>
        </div>
      ) : (
        <div className="profile-layout">
          <div className="profile-card">
            <h2 className="profile-card__title">Informasi Akun</h2>
            <div className="profile-info-group">
              <span className="profile-info-label">Nama</span>
              <div className="profile-info-value">{user?.name}</div>
            </div>
            <div className="profile-info-group">
              <span className="profile-info-label">Email</span>
              <div className="profile-info-value">{user?.email}</div>
            </div>
            <div className="profile-info-group">
              <span className="profile-info-label">Role</span>
              <div className="profile-info-value">{user?.role}</div>
            </div>
          </div>

          <div>
            <section className="proposals-history">
              <h2 className="profile-card__title">Riwayat Ajuan</h2>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div className="proposal-item skeleton-card" key={idx}>
                      <div style={{ flex: 1 }}>
                        <div className="skeleton skeleton-text" style={{ width: '45%', height: '18px' }} />
                        <div className="skeleton skeleton-text" style={{ width: '30%', height: '12px' }} />
                        <div className="skeleton skeleton-text" style={{ width: '85%', height: '14px' }} />
                      </div>
                      <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '9999px' }} />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div style={{ color: '#991b1b', background: '#fee2e2', padding: '12px 16px', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontWeight: 500 }}>{error}</p>
                  {error.includes('masuk') && (
                    <Link to="/login" style={{ display: 'inline-block', marginTop: '8px', color: '#C4542E', fontWeight: 600 }}>
                      Ke Halaman Masuk &rarr;
                    </Link>
                  )}
                </div>
              ) : proposals.length === 0 ? (
                <p>Belum ada ajuan budaya.</p>
              ) : (
                proposals.map((proposal) => (
                  <article className="proposal-item" key={proposal.id}>
                    <div>
                      <h3 className="proposal-item-title">{proposal.title}</h3>
                      <p className="proposal-item-meta">
                        {proposal.province_name} · {proposal.category_name}
                        {proposal.created_at && ` · ${new Date(proposal.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      </p>
                      <p className="proposal-item-desc">{proposal.description}</p>
                      {proposal.admin_note && (
                        <p className="proposal-admin-note">Catatan admin: {proposal.admin_note}</p>
                      )}
                    </div>
                    <span className={`badge badge-${proposal.status}`}>
                      {statusLabels[proposal.status] || proposal.status}
                    </span>
                  </article>
                ))
              )}
            </section>
          </div>
        </div>
      )}
    </section>
  );
}
