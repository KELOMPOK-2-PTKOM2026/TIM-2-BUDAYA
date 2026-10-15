# 🌴 TIM-2-BUDAYA: Jelajah Sumatera

**Jelajah Sumatera** adalah platform digital pelestarian budaya untuk mendokumentasikan, mempublikasikan, dan merayakan kekayaan tradisi dari 10 provinsi di Pulau Sumatera.

Masyarakat dapat berkontribusi (_User_) dengan mengunggah artikel, gambar, dan data budaya lokal. Seluruh kontribusi melalui tahap kurasi dan validasi oleh _Admin_ sebelum dipublikasikan.

---

## 🏗️ Arsitektur Sistem & Tech Stack

Proyek menggunakan arsitektur **Decoupled Monorepo**:

- **Frontend (`/frontend`)**: React 19, React Router v7, Framer Motion, Axios, Modular/BEM CSS
- **Backend (`/backend`)**: Laravel 13 (PHP 8.3+), PostgreSQL (mendukung MySQL/SQLite), Laravel Sanctum, Laravel Socialite (Google OAuth 2.0)
- **Dokumentasi (`/docs`)**: PRD & Spesifikasi Teknis

---

## 📂 Struktur Direktori Monorepo

```text
TIM-2-BUDAYA/
├── backend/                        # Layanan RESTful API (Laravel)
│   ├── app/
│   │   ├── Http/Controllers/Api/   # Auth, Culture, Proposal, Category, Province
│   │   ├── Models/                 # User, Culture, CultureProposal, Category, Province
│   │   └── Providers/
│   ├── config/                     # services.php (Google OAuth), cors.php, app.php
│   ├── database/
│   │   ├── migrations/             # Skema tabel & relasi DB
│   │   └── seeders/                # Seed provinsi, kategori, data awal budaya (CSV)
│   ├── routes/
│   │   └── api.php                 # Rute REST API (/api/...)
│   ├── storage/                    # Upload proposal budaya & logs
│   ├── composer.json               # Dependensi PHP/Laravel
│   └── .env.example                # Template konfigurasi environment backend
│
├── frontend/                       # Aplikasi Antarmuka Pengguna (React SPA)
│   ├── public/                     # Aset statis & _redirects (SPA routing)
│   ├── src/
│   │   ├── components/             # Navbar, Footer, Modal, Card
│   │   ├── context/                # AuthContext (state sesi & token)
│   │   ├── lib/                    # Instance API Axios (interceptor auth)
│   │   ├── pages/                  # Landing, Explore, Detail, Proposal, Login, Register, Admin
│   │   └── styles/                 # Desain modular & BEM CSS
│   ├── package.json                # Dependensi React
│   ├── vercel.json                 # Routing rewrite untuk Vercel
│   └── .env.example                # Template konfigurasi environment frontend
│
├── docs/                           # Dokumentasi & PRD proyek
│   └── PRD.md
├── package.json                    # Skrip orkestrasi monorepo (concurrently)
└── README.md                       # Dokumentasi utama proyek
```

---

## 💻 Prerequisites (Persyaratan Sistem)

- **Node.js** (v18.x atau v20.x+) & **npm**
- **PHP** (v8.2 atau v8.3+) dengan ekstensi: `pdo`, `pdo_pgsql` (atau `pdo_mysql` / `pdo_sqlite`), `mbstring`, `openssl`, `curl`
- **Composer** (v2.x)
- **Database Engine**: PostgreSQL (disarankan), MySQL, atau SQLite

---

## 🚀 Panduan Menjalankan Proyek (Local Development)

### 1. Setup Awal Environment Backend

Masuk ke folder `backend`, siapkan environment, dan database:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Sesuaikan koneksi database di `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ptkom
DB_USERNAME=postgres
DB_PASSWORD=secret
```

Jalankan migrasi, data awal (seeder), dan symbolic link storage:

```bash
php artisan migrate --seed
php artisan storage:link
cd ..
```

_(Opsional) Konfigurasi Google OAuth di `backend/.env` jika ingin menguji fitur Google Login:_

```env
GOOGLE_CLIENT_ID=isi_client_id_google_anda
GOOGLE_CLIENT_SECRET=isi_client_secret_google_anda
GOOGLE_REDIRECT_URI="${APP_URL}/api/auth/google/callback"
FRONTEND_URL=http://localhost:3000
```

---

### 2. Setup Awal Frontend

Masuk ke folder `frontend` dan siapkan file `.env`:

```bash
cd frontend
cp .env.example .env
npm install
cd ..
```

Isi default `frontend/.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_STORAGE_URL=http://localhost:8000/storage/
```

---

### 3. Menjalankan Aplikasi

#### Cara Cepat (Root Concurrently)

Dari root workspace, jalankan kedua server sekaligus:

```bash
npm run dev
```

- Frontend berjalan di `http://localhost:3000`
- Backend API berjalan di `http://localhost:8000`

#### Cara Manual (Dua Terminal Terpisah)

**Terminal 1 (Backend):**

```bash
cd backend
php artisan serve
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm start
```

---

## 🧪 Pengujian & Validasi Kode

**Backend (PHPUnit / Pest):**

```bash
cd backend
php artisan test
```

**Frontend (ESLint & Production Build Check):**

```bash
cd frontend
npm run build
```

---

## ⚠️ Panduan Deployment Production

1. **Frontend (Vercel / Netlify / Cloudflare Pages)**:
   - Atur **Root Directory** ke folder `frontend`.
   - File `vercel.json` dan `public/_redirects` telah disertakan untuk mencegah galat 404 saat navigasi langsung atau _page refresh_.
   - Pasang Environment Variable:
     - `REACT_APP_API_BASE_URL=https://api-domain-anda.com/api`
     - `REACT_APP_STORAGE_URL=https://api-domain-anda.com/storage/`

2. **Backend (VPS / Railway / Render)**:
   - Atur **Document Root** web server (Nginx/Apache) ke `backend/public`.
   - Jalankan perintah optimasi produksi:
     ```bash
     composer install --no-dev --optimize-autoloader
     php artisan migrate --force
     php artisan storage:link
     php artisan config:cache
     php artisan route:cache
     php artisan view:cache
     ```
   - Pastikan variabel `APP_DEBUG=false`, `APP_ENV=production`, dan `FRONTEND_URL` diarahkan ke domain frontend production.
   - Daftarkan URL redirect callback di Google Cloud Console:
     `https://api-domain-anda.com/api/auth/google/callback`
