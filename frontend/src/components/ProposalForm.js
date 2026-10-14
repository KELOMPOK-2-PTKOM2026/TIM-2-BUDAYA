import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import '../styles/ProposalForm.css';

const emptyForm = {
  title: '',
  province_name: '',
  category_name: '',
  description: '',
  history: '',
  facts: '',
  source: '',
  copyright_consent: false,
};
const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const STEPS = [
  { id: 1, label: 'Info Dasar' },
  { id: 2, label: 'Detail & Media' },
  { id: 3, label: 'Konfirmasi' },
];

export default function ProposalForm() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(emptyForm);
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!user) return;

    Promise.all([api.get('/provinces'), api.get('/categories')])
      .then(([provinceResponse, categoryResponse]) => {
        setProvinces(provinceResponse.data.data || provinceResponse.data || []);
        setCategories(categoryResponse.data.data || categoryResponse.data || []);
      })
      .catch(() => setMessage({ type: 'error', text: 'Pilihan provinsi dan kategori gagal dimuat.' }));
  }, [user]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImagesChange = (event) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length > MAX_IMAGES) {
      setImages([]);
      event.target.value = '';
      setMessage({ type: 'error', text: 'Pilih maksimal 5 gambar.' });
      return;
    }
    const oversized = selected.find((file) => file.size >= MAX_IMAGE_SIZE);
    if (oversized) {
      setImages([]);
      event.target.value = '';
      setMessage({ type: 'error', text: 'Ukuran setiap gambar harus kurang dari 5 MB.' });
      return;
    }
    setImages(selected);
    setMessage(null);
  };

  const goNext = () => {
    const requiredByStep = {
      1: ['title', 'province_name', 'category_name', 'description'],
      2: [],
    };
    const missing = requiredByStep[step]?.some((field) => !String(form[field]).trim());
    if (missing) {
      setMessage({ type: 'error', text: 'Lengkapi semua kolom wajib pada langkah ini.' });
      return;
    }
    setMessage(null);
    setStep((current) => current + 1);
  };

  const handleSubmit = async (event, status) => {
    event.preventDefault();
    if (!form.copyright_consent) {
      setMessage({ type: 'error', text: 'Persetujuan hak cipta wajib dicentang.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'facts') {
        const facts = value.split('\n').map((fact) => fact.trim()).filter(Boolean);
        facts.forEach((fact, index) => payload.append(`facts[${index}]`, fact));
      } else if (key === 'copyright_consent') {
        payload.append(key, value ? 1 : 0);
      } else {
        payload.append(key, String(value));
      }
    });
    payload.append('status', status);
    images.forEach((image) => payload.append('images[]', image));

    try {
      await api.post('/proposals', payload);
      setForm(emptyForm);
      setImages([]);
      setStep(1);
      setMessage({
        type: 'success',
        text: status === 'draft' ? 'Draf berhasil disimpan.' : 'Usulan berhasil dikirim dan menunggu verifikasi admin.',
      });
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      const firstError = validationErrors && Object.values(validationErrors)[0]?.[0];
      setMessage({ type: 'error', text: firstError || error.response?.data?.message || 'Ajuan gagal disimpan.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="proposal-form__container">
      {/* 2. Visual Stepper */}
      <div className="proposal-stepper" aria-label="Langkah pengajuan budaya">
        {STEPS.map((s, idx) => {
          const isActive = step >= s.id;
          const isCurrent = step === s.id;
          const isCompleted = step > s.id;
          const hasNextLine = idx < STEPS.length - 1;
          const nextLineActive = step > s.id;

          return (
            <div
              key={s.id}
              className={`proposal-stepper__step ${isActive ? 'proposal-stepper__step--active' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="proposal-stepper__circle">
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  s.id
                )}
              </div>
              <span className="proposal-stepper__label">{s.label}</span>
              {hasNextLine && (
                <div
                  className={`proposal-stepper__line ${nextLineActive ? 'proposal-stepper__line--active' : ''}`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Message / Notification */}
      {message && (
        <div className={`proposal-form__alert proposal-form__alert--${message.type}`} role="status">
          {message.type === 'success' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 3. Form Card */}
      <div className="proposal-form__card">
        <form className="proposal-form" onSubmit={(event) => handleSubmit(event, 'pending')}>
          {step === 1 && (
            <section aria-labelledby="step-title-1">
              <div className="proposal-form__header">
                <h2 id="step-title-1" className="proposal-form__title">Informasi Dasar Budaya</h2>
                <p className="proposal-form__subtitle">Lengkapi identitas, asal daerah, dan intisari dari warisan budaya yang ingin diajukan.</p>
              </div>

              <div className="proposal-form__group">
                <label htmlFor="proposal-title" className="proposal-form__label">
                  Nama Budaya <span className="proposal-form__required">*</span>
                </label>
                <input
                  id="proposal-title"
                  name="title"
                  className="proposal-form__input"
                  placeholder="Contoh: Tari Saman, Rumah Gadang, Pempek Palembang"
                  value={form.title}
                  onChange={handleChange}
                  required
                  maxLength="255"
                />
              </div>

              {/* 4. Dropdown Grid Side-by-Side */}
              <div className="proposal-form__row">
                <div className="proposal-form__group">
                  <label htmlFor="proposal-province" className="proposal-form__label">
                    Provinsi Asal <span className="proposal-form__required">*</span>
                  </label>
                  <select
                    id="proposal-province"
                    name="province_name"
                    className="proposal-form__input proposal-form__select"
                    value={form.province_name}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih Provinsi --</option>
                    {provinces.map((province) => (
                      <option key={province.id || province.name} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="proposal-form__group">
                  <label htmlFor="proposal-category" className="proposal-form__label">
                    Kategori Budaya <span className="proposal-form__required">*</span>
                  </label>
                  <select
                    id="proposal-category"
                    name="category_name"
                    className="proposal-form__input proposal-form__select"
                    value={form.category_name}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((category) => (
                      <option key={category.id || category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="proposal-form__group">
                <label htmlFor="proposal-description" className="proposal-form__label">
                  Deskripsi Singkat <span className="proposal-form__required">*</span>
                </label>
                <textarea
                  id="proposal-description"
                  name="description"
                  className="proposal-form__input proposal-form__textarea"
                  rows="4"
                  placeholder="Ringkasan umum mengenai tradisi atau warisan budaya ini (maksimal 2-3 paragraf)..."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="step-title-2">
              <div className="proposal-form__header">
                <h2 id="step-title-2" className="proposal-form__title">Detail, Narasi &amp; Dokumentasi</h2>
                <p className="proposal-form__subtitle">Berikan konteks sejarah, fakta menarik, serta berkas foto dokumentasi pendukung.</p>
              </div>

              <div className="proposal-form__group">
                <label htmlFor="proposal-history" className="proposal-form__label">
                  Sejarah &amp; Asal-usul Lengkap <span className="proposal-form__required">*</span>
                </label>
                <textarea
                  id="proposal-history"
                  name="history"
                  className="proposal-form__input proposal-form__textarea"
                  rows="6"
                  placeholder="Ceritakan latar belakang sejarah, filosofi, makna tradisi, dan perkembangannya..."
                  value={form.history}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="proposal-form__group">
                <label htmlFor="proposal-facts" className="proposal-form__label">
                  Fakta Menarik <span className="proposal-form__hint">(Satu fakta per baris)</span>
                </label>
                <textarea
                  id="proposal-facts"
                  name="facts"
                  className="proposal-form__input proposal-form__textarea"
                  rows="4"
                  placeholder="Pernah diakui UNESCO pada tahun ...&#10;Hanya ditarikan oleh penari ganjil ...&#10;Menggunakan rempah khas ..."
                  value={form.facts}
                  onChange={handleChange}
                />
              </div>

              <div className="proposal-form__group">
                <label htmlFor="proposal-source" className="proposal-form__label">
                  Sumber Rujukan / Referensi <span className="proposal-form__required">*</span>
                </label>
                <textarea
                  id="proposal-source"
                  name="source"
                  className="proposal-form__input proposal-form__textarea"
                  rows="3"
                  placeholder="Buku, jurnal, arsip dinas kebudayaan, atau tautan artikel rujukan..."
                  value={form.source}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="proposal-form__group">
                <label htmlFor="proposal-images" className="proposal-form__label">
                  Foto Dokumentasi <span className="proposal-form__hint">(Maksimal 5 foto, &lt; 5MB per file)</span>
                </label>
                <div className="proposal-form__file-box">
                  <input
                    id="proposal-images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImagesChange}
                    className="proposal-form__file-input"
                  />
                  <label htmlFor="proposal-images" className="proposal-form__file-label">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4542E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="proposal-form__file-title">Pilih atau seret berkas foto ke sini</span>
                    <span className="proposal-form__file-desc">Mendukung format JPG, PNG, atau WebP</span>
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="proposal-form__file-badge">
                    ✓ <strong>{images.length}</strong> gambar berhasil dipilih.
                  </div>
                )}
              </div>
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="step-title-3">
              <div className="proposal-form__header">
                <h2 id="step-title-3" className="proposal-form__title">Konfirmasi &amp; Pengiriman</h2>
                <p className="proposal-form__subtitle">Tinjau ringkasan data sebelum usulan diverifikasi oleh tim kurator.</p>
              </div>

              <div className="proposal-form__summary">
                <div className="proposal-form__summary-row">
                  <span className="proposal-form__summary-label">Nama Budaya</span>
                  <span className="proposal-form__summary-value proposal-form__summary-value--highlight">{form.title || '-'}</span>
                </div>
                <div className="proposal-form__summary-row">
                  <span className="proposal-form__summary-label">Provinsi &amp; Kategori</span>
                  <span className="proposal-form__summary-value">{form.province_name || '-'} &bull; {form.category_name || '-'}</span>
                </div>
                <div className="proposal-form__summary-row">
                  <span className="proposal-form__summary-label">Lampiran Media</span>
                  <span className="proposal-form__summary-value">{images.length > 0 ? `${images.length} berkas foto terlampir` : 'Tidak ada foto dilampirkan'}</span>
                </div>
              </div>

              <div className="proposal-form__consent-box">
                <label className="proposal-form__consent-label">
                  <input
                    name="copyright_consent"
                    type="checkbox"
                    checked={form.copyright_consent}
                    onChange={handleChange}
                    required
                    className="proposal-form__checkbox"
                  />
                  <span className="proposal-form__consent-text">
                    Saya menyatakan bahwa informasi dan materi yang diajukan adalah akurat, bebas dari pelanggaran hak cipta, dan memberikan hak kepada Jelajah Sumatera untuk mempublikasikannya.
                  </span>
                </label>
              </div>
            </section>
          )}

          {/* 5. Navigation Actions */}
          <div className={`proposal-form__actions ${step === 1 ? 'proposal-form__actions--end' : 'proposal-form__actions--between'}`}>
            {step > 1 && (
              <button
                type="button"
                className="proposal-form__btn proposal-form__btn--secondary"
                onClick={() => {
                  setMessage(null);
                  setStep((current) => current - 1);
                }}
              >
                &larr; Kembali
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                className="btn-primary proposal-form__btn proposal-form__btn--primary"
                onClick={goNext}
              >
                Lanjut &rarr;
              </button>
            ) : (
              <div className="proposal-form__action-group">
                <button
                  type="button"
                  className="proposal-form__btn proposal-form__btn--draft"
                  disabled={submitting}
                  onClick={(event) => handleSubmit(event, 'draft')}
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Draf'}
                </button>
                <button
                  type="submit"
                  className="btn-primary proposal-form__btn proposal-form__btn--primary"
                  disabled={submitting}
                >
                  {submitting ? 'Mengirim...' : 'Kirim Usulan'}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
