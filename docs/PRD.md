# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# JELAJAH SUMATERA — TIM-2-BUDAYA

**Versi Dokumen:** 1.0.0
**Status:** Dokumen acuan utama pengembangan
**Jenis Produk:** Website dokumentasi dan publikasi kebudayaan berbasis crowdsourcing terkurasi
**Target Platform:** Web responsif
**Arsitektur:** Decoupled Monorepo
**Bahasa Utama:** Bahasa Indonesia

---

## 1. Ringkasan Produk

Jelajah Sumatera adalah platform digital untuk mendokumentasikan, menjelajahi, dan mempublikasikan keberagaman budaya dari 10 provinsi di Pulau Sumatera.

Platform menerapkan pendekatan crowdsourcing, yaitu masyarakat dapat mengusulkan informasi budaya untuk memperkaya dokumentasi. Seluruh usulan wajib melalui proses verifikasi administrator sebelum dapat ditampilkan sebagai informasi budaya resmi.

Jelajah Sumatera berfungsi sebagai media informasi dan edukasi budaya. Platform tidak bertujuan menjadi media sosial, marketplace, ensiklopedia yang sepenuhnya terbuka tanpa moderasi, atau platform yang menerbitkan kontribusi pengguna secara otomatis.

### 1.1 Tujuan utama

1. Menyediakan katalog budaya Sumatera yang mudah dijelajahi.
2. Menyediakan informasi budaya yang terstruktur berdasarkan provinsi dan kategori.
3. Memungkinkan pengguna terdaftar mengusulkan informasi budaya.
4. Memungkinkan administrator memverifikasi keakuratan, kelayakan, dan izin penggunaan materi.
5. Menjaga konsistensi, keamanan, dan kualitas data yang dipublikasikan.
6. Menyediakan pengalaman penggunaan yang responsif, sederhana, dan mudah dipelihara.

### 1.2 Prinsip produk

- **Kurasi sebelum publikasi:** usulan tidak langsung menjadi konten resmi.
- **Satu sumber kebenaran:** backend menjadi otoritas untuk data dan aturan bisnis.
- **Pemisahan tanggung jawab:** frontend mengelola tampilan dan interaksi; backend mengelola validasi, otorisasi, dan persistensi.
- **Transparansi:** pengguna dapat melihat status usulan miliknya.
- **Integritas data:** persetujuan tidak boleh menghasilkan data ganda atau data yang tidak lengkap.
- **Minimalisme fungsional:** tidak ada fitur di luar ruang lingkup tanpa persetujuan.
- **Pelestarian budaya:** informasi, atribusi sumber, dan izin penggunaan media harus ditangani secara bertanggung jawab.

---

## 2. Ruang Lingkup Produk

### 2.1 Fitur yang wajib dibangun — MVP

| ID   | Modul           | Fitur wajib                                                            |
| ---- | --------------- | ---------------------------------------------------------------------- |
| F-01 | Beranda         | Landing page, pengenalan platform, navigasi, dan konten budaya pilihan |
| F-02 | Eksplorasi      | Katalog budaya, pencarian, filter provinsi dan kategori, pagination    |
| F-03 | Detail budaya   | Informasi lengkap budaya yang telah dipublikasikan                     |
| F-04 | Tentang         | Informasi tujuan dan latar belakang platform                           |
| F-05 | Autentikasi     | Registrasi, login, logout, dan profil pengguna                         |
| F-06 | Kontribusi      | Formulir usulan budaya multi-langkah dan unggahan gambar               |
| F-07 | Riwayat usulan  | Daftar usulan milik pengguna beserta status dan catatan admin          |
| F-08 | Dashboard admin | Daftar, detail, dan penyaringan usulan masuk                           |
| F-09 | Moderasi        | Persetujuan dan penolakan usulan dengan catatan admin                  |
| F-10 | Publikasi       | Pemindahan usulan yang disetujui ke katalog budaya resmi               |
| F-11 | Data master     | Pengelolaan data provinsi dan kategori oleh admin                      |
| F-12 | Keamanan        | Validasi, otorisasi, proteksi unggahan, dan penanganan error           |
| F-13 | Pengujian       | Pengujian aturan bisnis, API, autentikasi, dan alur publikasi          |

Data master provinsi dan kategori harus dapat dikelola melalui backend. Antarmuka pengelolaannya termasuk dashboard admin sederhana, bukan sekadar kemampuan mengubah data langsung di database.

### 2.2 Fitur yang tidak termasuk MVP

Fitur berikut tidak boleh ditambahkan tanpa keputusan baru dari pemilik proyek:

- Komentar, forum diskusi, chat, dan pesan pribadi.
- Like, bookmark, follow, dan sistem pertemanan.
- Sistem poin, level, badge, dan leaderboard kontributor.
- AI untuk menulis, menerjemahkan, atau memverifikasi informasi budaya.
- Peta interaktif, geolokasi, dan petunjuk arah.
- Notifikasi email, WhatsApp, push notification, atau SMS.
- Integrasi media sosial otomatis.
- Aplikasi mobile native.
- Multi-bahasa.
- Analitik pengunjung tingkat lanjut dan pelacakan waktu membaca.
- Sistem pembayaran, iklan, dan monetisasi.
- Fitur edit artikel resmi melalui workflow editorial lanjutan.

Fitur yang belum tercantum di bagian MVP dianggap berada di luar ruang lingkup, kecuali diperlukan secara teknis untuk memenuhi fitur yang sudah disetujui.

---

## 3. Pengguna dan Hak Akses

Sistem memiliki tiga kondisi akses: pengunjung tanpa login, pengguna terdaftar, dan administrator.

### 3.1 Guest — pengunjung publik

Guest dapat:

- Membuka seluruh halaman publik.
- Menjelajahi katalog budaya.
- Melakukan pencarian dan filter.
- Membaca detail budaya yang berstatus terpublikasi.
- Membuka halaman Tentang.
- Membuka halaman login dan registrasi.

