import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import { getApiErrorMessage, getFieldErrors } from '../lib/errors';
import { compressImage } from '../lib/media';
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
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const TITLE_MIN = 5;
const TITLE_MAX = 100;
const DESCRIPTION_MIN = 30;

const STEPS = [
  { id: 1, label: 'Info Dasar' },
  { id: 2, label: 'Detail & Media' },
  { id: 3, label: 'Konfirmasi' },
];

// Kolom yang divalidasi pada tiap langkah (dipakai juga untuk lompat ke langkah yang error dari server)
const FIELDS_BY_STEP = {
  1: ['title', 'province_name', 'category_name', 'description'],
  2: ['history', 'source', 'images'],
  3: ['copyright_consent'],
};

function validateField(field, form) {
  const value = typeof form[field] === 'string' ? form[field].trim() : form[field];

  switch (field) {
    case 'title':
      if (!value) return 'Nama budaya wajib diisi.';
      if (value.length < TITLE_MIN) return `Nama budaya terlalu pendek. Minimal ${TITLE_MIN} karakter (saat ini ${value.length}).`;
      if (value.length > TITLE_MAX) return `Nama budaya terlalu panjang. Maksimal ${TITLE_MAX} karakter (saat ini ${value.length}).`;
      if (!/[A-Za-z]/.test(value)) return 'Nama budaya harus mengandung huruf, tidak boleh hanya angka atau simbol.';
      return null;
    case 'province_name':
      return value ? null : 'Pilih provinsi asal budaya.';
    case 'category_name':
      return value ? null : 'Pilih kategori budaya.';
    case 'description':
      if (!value) return 'Deskripsi singkat wajib diisi.';
      if (value.length < DESCRIPTION_MIN) return `Deskripsi terlalu singkat. Minimal ${DESCRIPTION_MIN} karakter (saat ini ${value.length}).`;
      return null;
    case 'history':
      return value ? null : 'Sejarah & asal-usul wajib diisi.';
    case 'source':
      return value ? null : 'Sumber rujukan wajib diisi agar ajuan dapat diverifikasi.';
    case 'copyright_consent':
      return value ? null : 'Persetujuan hak cipta wajib dicentang sebelum mengirim.';
    default:
      return null;
  }
}

function validateStep(step, form) {
  return FIELDS_BY_STEP[step].reduce((errors, field) => {
    const message = validateField(field, form);
    return message ? { ...errors, [field]: message } : errors;
  }, {});
}

const FieldError = ({ id, message }) =>
  message ? (
    <span id={id} className="proposal-form__error" role="alert">
      {message}
    </span>
  ) : null;

