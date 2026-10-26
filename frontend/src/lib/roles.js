// Definisi hak akses tiap jenis pengguna, dipakai untuk menampilkan peran secara konsisten di seluruh halaman.

export const ACCESS_LEVELS = [
  {
    key: 'guest',
    label: 'Pengunjung',
    description: 'Belum masuk ke akun',
    permissions: [
      'Melihat dan mencari informasi budaya',
      'Membaca detail, sejarah, dan galeri budaya',
    ],
  },
  {
    key: 'user',
    label: 'Kontributor',
    description: 'Pengguna terdaftar & terverifikasi',
    permissions: [
      'Semua akses Pengunjung',
      'Mengajukan budaya baru untuk dikurasi',
      'Memantau status ajuan di halaman profil',
    ],
  },
  {
    key: 'admin',
    label: 'Admin',
    description: 'Tim kurator Jelajah Sumatera',
    permissions: [
      'Semua akses Kontributor',
      'Memverifikasi (menyetujui/menolak) ajuan',
      'Mengelola katalog budaya',
    ],
  },
];

export function getAccessLevel(user) {
  const key = !user ? 'guest' : user.role === 'admin' ? 'admin' : 'user';
  return ACCESS_LEVELS.find((level) => level.key === key);
}