Guest tidak dapat mengirim usulan, melihat profil pengguna, melihat riwayat usulan, atau mengakses endpoint administrasi.

### 3.2 Registered User — pengguna terdaftar

Pengguna terdaftar dapat melakukan seluruh aktivitas Guest serta:

- Mengirim usulan budaya.
- Mengunggah media yang menjadi bagian dari usulan.
- Menyatakan persetujuan atas ketentuan penggunaan materi.
- Melihat daftar usulan miliknya.
- Melihat status dan catatan admin atas usulan miliknya.
- Mengakses dan memperbarui informasi profil yang diizinkan.

Pengguna tidak boleh melihat atau mengubah usulan milik pengguna lain. Pengguna juga tidak boleh menentukan status publikasi sendiri.

### 3.3 Admin — administrator

Admin memiliki kewenangan untuk:

- Mengakses dashboard admin.
- Melihat seluruh antrean usulan.
- Membuka detail usulan beserta media dan informasi sumber.
- Menyetujui atau menolak usulan.
- Menulis catatan verifikasi.
- Mengelola data master provinsi dan kategori.
- Melihat katalog budaya resmi.
- Mengelola konten resmi sesuai kemampuan yang secara eksplisit disediakan.

Admin tidak boleh mengakses password dalam bentuk teks, dan seluruh tindakan administratif harus melewati validasi serta otorisasi backend.

### 3.4 Matriks akses

| Aksi                            | Guest | User  | Admin                                         |
| ------------------------------- | ----- | ----- | --------------------------------------------- |
| Membaca budaya resmi            | Ya    | Ya    | Ya                                            |
| Mencari dan memfilter budaya    | Ya    | Ya    | Ya                                            |
| Mengirim usulan                 | Tidak | Ya    | Ya, sebagai tindakan terpisah jika diperlukan |
| Melihat riwayat usulan pribadi  | Tidak | Ya    | Ya                                            |
| Melihat seluruh usulan          | Tidak | Tidak | Ya                                            |
| Menyetujui/menolak usulan       | Tidak | Tidak | Ya                                            |
| Mengelola provinsi dan kategori | Tidak | Tidak | Ya                                            |

**Aturan penting:** status admin tidak boleh ditentukan dari input frontend, query parameter, atau data registrasi yang dikirim pengguna. Hak akses harus diverifikasi di backend berdasarkan akun yang terautentikasi.

---

## 4. Teknologi dan Arsitektur

### 4.1 Struktur teknologi

**Frontend**

- React 19.
- React Router untuk navigasi SPA.
- Tailwind CSS dan Custom CSS.
- JavaScript sebagai bahasa implementasi utama.
- Port pengembangan: `3000`.

**Backend**

- Laravel sebagai API server.
- PHP sesuai versi yang kompatibel dengan versi Laravel yang dipilih.
- Laravel Sanctum untuk autentikasi token.
- MySQL sebagai database relasional.
- Port pengembangan: `8000`.

**Arsitektur repositori**

- Frontend dan backend berada di satu repositori.
- Keduanya merupakan aplikasi terpisah.
- Komunikasi dilakukan melalui HTTP API dengan payload JSON, kecuali unggahan file yang menggunakan `multipart/form-data`.
- Tidak boleh ada koneksi database langsung dari frontend.

### 4.2 Catatan versi framework

PRD awal menetapkan Laravel 11. Namun, berdasarkan kebijakan dukungan resmi Laravel, dukungan perbaikan keamanan Laravel 11 berakhir pada 12 Maret 2026. Untuk proyek baru pada 2026, gunakan versi Laravel yang masih didukung, dengan Laravel 13 sebagai pilihan awal apabila seluruh dependensi kompatibel. Jika implementasi yang ada sudah menggunakan Laravel 11, lakukan evaluasi migrasi sebelum menetapkan versi final.