export default function ProposalForm() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(emptyForm);
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) return;

    Promise.all([api.get('/provinces'), api.get('/categories')])
      .then(([provinceResponse, categoryResponse]) => {
        setProvinces(provinceResponse.data.data || provinceResponse.data || []);
        setCategories(categoryResponse.data.data || categoryResponse.data || []);
      })
      .catch((error) => setMessage({
        type: 'error',
        text: `Pilihan provinsi dan kategori gagal dimuat. ${getApiErrorMessage(error)}`,
      }));
  }, [user]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    const nextForm = { ...form, [name]: type === 'checkbox' ? checked : value };
    setForm(nextForm);
    // Validasi ulang secara langsung hanya jika kolom ini sebelumnya sudah ditandai error
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: validateField(name, nextForm) }));
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    if (!form[name] && !errors[name]) return;
    setErrors((current) => ({ ...current, [name]: validateField(name, form) }));
  };

  const handleImagesChange = (event) => {
    const selected = Array.from(event.target.files || []);
    const rejectSelection = (text) => {
      setImages([]);
      event.target.value = '';
      setErrors((current) => ({ ...current, images: text }));
    };

    if (selected.length > MAX_IMAGES) {
      rejectSelection(`Terlalu banyak foto (${selected.length} dipilih). Maksimal ${MAX_IMAGES} foto.`);
      return;
    }
    const invalidType = selected.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type));
    if (invalidType) {
      rejectSelection(`Format berkas "${invalidType.name}" tidak didukung. Gunakan JPG, PNG, atau WebP.`);
      return;
    }
    const oversized = selected.find((file) => file.size >= MAX_IMAGE_SIZE);
    if (oversized) {
      rejectSelection(`Ukuran "${oversized.name}" melebihi batas. Setiap foto harus kurang dari 5 MB.`);
      return;
    }
    setImages(selected);
    setErrors((current) => ({ ...current, images: null }));
  };

  const goNext = () => {
    const stepErrors = validateStep(step, form);
    setErrors((current) => ({ ...current, ...stepErrors }));
    if (Object.keys(stepErrors).length > 0) {
      setMessage({ type: 'error', text: 'Masih ada kolom yang belum sesuai. Periksa pesan berwarna merah di bawah.' });
      return;
    }
    setMessage(null);
    setStep((current) => current + 1);
  };

  const handleSubmit = async (event, status) => {
    event.preventDefault();
    if (submitting) return;

    // Validasi ulang semua langkah (mis. jika pengguna kembali dan mengubah data)
    const allErrors = { ...validateStep(1, form), ...validateStep(2, form), ...validateStep(3, form) };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstStep = [1, 2, 3].find((s) => FIELDS_BY_STEP[s].some((field) => allErrors[field]));
      setStep(firstStep);
      setMessage({ type: 'error', text: 'Masih ada kolom yang belum sesuai. Periksa pesan berwarna merah di bawah.' });
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
        payload.append(key, String(value).trim());
      }
    });
    payload.append('status', status);
    const compressedImages = await Promise.all(images.map((image) => compressImage(image)));
    compressedImages.forEach((image) => payload.append('images[]', image));

    try {
      await api.post('/proposals', payload);
      setForm(emptyForm);
      setImages([]);
      setErrors({});
      setStep(1);
      setMessage({
        type: 'success',
        text: status === 'draft' ? 'Draf berhasil disimpan.' : 'Usulan berhasil dikirim dan menunggu verifikasi admin.',
      });
    } catch (error) {
      const serverErrors = getFieldErrors(error);
      // Error per foto dari Laravel berbentuk "images.0" -> tampilkan di kolom foto
      const mapped = Object.fromEntries(
        Object.entries(serverErrors).map(([field, msg]) => [field.startsWith('images') ? 'images' : field, msg])
      );
      const errorStep = [1, 2, 3].find((s) => FIELDS_BY_STEP[s].some((field) => mapped[field]));

      if (errorStep) {
        setErrors(mapped);
        setStep(errorStep);
      }
      setMessage({
        type: 'error',
        text: error.response?.status === 429
          ? 'Anda terlalu sering mengirim ajuan. Batas pengiriman adalah 5 ajuan per menit, silakan tunggu sekitar 1 menit lalu coba lagi.'
          : getApiErrorMessage(error, 'Ajuan gagal disimpan. Silakan coba lagi.'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  const inputClass = (field, extra = '') =>
    `proposal-form__input ${extra} ${errors[field] ? 'proposal-form__input--invalid' : ''}`.trim();
  const errorProps = (field) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `proposal-${field}-error` : undefined,
    onBlur: handleBlur,
  });
  const titleLength = form.title.trim().length;
  const titleCounterState =
    titleLength === 0 ? '' : titleLength < TITLE_MIN || titleLength > TITLE_MAX ? 'invalid' : 'valid';

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
        <form className="proposal-form" onSubmit={(event) => handleSubmit(event, 'pending')} noValidate>
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
                  className={inputClass('title')}
                  placeholder="Contoh: Tari Saman, Rumah Gadang, Pempek Palembang"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={TITLE_MAX + 20}
                  {...errorProps('title')}
                />
                <div className="proposal-form__field-meta">
                  {errors.title ? (
                    <FieldError id="proposal-title-error" message={errors.title} />
                  ) : (
                    <span className="proposal-form__hint">Panjang judul {TITLE_MIN}–{TITLE_MAX} karakter.</span>
                  )}
                  <span className={`proposal-form__counter proposal-form__counter--${titleCounterState}`}>
                    {titleLength}/{TITLE_MAX}
                  </span>
                </div>
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
                    className={inputClass('province_name', 'proposal-form__select')}
                    value={form.province_name}
                    onChange={handleChange}
                    {...errorProps('province_name')}
                  >
                    <option value="">-- Pilih Provinsi --</option>
                    {provinces.map((province) => (
                      <option key={province.id || province.name} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  <FieldError id="proposal-province_name-error" message={errors.province_name} />
                </div>

                <div className="proposal-form__group">
                  <label htmlFor="proposal-category" className="proposal-form__label">
                    Kategori Budaya <span className="proposal-form__required">*</span>
                  </label>
                  <select
                    id="proposal-category"
                    name="category_name"
                    className={inputClass('category_name', 'proposal-form__select')}
                    value={form.category_name}
                    onChange={handleChange}
                    {...errorProps('category_name')}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((category) => (
                      <option key={category.id || category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <FieldError id="proposal-category_name-error" message={errors.category_name} />
                </div>
              </div>

              <div className="proposal-form__group">
                <label htmlFor="proposal-description" className="proposal-form__label">
                  Deskripsi Singkat <span className="proposal-form__required">*</span>
                </label>
                <textarea
                  id="proposal-description"
                  name="description"
                  className={inputClass('description', 'proposal-form__textarea')}
                  rows="4"
                  placeholder="Ringkasan umum mengenai tradisi atau warisan budaya ini (maksimal 2-3 paragraf)..."
                  value={form.description}
                  onChange={handleChange}
                  {...errorProps('description')}
                />
                <FieldError id="proposal-description-error" message={errors.description} />
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
                  className={inputClass('history', 'proposal-form__textarea')}
                  rows="6"
                  placeholder="Ceritakan latar belakang sejarah, filosofi, makna tradisi, dan perkembangannya..."
                  value={form.history}
                  onChange={handleChange}
                  {...errorProps('history')}
                />
                <FieldError id="proposal-history-error" message={errors.history} />
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
                  className={inputClass('source', 'proposal-form__textarea')}
                  rows="3"
                  placeholder="Buku, jurnal, arsip dinas kebudayaan, atau tautan artikel rujukan..."
                  value={form.source}
                  onChange={handleChange}
                  {...errorProps('source')}
                />
                <FieldError id="proposal-source-error" message={errors.source} />
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
                    accept="image/jpeg,image/png,image/webp"
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
                <FieldError id="proposal-images-error" message={errors.images} />
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
                    className="proposal-form__checkbox"
                    aria-invalid={Boolean(errors.copyright_consent)}
                    aria-describedby={errors.copyright_consent ? 'proposal-copyright_consent-error' : undefined}
                  />
                  <span className="proposal-form__consent-text">
                    Saya menyatakan bahwa informasi dan materi yang diajukan adalah akurat, bebas dari pelanggaran hak cipta, dan memberikan hak kepada Jelajah Sumatera untuk mempublikasikannya.
                  </span>
                </label>
                <FieldError id="proposal-copyright_consent-error" message={errors.copyright_consent} />
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
