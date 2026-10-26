import { ACCESS_LEVELS } from '../lib/roles';
import '../styles/AccessLevels.css';

// Kartu perbandingan hak akses Pengunjung / Kontributor / Admin.
// `currentKey` menandai peran pengguna yang sedang melihat halaman.
export default function AccessLevels({ currentKey }) {
  return (
    <div className="access-levels">
      {ACCESS_LEVELS.map((level) => {
        const isCurrent = level.key === currentKey;
        return (
          <div
            key={level.key}
            className={`access-level access-level--${level.key} ${isCurrent ? 'access-level--current' : ''}`}
          >
            <div className="access-level__head">
              <span className={`role-badge role-badge--${level.key}`}>{level.label}</span>
              {isCurrent && <span className="access-level__you">Peran Anda</span>}
            </div>
            <p className="access-level__desc">{level.description}</p>
            <ul className="access-level__list">
              {level.permissions.map((permission) => (
                <li key={permission}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {permission}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
