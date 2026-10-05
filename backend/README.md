# Backend: TIM-2-BUDAYA (Laravel 11)

Penyedia layanan RESTful API dan pengelolaan database untuk TIM-2-BUDAYA.

## ⚙️ Setup Database & Environment
1. Gandakan file `.env`:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan kredensial *database* Anda di `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=tim2budaya
   DB_USERNAME=root
   DB_PASSWORD=
   ```

## 🚀 Urutan Eksekusi Artisan (Developer Baru)
Setelah clone repositori dan menjalankan `composer install` (atau `npm run install:all` dari root), **WAJIB** jalankan urutan berikut agar aplikasi dapat beroperasi normal:

1. **Key Generate**: 
   ```bash
   php artisan key:generate
   ```
   *(Membuat kunci enkripsi aplikasi).*

2. **Migrasi**: 
   ```bash
   php artisan migrate
   ```
   *(Membangun struktur tabel database).*

3. **Seeder**: 
   ```bash
   php artisan db:seed
   ```
   *(Mengisi data dummy/krusial ke dalam database).*

4. **Storage Link**: 
   ```bash
   php artisan storage:link
   ```
   *(Membuka akses gambar/file unggahan ke folder `public`).*
