// file: d:\PTKOM\Baru\TIM-2-BUDAYA\frontend\src\pages\ProfilePage.js
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import '../styles/ProfilePage.css';

const statusLabels = {
  pending: 'Menunggu verifikasi',
  approved: 'Disetujui',
  rejected: 'Ditolak',
};

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/proposals/mine')
      .then((response) => setProposals(response.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="profile-page">
      <header className="profile-header">
        <h1 className="profile-title">Profil Saya</h1>
        <p className="profile-subtitle">Kelola akun dan pantau riwayat ajuan budaya Anda.</p>
      </header>

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
            {loading ? <p>Memuat riwayat...</p> : proposals.length === 0 ? <p>Belum ada ajuan budaya.</p> : proposals.map((proposal) => (
              <article className="proposal-item" key={proposal.id}>
                <div>
                  <h3 className="proposal-item-title">{proposal.title}</h3>
                  <p className="proposal-item-meta">{proposal.province_name} · {proposal.category_name}</p>
                  <p className="proposal-item-desc">{proposal.description}</p>
                  {proposal.admin_note && <p className="proposal-admin-note">Catatan admin: {proposal.admin_note}</p>}
                </div>
                <span className={`badge badge-${proposal.status}`}>
                  {statusLabels[proposal.status] || proposal.status}
                </span>
              </article>
            ))}
          </section>
        </div>
      </div>
    </section>
  );
}
