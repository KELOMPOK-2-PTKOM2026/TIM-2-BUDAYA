# 🌴 TIM-2-BUDAYA: Jelajah Sumatera

**Jelajah Sumatera** adalah sebuah platform digital pelestarian budaya yang didedikasikan untuk mendokumentasikan, mempublikasikan, dan merayakan kekayaan tradisi dari 10 provinsi di Pulau Sumatera. 

Aplikasi ini memberdayakan masyarakat umum untuk ikut serta berkontribusi (sebagai *User*) dengan mengunggah artikel, gambar, atau data budaya lokal mereka. Seluruh kontribusi dari masyarakat akan melalui tahap validasi dan kurasi oleh *Admin* sebelum dipublikasikan secara resmi ke publik.

---

## 🏗️ Arsitektur Sistem & Tech Stack

Proyek ini menggunakan arsitektur **Decoupled Monorepo**, di mana *source code* dipisahkan secara rapi ke dalam dua subsistem yang mandiri namun disimpan dalam satu repositori yang sama:

- **Frontend (`/frontend`)**: React 19 + Tailwind CSS (Antarmuka Pengguna & Interaksi Klien)
- **Backend (`/backend`)**: Laravel 11 + MySQL (RESTful API, Autentikasi, & Manajemen Data)

---

## 📂 Struktur Folder Monorepo

Berikut adalah gambaran tingkat tinggi dari struktur direktori proyek ini:

```text
TIM-2-BUDAYA/
├── frontend/               # Aplikasi Klien (React)
│   ├── public/             # File statis (favicon, index.html)
│   ├── src/                # Source code React (Components, Pages, Services)
│   ├── package.json        # Dependensi khusus frontend
│   └── README.md           # Dokumentasi spesifik frontend
│
├── backend/                # Layanan API (Laravel)
│   ├── app/                # Logika bisnis (Controllers, Models)
│   ├── database/           # Migrations & Seeders
│   ├── routes/             # Definisi Endpoint API (api.php)
│   ├── composer.json       # Dependensi khusus backend
│   └── README.md           # Dokumentasi spesifik backend
│
├── .editorconfig           # Aturan standar format kode (indentasi, spasi)
├── .gitignore              # Mengabaikan file sampah sistem operasi & IDE
├── package.json            # Otomatisasi root (install:all, dev)
└── README.md               # Dokumentasi utama proyek
```

---

## 💻 Prerequisites (Persyaratan Sistem)

Sebelum menjalankan proyek ini secara lokal, pastikan perangkat Anda telah terinstal:
- **Node.js** (v18.x atau lebih baru) & **npm**
- **PHP** (v8.2 atau lebih baru)
- **Composer** (v2.x)
- **MySQL** (v8.x atau MariaDB setara)

---

## 🚀 Cara Menjalankan Proyek (Local Development)

Proyek ini telah dikonfigurasi dengan skrip otomatisasi di level *root* untuk mempermudah *developer experience* (DX).

### Opsi 1: Menjalankan Otomatis (Rekomendasi)
Hanya butuh dua langkah untuk menjalankan keseluruhan aplikasi:

1. **Install semua dependensi (React & Laravel):**
   Dari *root* direktori, jalankan:
   ```bash
   npm run install:all
   ```
2. **Jalankan kedua server secara bersamaan:**
   ```bash
   npm run dev
   ```
   *(Server React akan berjalan di `http://localhost:3000` dan API Laravel di `http://localhost:8000`)*

### Opsi 2: Menjalankan Manual (Terminal Terpisah)
Jika Anda ingin melihat *log* yang lebih terisolasi, gunakan dua terminal:

**Terminal 1 (Backend):**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm start
```

---

## ⚠️ Catatan Krusial Deployment (PENTING!)

Karena arsitektur kita adalah Monorepo, struktur direktori saat *deployment* ke platform *Cloud* memerlukan perhatian khusus:

- **Deployment Frontend (Vercel / Netlify / Cloudflare Pages)**:
  Saat Anda melakukan *import* repositori ini, Anda **WAJIB** mengatur konfigurasi **Root Directory** ke folder `frontend` (atau `/frontend`). Jika dibiarkan *default* di root utama, proses *build* akan gagal.
  
- **Deployment Backend (VPS / cPanel / Railway)**:
  Pastikan *Document Root* pada server Anda diarahkan langsung menembus ke folder `backend/public`, bukan di *root* repositori.
