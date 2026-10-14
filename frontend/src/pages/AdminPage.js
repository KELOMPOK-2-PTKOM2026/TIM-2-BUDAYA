import { useCallback, useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminPage.css';

const statusLabels = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
};

export default function AdminPage() {
  const { token } = useAuth();
  const [status, setStatus] = useState('pending');
  const [proposals, setProposals] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  const verifyProposal = async (id, nextStatus) => {
    const adminNote = window.prompt(
      nextStatus === 'approved' ? 'Catatan admin (opsional):' : 'Alasan penolakan (opsional):',
      '',
    );

    if (adminNote === null) return;

    setActiveId(id);
    setError('');
    setMessage('');

    try {
      const response = await api.post(
        `/admin/proposals/${id}/verify`,
        { status: nextStatus, admin_note: adminNote },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage(response.data.message || 'Status usulan berhasil diperbarui.');
      await loadProposals(pagination?.current_page || 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Gagal memperbarui status usulan.');
    } finally {
      setActiveId(null);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-card">
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
                              onClick={() => verifyProposal(proposal.id, 'approved')}
                            >
                              Setujui
                            </button>
                            <button
                              type="button"
                              className="admin-button admin-button--reject"
                              disabled={activeId === proposal.id}
                              onClick={() => verifyProposal(proposal.id, 'rejected')}
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
      </div>
    </section>
  );
}
