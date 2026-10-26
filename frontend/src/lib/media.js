const STORAGE_URL = process.env.REACT_APP_STORAGE_URL || 'http://localhost:8000/storage/';

// Ilustrasi pengganti per kategori, dipakai bila budaya belum memiliki foto asli.
const CATEGORY_PLACEHOLDERS = {
  tarian: '/images/dummy-tarian.svg',
  'seni-pertunjukan': '/images/dummy-tarian.svg',
  musik: '/images/dummy-musik.svg',
  kuliner: '/images/dummy-kuliner.svg',
  upacara: '/images/dummy-upacara.svg',
  'adat-dan-tradisi': '/images/dummy-upacara.svg',
  kerajinan: '/images/dummy-kerajinan.svg',
  'pakaian-adat': '/images/dummy-kerajinan.svg',
};

export const DEFAULT_PLACEHOLDER = '/images/dummy-budaya.svg';

const isPlaceholder = (path) => /\/images\/dummy-[a-z]+\.svg$/.test(path || '');

export function getPlaceholder(category) {
  return CATEGORY_PLACEHOLDERS[category?.slug] || DEFAULT_PLACEHOLDER;
}

export function resolveImageUrl(path, category) {
  // Data lama menyimpan ilustrasi dummy yang tidak selalu sesuai kategori; ganti dengan yang cocok.
  if (!path || isPlaceholder(path)) return getPlaceholder(category);
  if (path.startsWith('http') || path.startsWith('/images/')) return path;
  return `${STORAGE_URL}${path}`;
}

// Semua foto asli milik sebuah budaya (gambar utama + galeri), tanpa duplikat dan tanpa ilustrasi dummy.
export function getCultureGallery(culture) {
  const paths = [culture?.image, ...(Array.isArray(culture?.images) ? culture.images : [])]
    .filter((path) => path && !isPlaceholder(path));
  return [...new Set(paths)].map((path) => resolveImageUrl(path, culture?.category));
}

// Pasang di <img onError> agar gambar yang gagal dimuat diganti ilustrasi kategori.
export function handleImageError(category) {
  return (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = getPlaceholder(category);
  };
}
