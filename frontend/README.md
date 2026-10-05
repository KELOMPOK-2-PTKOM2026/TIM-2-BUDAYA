# Frontend: TIM-2-BUDAYA (React 19)

Aplikasi klien yang dibangun dengan React untuk berinteraksi dengan Laravel API.

## ⚙️ Environment Variables
Buat file `.env` dari `.env.example` (jika ada) dan pastikan URL backend API sudah sesuai:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 📂 Struktur Direktori Utama
- `src/components`: Komponen UI modular yang dapat digunakan ulang.
- `src/pages`: Level halaman aplikasi yang menggunakan sistem *routing*.
- `src/services`: Konfigurasi *fetch/Axios* untuk memanggil endpoint API Backend.

## 🛠️ Skrip Build Khusus
- `npm start`: Menjalankan server development lokal.
- `npm run build`: Membangun (compile) aplikasi untuk *production*.
- `npm run test`: Menjalankan *test suite* frontend.
