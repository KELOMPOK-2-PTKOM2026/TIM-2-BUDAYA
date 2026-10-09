import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import '../styles/ProfilePage.css';

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
    const missing = requiredByStep[step].some((field) => !String(form[field]).trim());
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
    <>
      {message && <div className={`alert-message ${message.type}`} role="status">{message.text}</div>}
      <form className="proposal-form" onSubmit={(event) => handleSubmit(event, 'pending')}>
        <ol aria-label="Langkah pengajuan" className="proposal-steps">
          {['Info Dasar', 'Detail & Media', 'Konfirmasi'].map((label, index) => (
            <li key={label} aria-current={step === index + 1 ? 'step' : undefined}>
              <span>{index + 1}.</span> {label}
            </li>
          ))}
        </ol>

        {step === 1 && (
          <section aria-labelledby="proposal-step-1">
            <h2 id="proposal-step-1">Info Dasar</h2>
            <div className="form-group">
              <label htmlFor="proposal-title">Nama budaya</label>
              <input id="proposal-title" name="title" value={form.title} onChange={handleChange} required maxLength="255" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="proposal-province">Provinsi</label>
                <select id="proposal-province" name="province_name" value={form.province_name} onChange={handleChange} required>
                  <option value="">Pilih provinsi</option>
                  {provinces.map((province) => <option key={province.id || province.name} value={province.name}>{province.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="proposal-category">Kategori</label>
                <select id="proposal-category" name="category_name" value={form.category_name} onChange={handleChange} required>
                  <option value="">Pilih kategori</option>
                  {categories.map((category) => <option key={category.id || category.name} value={category.name}>{category.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="proposal-description">Deskripsi singkat</label>
              <textarea id="proposal-description" name="description" rows="4" value={form.description} onChange={handleChange} required />
            </div>
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="proposal-step-2">
            <h2 id="proposal-step-2">Detail &amp; Media</h2>
            <div className="form-group">
              <label htmlFor="proposal-history">Sejarah lengkap</label>
              <textarea id="proposal-history" name="history" rows="6" value={form.history} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="proposal-facts">Fakta menarik (satu fakta per baris)</label>
              <textarea id="proposal-facts" name="facts" rows="4" value={form.facts} onChange={handleChange} placeholder="Satu fakta per baris" />
            </div>
            <div className="form-group">
              <label htmlFor="proposal-source">Sumber rujukan</label>
              <textarea id="proposal-source" name="source" rows="3" value={form.source} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="proposal-images">Gambar (maksimal 5, tiap file di bawah 5 MB)</label>
              <input id="proposal-images" name="images" type="file" multiple accept="image/*" onChange={handleImagesChange} />
              {images.length > 0 && <small>{images.length} gambar dipilih.</small>}
            </div>
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="proposal-step-3">
            <h2 id="proposal-step-3">Konfirmasi</h2>
            <p>Pastikan informasi dan sumber rujukan sudah benar sebelum mengirim.</p>
            <div className="form-group">
              <label>
                <input name="copyright_consent" type="checkbox" checked={form.copyright_consent} onChange={handleChange} required />
                Saya memiliki hak atau izin untuk membagikan materi ini.
              </label>
            </div>
          </section>
        )}

        <div className="proposal-wizard-actions">
          {step > 1 && <button className="proposal-submit-btn" type="button" onClick={() => { setMessage(null); setStep((current) => current - 1); }}>Kembali</button>}
          {step < 3 ? (
            <button className="proposal-submit-btn" type="button" onClick={goNext}>Lanjut</button>
          ) : (
            <>
              <button className="proposal-submit-btn" type="button" disabled={submitting} onClick={(event) => handleSubmit(event, 'draft')}>
                {submitting ? 'Menyimpan...' : 'Simpan sebagai Draf'}
              </button>
              <button className="proposal-submit-btn" type="submit" disabled={submitting}>
                {submitting ? 'Mengirim...' : 'Kirim Usulan'}
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
}
