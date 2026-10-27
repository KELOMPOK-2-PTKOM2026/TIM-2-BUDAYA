const STORAGE_BASE = (process.env.REACT_APP_STORAGE_URL || 'http://localhost:8000/storage/').replace(/\/+$/, '');

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
  const cleanPath = path.replace(/^\/?storage\//, '').replace(/^\//, '');
  return `${STORAGE_BASE}/${cleanPath}`;
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

/**
 * Kompresi dan konversi gambar ke WebP sisi browser via HTML5 Canvas.
 * WebP menghasilkan ukuran 25-35% lebih kecil dibanding JPEG pada kualitas setara, serta mendukung transparansi.
 *
 * ponytail: toBlob('image/webp') didukung semua browser modern. Browser lawas otomatis fallback ke format default.
 */
export function compressImage(
  file,
  { maxWidth = 1600, maxHeight = 1600, quality = 0.82, format = 'image/webp' } = {}
) {
  return new Promise((resolve) => {
    if (
      !file ||
      typeof window === 'undefined' ||
      !file.type ||
      !file.type.startsWith('image/') ||
      file.type === 'image/svg+xml' ||
      file.type === 'image/gif'
    ) {
      return resolve(file);
    }

    // Lewati jika file sudah WebP dan ukurannya kecil (<= 250 KB)
    if (file.type === 'image/webp' && file.size <= 250 * 1024) {
      return resolve(file);
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(file);
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file);
          }
          if (blob.size >= file.size && file.type === 'image/webp') {
            return resolve(file);
          }
          const isWebp = blob.type === 'image/webp';
          const extension = isWebp ? '.webp' : '.jpg';
          const newName = file.name.replace(/\.[^.]+$/, '') + extension;
          const compressedFile = new File([blob], newName, {
            type: blob.type || format,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        format,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
