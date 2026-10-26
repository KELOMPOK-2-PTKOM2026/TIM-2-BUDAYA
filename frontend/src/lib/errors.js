// Helper untuk menerjemahkan respons error API (Laravel) menjadi pesan yang mudah dipahami pengguna.

// Ambil daftar error per kolom dari respons validasi 422: { field: 'pesan pertama' }
export function getFieldErrors(error) {
  const errors = error?.response?.data?.errors;
  if (!errors || typeof errors !== 'object') return {};

  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : String(messages),
    ])
  );
}

// Detik tunggu dari header Retry-After (jika di-expose oleh server), null jika tidak ada.
export function getRetryAfterSeconds(error) {
  const header = error?.response?.headers?.['retry-after'];
  const seconds = parseInt(header, 10);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

export function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} detik`;
  if (seconds === 0) return `${minutes} menit`;
  return `${minutes} menit ${seconds} detik`;
}

// Pesan umum berdasarkan jenis kegagalan. `fallback` dipakai bila server tidak memberi pesan.
export function getApiErrorMessage(error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') {
  if (!error?.response) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.';
  }

  const { status, data } = error.response;

  if (status === 429) {
    const retryAfter = getRetryAfterSeconds(error);
    return retryAfter
      ? `Terlalu banyak permintaan. Silakan tunggu ${formatDuration(retryAfter)} sebelum mencoba lagi.`
      : 'Terlalu banyak permintaan dalam waktu singkat. Silakan tunggu beberapa saat sebelum mencoba lagi.';
  }

  if (status === 422) {
    const fieldErrors = Object.values(getFieldErrors(error));
    return fieldErrors[0] || data?.message || fallback;
  }

  if (status === 401) {
    return 'Sesi Anda telah berakhir. Silakan masuk kembali.';
  }

  if (status === 403) {
    return data?.message || 'Anda tidak memiliki hak akses untuk melakukan tindakan ini.';
  }

  if (status === 413) {
    return 'Ukuran berkas yang diunggah terlalu besar.';
  }

  if (status >= 500) {
    return 'Server sedang mengalami gangguan. Silakan coba beberapa saat lagi.';
  }

  return data?.message || fallback;
}