Referensi resmi: [https://laravel.com/docs/13.x/releases](https://laravel.com/docs/13.x/releases)

Keputusan versi harus dicatat dan dikunci. AI tidak boleh mengganti major version framework secara otomatis di tengah pengembangan.

### 4.3 Struktur repositori yang direkomendasikan

```
jelajah-sumatera/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   └── composer.json
├── docs/
│   ├── PRD.md
│   └── API.md
├── README.md
└── package.json
```

Struktur tersebut merupakan pedoman, bukan alasan untuk memindahkan atau membuat ulang seluruh struktur proyek yang sudah berjalan. Jika repositori memiliki struktur lain, AI wajib menginspeksi dan mengikuti struktur aktual terlebih dahulu.

### 4.4 Aturan komunikasi

- URL API frontend berasal dari environment configuration, bukan tersebar sebagai string hardcoded.
- URL backend lokal menggunakan port `8000` selama pengembangan, kecuali konfigurasi proyek menyatakan berbeda.
- Frontend tidak mengakses tabel database secara langsung.
- Backend menjadi sumber kebenaran untuk status, role, dan relasi data.
- CORS hanya mengizinkan origin yang diperlukan.
- Jangan menyimpan secret, password, token sensitif, atau kredensial database dalam repositori.
- Kontrak API harus terdokumentasi dan tidak berubah secara sepihak.

---

## 5. Spesifikasi Halaman Frontend

### 5.1 Landing Page — `/`

Menampilkan:

- Identitas dan tujuan Jelajah Sumatera.
- Navigasi utama.
- Pengantar keberagaman budaya Sumatera.
- Akses menuju halaman Eksplorasi.
- Beberapa budaya pilihan yang diambil dari data resmi.
- Tombol kontribusi yang mengarahkan pengguna sesuai status autentikasinya.

Konten budaya yang ditampilkan harus berasal dari data backend atau konten statis yang secara eksplisit disetujui. Jangan membuat data budaya fiktif untuk mengisi halaman.

### 5.2 Eksplorasi — `/eksplorasi`

Menampilkan katalog budaya resmi dalam bentuk kartu.

Setiap kartu minimal berisi:

- Gambar utama jika tersedia.
- Nama budaya.
- Provinsi.
- Kategori.
- Tautan menuju detail budaya.

Fitur:

- Pencarian berdasarkan nama budaya.
- Filter provinsi.
- Filter kategori.
- Pagination.
- Kondisi loading, error, dan data kosong.
- Filter yang dipilih harus tercermin pada data yang ditampilkan dan dapat dipertahankan selama navigasi halaman katalog.

Hanya data budaya yang telah dipublikasikan boleh ditampilkan.

### 5.3 Detail Budaya — `/budaya/:slug`

Menampilkan:

- Nama budaya.
- Gambar utama dan media tambahan jika tersedia.
- Provinsi asal.
- Kategori.
- Deskripsi.
- Sumber atau referensi informasi.
- Atribusi media jika diperlukan.
- Informasi metadata publik yang memang tersedia.

Jika slug tidak ditemukan atau budaya tidak lagi dipublikasikan, tampilkan halaman 404 atau keadaan tidak tersedia yang sesuai. Jangan menampilkan data usulan yang masih menunggu persetujuan.

### 5.4 Tentang — `/tentang`

Menjelaskan:

- Tujuan platform.
- Pentingnya dokumentasi budaya.
- Prinsip kontribusi masyarakat.
- Mekanisme verifikasi.
- Informasi tim atau pengelola jika sudah disediakan.

Jangan menciptakan klaim kemitraan, pengakuan institusi, atau dukungan resmi yang tidak diberikan oleh pemilik proyek.

### 5.5 Autentikasi — `/login` dan `/register`

Login:

- Email dan password.
- Validasi input.
- Pesan error yang jelas.
- Pengalihan berdasarkan role setelah login berhasil.

Registrasi:

- Nama.
- Email.
- Password.
- Konfirmasi password.

Role saat registrasi publik selalu ditetapkan oleh backend sebagai `user`. Registrasi publik tidak boleh menerima atau memproses permintaan untuk membuat akun admin.

### 5.6 Formulir Kontribusi — `/kontribusi`

Formulir multi-langkah menggunakan komponen `ProposalForm.js`, atau komponen pengganti yang mengikuti tanggung jawab dan kontrak yang sama jika struktur aktual proyek berbeda.

Rancangan langkah:

**Langkah 1 — Informasi dasar**

- Nama budaya.
- Provinsi.
- Kategori.

**Langkah 2 — Informasi budaya**

- Deskripsi budaya.
- Sumber atau referensi informasi.
- Informasi tambahan yang telah ditentukan dalam skema.

**Langkah 3 — Media**

- Unggah gambar.
- Preview gambar.
- Validasi format dan ukuran file.
- Pengisian atribusi atau sumber gambar jika diperlukan.

**Langkah 4 — Persetujuan dan pemeriksaan**

- Ringkasan seluruh input.
- Persetujuan ketentuan kontribusi.
- Persetujuan penggunaan atau publikasi media.
- Konfirmasi bahwa pengirim memiliki hak atau izin yang diperlukan.
- Tombol kirim usulan.

Aturan formulir:

- Pengguna tidak boleh melanjutkan jika validasi langkah saat ini gagal.
- Kembali ke langkah sebelumnya tidak boleh menghapus data yang telah diisi.
- Tombol kirim harus memiliki status loading untuk mencegah pengiriman berulang.
- Backend wajib memvalidasi ulang seluruh input.
- Persetujuan hak penggunaan harus dicatat di backend, termasuk waktu dan versi ketentuan yang disetujui.
- Jika pengiriman gagal, tampilkan pesan yang dapat ditindaklanjuti tanpa menghilangkan input yang masih tersedia di frontend.
- Usulan yang berhasil dikirim berstatus `pending`.

Penyimpanan draft lintas sesi atau lintas perangkat tidak termasuk MVP.

### 5.7 Profil dan Riwayat — `/profil`

Menampilkan:

- Informasi profil pengguna.
- Daftar usulan milik pengguna.
- Nama usulan.
- Tanggal pengajuan.
- Status terbaru.
- Catatan admin jika tersedia.

Pengguna hanya boleh melihat data yang terkait dengan akun terautentikasinya. Frontend tidak boleh menentukan kepemilikan berdasarkan ID yang dapat dimanipulasi.

### 5.8 Dashboard Admin — `/admin`

Menampilkan:

- Ringkasan jumlah usulan berdasarkan status.
- Daftar usulan.
- Filter status.
- Pencarian berdasarkan nama budaya atau pengusul jika diperlukan.
- Detail usulan.
- Media dan referensi sumber.
- Tombol setujui dan tolak.
- Kolom catatan admin.

Ringkasan dashboard harus dihitung dari data backend. Dashboard bukan sekadar angka statis atau data mock.

Jika usulan ditolak, catatan penolakan wajib diberikan. Jika usulan disetujui, admin harus mendapat konfirmasi tindakan dan sistem harus memastikan publikasi berhasil sebelum menampilkan status sukses.

---

## 6. Aturan Bisnis Inti

### BR-01 — Publikasi budaya

Hanya data pada tabel `cultures` yang memenuhi kondisi publikasi yang boleh muncul di katalog publik.

### BR-02 — Status usulan

Status yang diperbolehkan:

- `pending`: menunggu verifikasi.
- `approved`: disetujui.
- `rejected`: ditolak.

Nilai status lain tidak boleh diterima tanpa perubahan spesifikasi yang disetujui.

### BR-03 — Pengiriman usulan

- Setiap usulan memiliki pemilik yang berasal dari pengguna terautentikasi.
- Pemilik usulan ditentukan oleh backend, bukan dari `user_id` yang dikirim frontend.
- Usulan baru dimulai dengan status `pending`.
- Pengguna tidak boleh mengirim status persetujuan atau catatan admin sebagai data yang berwenang.
- Usulan wajib melewati validasi input dan media.

### BR-04 — Persetujuan usulan

Saat admin menyetujui usulan:

1. Backend memeriksa identitas dan role admin.
2. Backend memeriksa bahwa usulan tersedia dan masih berstatus `pending`.
3. Backend memvalidasi ulang kelayakan data yang akan dipublikasikan.
4. Backend membuat satu record budaya resmi.
5. Backend memperbarui status usulan menjadi `approved`.
6. Backend mencatat admin yang memverifikasi serta waktu verifikasi.
7. Seluruh perubahan database dilakukan dalam satu transaksi.
8. Backend mengembalikan respons sukses hanya jika seluruh operasi berhasil.

Jika salah satu operasi gagal, perubahan database harus di-rollback. Usulan tidak boleh menjadi `approved` apabila record budaya resmi gagal dibuat.

Sistem harus mencegah persetujuan ganda akibat klik berulang atau dua permintaan admin secara bersamaan.

### BR-05 — Penolakan usulan

- Admin hanya boleh menolak usulan yang memenuhi aturan status.
- Catatan penolakan wajib diisi.
- Usulan tetap tersimpan di `culture_proposals`.
- Penolakan tidak membuat record pada `cultures`.
- Pengguna dapat melihat status dan catatan penolakan miliknya.

### BR-06 — Konsistensi data setelah publikasi

Usulan yang disetujui tidak boleh otomatis dihapus. Record usulan dipertahankan sebagai jejak proses kontribusi.

Simpan relasi yang memungkinkan sistem mengetahui asal-usul budaya resmi, misalnya `source_proposal_id` yang unik dan dapat bernilai null untuk data budaya yang dibuat melalui mekanisme administrasi lain yang sah.

### BR-07 — Tidak ada publikasi otomatis

Tidak ada endpoint, job, event, atau komponen frontend yang boleh memublikasikan usulan hanya karena formulir berhasil dikirim.

### BR-08 — Integritas budaya

- Nama budaya dan informasi yang diterbitkan harus melewati kurasi.
- Referensi sumber harus dipertahankan.
- Media tidak boleh dipublikasikan tanpa dasar izin penggunaan yang diwajibkan.
- Klaim mengenai tradisi, asal-usul, dan identitas budaya tidak boleh dibuat oleh AI tanpa sumber yang dapat diperiksa.

---

## 7. Spesifikasi Database

Nama tabel berikut merupakan nama logis. Implementasi aktual harus diselaraskan dengan migrasi yang sudah ada.

### 7.1 Tabel `users`

Kolom minimum:

- `id`
- `name`
- `email` — unik
- `password`
- `role` — `user` atau `admin`
- `created_at`
- `updated_at`

Password harus di-hash menggunakan mekanisme Laravel. Password teks biasa tidak boleh disimpan atau dikembalikan melalui API.

### 7.2 Tabel `provinces`

Kolom minimum:

- `id`
- `name`
- `slug` — unik
- `description` — opsional
- `created_at`
- `updated_at`

Data master MVP harus mencakup 10 provinsi di Pulau Sumatera berdasarkan keputusan cakupan geografis proyek. Data seed harus diperiksa sebelum dianggap final.

### 7.3 Tabel `categories`

Kolom minimum:

- `id`
- `name`
- `slug` — unik
- `description` — opsional
- `created_at`
- `updated_at`

Kategori awal dapat mencakup tarian tradisional, alat musik, kuliner, pakaian adat, rumah adat, dan kategori lain yang secara eksplisit disetujui.

Jangan menanamkan daftar kategori secara terpisah di banyak komponen frontend. Gunakan data master dari API.

### 7.4 Tabel `cultures`

Kolom minimum:

- `id`
- `province_id` — foreign key
- `category_id` — foreign key
- `source_proposal_id` — foreign key unik, nullable jika budaya bukan berasal dari usulan
- `name`
- `slug` — unik
- `description`
- `image_path` — nullable jika gambar tidak tersedia
- `source_reference`
- `media_attribution` — sesuai kebutuhan
- `published_at`
- `created_at`
- `updated_at`

Tabel ini menyimpan konten resmi yang dapat diakses publik.

### 7.5 Tabel `culture_proposals`

Kolom minimum:

- `id`
- `user_id` — foreign key
- `province_id` — foreign key
- `category_id` — foreign key
- `name`
- `description`
- `source_reference`
- `image_path` — nullable jika media belum diwajibkan
- `media_attribution` — sesuai kebutuhan
- `copyright_consent`
- `consent_version`
- `consented_at`
- `status`
- `admin_note` — nullable
- `reviewed_by` — foreign key ke users, nullable
- `reviewed_at` — nullable
- `created_at`
- `updated_at`

Kolom dan tipe data final harus mengikuti migrasi serta kebutuhan validasi yang telah disepakati.

### 7.6 Relasi

- Satu `User` memiliki banyak `CultureProposal`.
- Satu `Province` memiliki banyak `Culture`.
- Satu `Category` memiliki banyak `Culture`.
- Satu `Province` memiliki banyak `CultureProposal`.
- Satu `Category` memiliki banyak `CultureProposal`.
- Satu `CultureProposal` dapat menghasilkan paling banyak satu `Culture`.
- Satu `User` dengan role admin dapat meninjau banyak usulan.

### 7.7 Aturan integritas database

- Gunakan foreign key untuk relasi penting.
- Gunakan unique index untuk email, slug, dan sumber proposal yang relevan.
- Gunakan transaksi untuk proses persetujuan.
- Hindari penghapusan cascade yang dapat menghilangkan riwayat kontribusi tanpa sengaja.
- Jangan menyimpan daftar ID terkait sebagai teks jika relasi database lebih tepat.
- Gunakan migration untuk perubahan skema.
- Jangan melakukan perubahan database produksi secara manual tanpa migration dan rencana pemulihan.
- Seed data tidak boleh menghapus atau menimpa data pengguna yang sudah ada.

---

## 8. Kontrak API

Seluruh endpoint menggunakan prefix `/api`.

Respons JSON harus konsisten. Bentuk minimum yang direkomendasikan:

Respons sukses:

```json
{
  "message": "Operasi berhasil",
  "data": {}
}
```

Respons validasi gagal:

```json
{
  "message": "Data yang dikirim tidak valid",
  "errors": {
    "name": ["Nama budaya wajib diisi."]
  }
}
```

Respons error harus menggunakan HTTP status code yang tepat. Struktur di atas adalah kontrak respons; bentuk `data` dapat berbeda sesuai endpoint dan harus didokumentasikan.

### 8.1 Endpoint publik

| Method | Endpoint               | Fungsi                     |
| ------ | ---------------------- | -------------------------- |
| GET    | `/api/provinces`       | Daftar provinsi            |
| GET    | `/api/categories`      | Daftar kategori            |
| GET    | `/api/cultures`        | Katalog budaya resmi       |
| GET    | `/api/cultures/{slug}` | Detail budaya resmi        |
| POST   | `/api/register`        | Registrasi akun            |
| POST   | `/api/login`           | Login dan penerbitan token |

Endpoint katalog mendukung parameter yang diperlukan, seperti `page`, `per_page`, `search`, `province_id`, dan `category_id`. Parameter tambahan hanya ditambahkan jika dibutuhkan dan didokumentasikan.

### 8.2 Endpoint pengguna terautentikasi

| Method | Endpoint              | Fungsi                               |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/api/me`             | Profil pengguna terautentikasi       |
| POST   | `/api/logout`         | Mencabut token yang sedang digunakan |
| POST   | `/api/proposals`      | Mengirim usulan baru                 |
| GET    | `/api/proposals/mine` | Riwayat usulan milik pengguna        |

Pengiriman usulan menggunakan `multipart/form-data` jika terdapat file gambar. Implementasi harus mendokumentasikan nama field dan format payload secara tepat.

### 8.3 Endpoint admin

| Method    | Endpoint                           | Fungsi                      |
| --------- | ---------------------------------- | --------------------------- |
| GET       | `/api/admin/proposals`             | Daftar seluruh usulan       |
| GET       | `/api/admin/proposals/{id}`        | Detail usulan               |
| POST      | `/api/admin/proposals/{id}/verify` | Verifikasi usulan           |
| GET       | `/api/admin/provinces`             | Daftar data master provinsi |
| POST      | `/api/admin/provinces`             | Membuat provinsi            |
| PUT/PATCH | `/api/admin/provinces/{id}`        | Memperbarui provinsi        |
| GET       | `/api/admin/categories`            | Daftar data master kategori |
| POST      | `/api/admin/categories`            | Membuat kategori            |
| PUT/PATCH | `/api/admin/categories/{id}`       | Memperbarui kategori        |

Jika endpoint penghapusan data master dibutuhkan, perilakunya harus ditentukan terlebih dahulu agar tidak merusak relasi data.

Payload verifikasi minimum:

```json
{
  "action": "approve",
  "admin_note": "Informasi telah diverifikasi."
}
```

Untuk penolakan:

```json
{
  "action": "reject",
  "admin_note": "Sumber informasi perlu dilengkapi."
}
```

Backend hanya menerima `approve` atau `reject`. Aturan validasi catatan, batas panjang, dan status transisi harus diterapkan di server.

### 8.4 HTTP status code

| Kode  | Penggunaan                          |
| ----- | ----------------------------------- |
| `200` | Permintaan berhasil                 |
| `201` | Record berhasil dibuat              |
| `401` | Belum terautentikasi                |
| `403` | Tidak memiliki hak akses            |
| `404` | Resource tidak ditemukan            |
| `409` | Konflik status atau operasi         |
| `422` | Validasi gagal                      |
| `429` | Batas permintaan terlampaui         |
| `500` | Kesalahan server yang tidak terduga |

Respons `500` tidak boleh membocorkan stack trace, kredensial, atau detail internal kepada pengguna.

### 8.5 Pagination dan filter

Respons endpoint koleksi harus memiliki metadata pagination yang konsisten, misalnya:

- Data pada halaman saat ini.
- Nomor halaman.
- Jumlah data per halaman.
- Jumlah keseluruhan.
- Informasi halaman berikutnya jika tersedia.

Batas maksimum `per_page` harus ditentukan di backend. Frontend tidak boleh meminta data tanpa batas untuk menggantikan pagination.

---

## 9. Autentikasi dan Keamanan

### 9.1 Autentikasi token

- Login mengembalikan token Sanctum sesuai skema yang ditetapkan.
- Frontend mengirim token melalui header `Authorization: Bearer <token>`.
- Endpoint terlindungi harus menggunakan middleware autentikasi.
- Logout mencabut token yang sedang digunakan.
- Token tidak boleh dimasukkan ke URL, log, pesan error, atau source code.
- Penyimpanan token di frontend harus mengikuti model ancaman yang disepakati. Jangan menyimpan token jangka panjang di `localStorage` secara otomatis tanpa evaluasi risiko XSS.

### 9.2 Otorisasi

- Endpoint admin harus memiliki middleware role atau policy yang tepat.
- Menyembunyikan tombol admin di React bukan kontrol keamanan yang memadai.
- Endpoint `/api/proposals/mine` wajib membatasi hasil berdasarkan pengguna yang sedang login.
- Endpoint detail dan verifikasi admin wajib memeriksa izin sebelum melakukan perubahan.
- Role tidak boleh dapat diubah melalui endpoint profil publik.

### 9.3 Keamanan unggahan

- Batasi format gambar yang diperbolehkan.
- Validasi MIME type dan ukuran file di backend.
- Jangan percaya pada ekstensi file atau validasi frontend saja.
- Gunakan nama file yang aman dan dibuat oleh server.
- Hindari mengeksekusi file yang diunggah sebagai kode.
- Batasi akses ke file yang belum disetujui.
- Media usulan yang belum disetujui tidak boleh otomatis tersedia melalui URL publik yang dapat ditebak.
- Jangan menghapus file yang masih digunakan oleh budaya resmi.

### 9.4 Proteksi tambahan

- Rate limiting pada login, registrasi, dan pengiriman usulan.
- Validasi dan normalisasi input.
- Query database menggunakan mekanisme ORM atau query binding yang aman.
- Pencegahan mass assignment dengan allowlist field yang dapat diisi.
- Pengaturan CORS secara eksplisit.
- Perlindungan terhadap IDOR, yaitu akses ke data pengguna lain melalui manipulasi ID.
- Pengelolaan secret melalui environment variables.
- Logging operasional tanpa mencatat password, token, atau data sensitif.
- Pesan error publik tidak boleh mengungkap keberadaan detail internal yang tidak diperlukan.

---

## 10. Standar UI/UX

### 10.1 Prinsip visual

Antarmuka harus:

- Responsif untuk desktop, tablet, dan ponsel.
- Konsisten pada warna, tipografi, spacing, tombol, kartu, dan formulir.
- Mengutamakan keterbacaan teks budaya.
- Menggunakan gambar yang relevan dan memiliki izin.
- Memiliki navigasi yang jelas dan pola interaksi yang konsisten.

AI tidak boleh mengganti keseluruhan desain atau design system ketika diminta memperbaiki satu komponen, kecuali perubahan tersebut memang diperlukan dan disetujui.

### 10.2 Keadaan antarmuka

Setiap halaman yang mengambil data dari API harus menangani:

- Loading.
- Error.
- Data kosong.
- Data berhasil dimuat.
- Validasi gagal.
- Sesi berakhir.
- Akses ditolak.

Jangan menggunakan data mock sebagai pengganti API pada fitur yang dinyatakan selesai.

### 10.3 Aksesibilitas

- Input memiliki label.
- Tombol memiliki nama tindakan yang jelas.
- Fokus keyboard terlihat.
- Kontras teks memadai.
- Pesan validasi tidak hanya mengandalkan warna.
- Gambar informatif memiliki teks alternatif yang relevan.
- Navigasi dasar dapat digunakan tanpa mouse.

---

## 11. Standar Implementasi Kode

### 11.1 Frontend

- Pisahkan halaman, komponen, service API, dan utilitas sesuai tanggung jawab.
- Hindari duplikasi fungsi pemanggilan API.
- Gunakan satu konfigurasi dasar API.
- Pisahkan state formulir dari state autentikasi.
- Hindari menempatkan seluruh logika bisnis di satu komponen besar.
- Jangan membuat komponen generik yang berlebihan untuk kebutuhan yang hanya muncul sekali.
- Jangan mengganti seluruh library atau routing tanpa alasan yang jelas.
- Tangani kegagalan request dan status autentikasi secara konsisten.

### 11.2 Backend

- Gunakan route, controller, request validation, model, policy, dan service sesuai kompleksitas fitur.
- Validasi data melalui mekanisme Laravel.
- Gunakan transaksi database pada proses publikasi.
- Hindari menempatkan seluruh logika bisnis dalam controller yang terlalu besar.
- Terapkan mass-assignment protection.
- Gunakan eager loading jika diperlukan untuk menghindari N+1 query.
- Gunakan API Resource atau mekanisme serialisasi yang konsisten.
- Jangan mengembalikan seluruh atribut model secara otomatis jika tidak diperlukan.

### 11.3 Pengelolaan dependensi

- Jangan menambahkan package tanpa kebutuhan yang jelas.
- Periksa kompatibilitas versi PHP, Laravel, Sanctum, React, dan dependensi lain.
- Jangan memperbarui semua dependensi sekaligus saat memperbaiki satu bug.
- Jangan mengganti package manager tanpa persetujuan.
- File lock seperti `composer.lock` dan lockfile npm harus dipertahankan sesuai package manager proyek.

---

## 12. Testing dan Kriteria Penerimaan

Fitur hanya dianggap selesai setelah kriteria yang relevan berikut terpenuhi.

### 12.1 Autentikasi

- Pengguna dapat mendaftar dengan input valid.
- Email duplikat ditolak.
- Password disimpan dalam bentuk hash.
- Login dengan kredensial valid berhasil.
- Login dengan kredensial salah ditolak.
- Token tidak memberikan akses setelah dicabut.
- Pengguna biasa tidak dapat mengakses endpoint admin.
- Pengguna publik tidak dapat menetapkan role admin melalui payload.

### 12.2 Katalog budaya

- Hanya budaya yang sudah dipublikasikan tampil di katalog.
- Pencarian dan filter menghasilkan data sesuai parameter.
- Pagination berfungsi.
- Detail budaya dapat dibuka menggunakan slug.
- Slug yang tidak ditemukan menghasilkan respons yang tepat.
- Kegagalan API ditampilkan sebagai keadaan error yang jelas.

### 12.3 Kontribusi

- Form multi-langkah memvalidasi input pada setiap tahap.
- Data yang telah diisi tetap tersedia ketika pengguna kembali ke langkah sebelumnya.
- File yang tidak sesuai aturan ditolak oleh backend.
- Pengguna wajib menyetujui ketentuan yang diwajibkan.
- Pengajuan sukses membuat satu usulan berstatus `pending`.
- Pengguna tidak dapat menetapkan status usulan menjadi `approved`.
- Pengguna tidak dapat membaca riwayat milik pengguna lain.

### 12.4 Moderasi dan publikasi

- Admin dapat melihat daftar dan detail usulan.
- Admin dapat menyetujui usulan yang masih `pending`.
- Persetujuan menghasilkan satu budaya resmi dan memperbarui usulan menjadi `approved`.
- Persetujuan ganda tidak menghasilkan budaya duplikat.
- Kegagalan publikasi membatalkan seluruh perubahan transaksi.
- Admin dapat menolak usulan dengan catatan.
- Usulan yang ditolak tidak muncul di katalog publik.
- Pengguna dapat melihat status terbaru dan catatan admin.
- Permintaan verifikasi oleh pengguna biasa ditolak.

### 12.5 Database dan regresi

- Migration dapat dijalankan pada database pengujian yang bersih.
- Foreign key dan unique constraint berfungsi.
- Seeder dapat digunakan tanpa merusak data yang tidak terkait.
- Perubahan fitur tidak merusak endpoint yang sudah ada.
- Tidak terdapat error kritis pada console browser atau log server untuk alur yang diuji.

### 12.6 Standar penyelesaian

Setiap fitur harus memiliki:

1. Implementasi frontend yang terhubung ke API jika diperlukan.
2. Implementasi backend dan validasi.
3. Penanganan loading, error, dan kondisi kosong yang relevan.
4. Pengujian otomatis atau langkah pengujian manual yang terdokumentasi.
5. Dokumentasi kontrak API apabila ada endpoint baru atau perubahan.
6. Konfirmasi bahwa fitur lain yang sudah berjalan tidak rusak.

---

## 13. Strategi Pengembangan Bertahap

Pengembangan dilakukan dalam urutan berikut. AI tidak boleh melewati fondasi yang belum stabil demi mengejar fitur lanjutan.

### Tahap 0 — Audit proyek aktual

- Baca README dan dokumentasi.
- Periksa struktur frontend dan backend.
- Periksa versi dependensi.
- Periksa migration, model, route, controller, dan komponen yang sudah ada.
- Identifikasi fitur yang sudah berfungsi, belum lengkap, atau rusak.
- Susun daftar gap terhadap PRD ini.

**Output:** laporan audit dan rencana perubahan. Jangan langsung menulis ulang proyek.

### Tahap 1 — Fondasi aplikasi

- Konfigurasi environment.
- Koneksi database.
- Migration dan model.
- Konfigurasi CORS dan API.
- Autentikasi serta otorisasi dasar.
- Seeder data master.

**Syarat lanjut:** aplikasi berjalan dan tes dasar berhasil.

### Tahap 2 — Katalog publik

- Beranda.
- Eksplorasi.
- Pencarian dan filter.
- Detail budaya.
- Halaman Tentang.

**Syarat lanjut:** data katalog berasal dari API dan hanya menampilkan budaya resmi.

### Tahap 3 — Kontribusi pengguna

- Form multi-langkah.
- Validasi.
- Unggah media.
- Persetujuan hak penggunaan.
- Riwayat usulan.

**Syarat lanjut:** usulan tersimpan dengan status awal `pending` dan hanya pemilik yang dapat mengakses riwayatnya.

### Tahap 4 — Dashboard admin

- Daftar dan detail usulan.
- Filter antrean.
- Persetujuan dan penolakan.
- Catatan admin.
- Pengelolaan data master.

**Syarat lanjut:** seluruh aturan publikasi dan kontrol akses lolos pengujian.

### Tahap 5 — Stabilisasi

- Pengujian integrasi.
- Pengujian keamanan dasar.
- Pengujian responsif.
- Perbaikan bug.
- Dokumentasi instalasi dan API.
- Pemeriksaan kesiapan deployment.

Fitur tambahan tidak menjadi alasan untuk menunda penyelesaian bug kritis pada tahap yang sudah berjalan.

---

## 14. Definisi Selesai (Definition of Done)

Sebuah tugas dinyatakan selesai apabila:

- Tujuan tugas terpenuhi sesuai PRD.
- Tidak ada perubahan ruang lingkup yang tidak disetujui.
- Kode mengikuti struktur proyek yang sudah ada.
- Validasi dilakukan di backend untuk input yang memengaruhi data.
- Hak akses diperiksa di backend.
- Data tersimpan sesuai relasi dan aturan database.
- Integrasi frontend-backend berfungsi.
- Error ditangani secara wajar.
- Tes relevan berhasil dijalankan.
- Dokumentasi diperbarui jika diperlukan.
- Tidak ada secret, data palsu, atau kode sementara yang tertinggal tanpa alasan.
- Perubahan tidak merusak fitur yang sudah berfungsi.

Jika suatu pengujian tidak dapat dijalankan karena keterbatasan lingkungan, AI wajib menyatakan pengujian yang belum dilakukan. AI tidak boleh mengklaim seluruh tes lulus tanpa bukti.

---

## 15. Aturan Perubahan Spesifikasi

PRD ini merupakan baseline pengembangan.

Setiap usulan fitur atau perubahan besar harus melalui proses berikut:

1. Jelaskan kebutuhan yang ingin diselesaikan.
2. Jelaskan alasan perubahan.
3. Identifikasi dampak terhadap UI, API, database, keamanan, dan fitur yang sudah ada.
4. Tentukan apakah perubahan wajib, opsional, atau di luar ruang lingkup.
5. Tunggu persetujuan pemilik proyek sebelum mengimplementasikan perubahan yang mengubah baseline.
6. Perbarui PRD, API documentation, atau diagram database setelah perubahan disetujui.

Perubahan kecil untuk memperbaiki bug, menutup celah keamanan, atau menyelaraskan implementasi dengan spesifikasi yang sudah disepakati boleh dilakukan tanpa memperluas ruang lingkup, selama tidak menimbulkan perubahan arsitektur atau perilaku yang tidak kompatibel.

---

## 16. Instruksi Wajib untuk AI Coding Agent

Bagian ini menjadi instruksi operasional setiap kali AI mengerjakan repositori Jelajah Sumatera.

### 16.1 Sebelum menulis kode

AI wajib:

- Membaca PRD dan dokumentasi terkait.
- Memeriksa kode aktual sebelum menentukan solusi.
- Mengidentifikasi komponen, service, route, migration, dan model yang sudah tersedia.
- Menentukan file yang benar-benar perlu diubah.
- Mempertahankan perilaku yang sudah sesuai spesifikasi.

Jangan berasumsi bahwa kode, file, package, atau endpoint yang disebut dalam PRD sudah tersedia. Periksa repositori terlebih dahulu.

### 16.2 Batasan mutlak

AI dilarang:

- Menambahkan fitur baru di luar MVP tanpa persetujuan.
- Mengganti arsitektur decoupled menjadi monolith atau sebaliknya.
- Mengganti framework, database, router, atau package manager tanpa persetujuan.
- Menghapus fitur, tabel, endpoint, atau komponen yang sudah berfungsi tanpa analisis dampak dan persetujuan jika perubahan tersebut memengaruhi kontrak yang ada.
- Mengganti seluruh kode hanya demi membuat ulang struktur yang dianggap lebih bagus.
- Membuat endpoint palsu atau mengganti integrasi API dengan data mock.
- Mengisi katalog dengan informasi budaya fiktif seolah-olah faktual.
- Membuat publikasi otomatis tanpa verifikasi admin.
- Mengurangi validasi, keamanan, atau kontrol akses untuk menyederhanakan implementasi.
- Mengubah skema database tanpa migration yang sesuai.
- Menghapus data atau melakukan operasi destruktif tanpa izin.
- Mengklaim fitur telah selesai jika baru berupa UI atau belum terhubung ke backend.

### 16.3 Ketika menemukan masalah

Jika implementasi aktual berbeda dengan PRD:

1. Tentukan apakah perbedaan tersebut merupakan bug, keterbatasan dokumentasi, atau perubahan kebutuhan.
2. Jika berupa bug yang jelas, perbaiki dengan perubahan sekecil dan seaman mungkin.
3. Jika memerlukan keputusan produk atau perubahan arsitektur, jelaskan pilihan dan dampaknya terlebih dahulu.
4. Jangan menyelesaikan ambiguitas dengan menciptakan aturan bisnis baru secara sepihak.

### 16.4 Ketika mengubah kode

AI harus:

- Mengutamakan perubahan minimal yang menyelesaikan masalah.
- Menjaga penamaan, konvensi, dan pola yang sudah digunakan.
- Memperbarui tes yang relevan.
- Memeriksa efek samping terhadap fitur lain.
- Melaporkan file yang diubah dan alasan perubahan.
- Melaporkan tes yang dijalankan serta hasil sebenarnya.
- Menyebutkan keterbatasan atau pekerjaan yang masih tersisa.

### 16.5 Format laporan setiap tugas

Setiap tugas harus ditutup dengan laporan:

**A. Tujuan**

- Masalah yang diselesaikan.

**B. Perubahan**

- File atau modul yang diubah.
- Ringkasan perubahan frontend, backend, dan database jika relevan.

**C. Validasi**

- Tes yang dijalankan.
- Hasil aktual.
- Tes yang belum dapat dijalankan.

**D. Dampak**

- Perubahan terhadap API, database, keamanan, atau UI.
- Potensi risiko atau pekerjaan lanjutan.

**E. Kepatuhan PRD**

- Konfirmasi apakah perubahan tetap dalam ruang lingkup.
- Jika ada penyimpangan, jelaskan alasannya dan minta persetujuan yang diperlukan.

---

## 17. Indikator Keberhasilan MVP

MVP dinyatakan layak apabila:

- Pengunjung dapat menemukan dan membaca budaya resmi.
- Pencarian, filter, dan pagination bekerja dengan data backend.
- Pengguna dapat mendaftar, login, dan logout.
- Pengguna dapat mengirim usulan dengan formulir multi-langkah.
- Pengguna dapat melihat riwayat usulan miliknya.
- Admin dapat meninjau dan memutuskan usulan.
- Persetujuan menghasilkan satu record budaya resmi tanpa duplikasi.
- Penolakan menyimpan catatan dan tidak menerbitkan budaya.
- Akses data antar pengguna terlindungi.
- Seluruh endpoint yang didokumentasikan memiliki implementasi atau status yang dinyatakan secara eksplisit.
- Pengujian untuk alur utama berhasil.
- Dokumentasi instalasi, konfigurasi, database, dan API tersedia.

Metrik lanjutan seperti jumlah kontributor aktif, jumlah budaya terpublikasi, atau rata-rata waktu verifikasi dapat dikembangkan setelah MVP stabil. Jangan membangun sistem analitik khusus sebelum kebutuhan dan definisi metriknya disetujui.

---

## 18. Prioritas Keputusan Produk

Jika terdapat konflik antara keinginan untuk menambah fitur dan kewajiban menjaga konsistensi, gunakan urutan prioritas berikut:

1. Keamanan dan integritas data.
2. Kesesuaian dengan kebutuhan yang disetujui.
3. Kebenaran aturan bisnis dan alur publikasi.
4. Konsistensi kontrak API dan database.
5. Stabilitas fitur yang sudah berjalan.
6. Kualitas UI/UX.
7. Optimasi performa yang relevan.
8. Fitur tambahan yang belum masuk MVP.

**Prinsip akhir:** Jelajah Sumatera harus berkembang berdasarkan kebutuhan yang terdefinisi, bukan berdasarkan asumsi AI tentang fitur yang seharusnya ada.

---

Dokumen ini menjadi baseline untuk perencanaan, implementasi, code review, pengujian, dan pengembangan lanjutan. Setiap perubahan ruang lingkup harus terdokumentasi dan mendapatkan persetujuan pemilik proyek sebelum diterapkan.
