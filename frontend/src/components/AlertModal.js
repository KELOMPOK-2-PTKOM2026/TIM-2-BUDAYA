import { useEffect, useRef } from 'react';
import '../styles/AlertModal.css';

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  eyebrow,
  type = 'warning',
  confirmText = 'Saya Mengerti',
  secondaryText,
  onSecondary,
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Auto-focus tombol utama saat modal muncul
    const timer = setTimeout(() => {
      confirmBtnRef.current?.focus();
    }, 50);

    // Kunci scroll body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle ESC key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Ikon SVG berdasarkan type
  const renderIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      case 'success':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case 'info':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
      case 'warning':
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
    }
  };

  const defaultEyebrow = {
    warning: 'Perhatian',
    error: 'Kendala Terjadi',
    success: 'Berhasil',
    info: 'Informasi',
  }[type] || 'Perhatian';

  const defaultTitle = {
    warning: 'Persetujuan Diperlukan',
    error: 'Terjadi Kesalahan',
    success: 'Aksi Berhasil',
    info: 'Pemberitahuan',
  }[type] || 'Perhatian';

  return (
    <div
      className="alert-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
    >
      <div
        className={`alert-modal-card alert-modal-card--${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup Silang */}
        <button
          type="button"
          className="alert-modal-close"
          onClick={onClose}
          aria-label="Tutup dialog"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header dengan Badge Ikon */}
        <div className="alert-modal-header">
          <div className={`alert-modal-icon-badge alert-modal-icon-badge--${type}`}>
            {renderIcon()}
          </div>
          <span className="alert-modal-eyebrow">
            {eyebrow || defaultEyebrow}
          </span>
          <h2 id="alert-modal-title" className="alert-modal-title">
            {title || defaultTitle}
          </h2>
        </div>

        {/* Konten Pesan */}
        <div className="alert-modal-body">
          {typeof message === 'string' ? (
            <p className="alert-modal-text">{message}</p>
          ) : (
            message
          )}
        </div>

        {/* Aksi Tombol */}
        <div className="alert-modal-actions">
          {secondaryText && (
            <button
              type="button"
              className="alert-modal-btn-secondary"
              onClick={() => {
                if (onSecondary) onSecondary();
                else onClose();
              }}
            >
              {secondaryText}
            </button>
          )}
          <button
            ref={confirmBtnRef}
            type="button"
            className={`alert-modal-btn-primary alert-modal-btn-primary--${type}`}
            onClick={onClose}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
