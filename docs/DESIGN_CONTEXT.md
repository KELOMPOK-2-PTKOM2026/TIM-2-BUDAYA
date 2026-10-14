# DESIGN CONTEXT — JELAJAH SUMATERA (REVISED)

Dokumen ini adalah referensi desain untuk Agent AI. Baca sebelum membuat atau mengubah komponen UI apapun.

---

## 1. IDENTITAS DESAIN

- **Tema:** Budaya & alam Sumatera — earthy, elegan, editorial.
- **Pendekatan:** Tailwind CSS (Utility-first). Custom CSS di `index.css` atau `App.css` hanya digunakan untuk animasi global atau komponen kompleks yang sulit ditangani Tailwind murni.
- **Responsif:** Mobile-first, breakpoint utama `640px` (sm), `768px` (md), `1024px` (lg).

---

## 2. PALET WARNA (Gunakan Arbitrary Values Tailwind jika perlu)

### Warna Utama

| Peran                        | Hex                   | Digunakan di                                                                        |
| ---------------------------- | --------------------- | ----------------------------------------------------------------------------------- |
| **Aksen / CTA**              | `#C4542E`             | Tombol primer (`bg-[#C4542E]`), link aktif, eyebrow, underline dekorasi, focus ring |
| **Aksen hover**              | `#a84321` / `#b04622` | Hover state tombol primer (`hover:bg-[#a84321]`)                                    |
| **Background halaman**       | `#faf7f2` / `#faf8f5` | `body`, `.app-shell`, semua halaman (`bg-[#faf7f2]`)                                |
| **Teks utama**               | `#2a2520` / `#23201c` | Body text (`text-[#2a2520]`)                                                        |
| **Hijau gelap (brand)**      | `#1C3B2E` / `#143329` | Section title, heading utama (`text-[#1C3B2E]`)                                     |
| **Hijau gelap (navbar btn)** | `#13332a`             | Navbar filled button background (`bg-[#13332a]`)                                    |
| **Footer background**        | `#0d241e`             | Footer (`bg-[#0d241e]`)                                                             |

### Warna Pendukung

| Peran                 | Hex                               |
| --------------------- | --------------------------------- |
| Navbar background     | `#ffffff`                         |
| Navbar border         | `#ede8de`                         |
| Card background       | `#ffffff`                         |
| Card border           | `#ebe4d5` / `#ebe5dc`             |
| Pill/tag background   | `#fdf1ea`                         |
| Icon badge background | `#eaf3ee`                         |
| Auth page background  | `#f7f3ec`                         |
| Footer text           | `#c5ded6` / `#8dafa5`             |
| Footer heading        | `#df9e38` / `#e5a83b` (emas)      |
| Teks sekunder         | `#4b453e` / `#5c554c` / `#635c53` |

---

## 3. TIPOGRAFI

Pastikan font sudah diimpor (via Google Fonts) di file HTML atau CSS global:

```css
@import url("https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap");
```

Gunakan arbitrary values Tailwind jika font belum dikonfigurasi di `tailwind.config.js`:

| Peran               | Font                                 | Tailwind Class (Contoh)                    |
| ------------------- | ------------------------------------ | ------------------------------------------ |
| **Heading / judul** | `'EB Garamond', Georgia, serif`      | `font-['EB_Garamond',serif] font-semibold` |
| **Body / UI**       | `'Inter', -apple-system, sans-serif` | `font-['Inter',sans-serif] font-normal`    |

### Pola Heading Section

- **Eyebrow:** `text-[0.75rem] tracking-[0.2em] uppercase text-[#C4542E] font-medium`
- **Title:** `font-['EB_Garamond',serif] text-[2.5rem] text-[#1C3B2E] leading-tight`

---

## 4. PANDUAN KOMPONEN (Tailwind Translation)

### Tombol

- **Primer (Oranye):**  
  `bg-[#C4542E] text-white rounded-[0.4rem] px-6 py-3 font-semibold transition-all hover:bg-[#a84321] hover:shadow-[0_10px_24px_-10px_rgba(196,84,46,0.5)]`
- **Navbar Filled (Hijau):**  
  `bg-[#13332a] text-white rounded-full px-5 py-2 transition-colors hover:bg-[#1b453a]`
- **Navbar Outline:**  
  `border border-zinc-500 rounded-full px-5 py-2 text-zinc-700`

### Card

- **Pola standar:**  
  `bg-white border border-[#ebe4d5] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(19,51,42,0.07)]`

### Input Form

- **Auth / Standar Input:**  
  `bg-white border border-[#e2ddd4] rounded-md px-4 py-3 text-[0.925rem] font-['Inter',sans-serif] text-gray-800 focus:outline-none focus:border-[#C4542E] focus:ring-[3px] focus:ring-[#C4542E]/10`

### Pill / Tag Kategori

- **Pill:**  
  `bg-[#fdf1ea] text-[#C4542E] px-2.5 py-0.5 rounded-full text-xs font-medium`

---

## 5. LAYOUT & CONTAINER

- **Container Wide:** `max-w-7xl mx-auto px-6`
- **Container Narrow:** `max-w-5xl mx-auto px-6`
- **App Shell:** `min-h-screen bg-[#faf7f2] flex flex-col`
- **App Main:** `flex-1`

---

## 6. EFEK & ANIMASI GLOBAL (Bisa dipertahankan di Custom CSS)

Gunakan `App.css` atau `index.css` untuk animasi khusus yang repot jika ditulis inline:

```css
/* Fade in dari bawah */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeInUp 0.6s ease-out both;
}

/* Image zoom on hover (Bungkus img dengan class ini) */
.img-zoom-container {
  overflow: hidden;
}
.img-zoom-container img {
  transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.img-zoom-container:hover img {
  transform: scale(1.06);
}
```

---

## 7. ATURAN UNTUK AGENT AI (PENTING!)

1. **GUNAKAN Tailwind CSS sebagai metode styling utama.** Anda bebas menggunakan utility classes langsung di dalam komponen React (`className="..."`).
2. **Warna aksen selalu `#C4542E`**, gunakan arbitrary values Tailwind (contoh: `bg-[#C4542E]`, `text-[#C4542E]`) jika warna belum ada di config. Jangan ganti dengan oranye standar Tailwind (`orange-500` dsb).
3. **Heading section selalu `EB Garamond`**, body selalu `Inter`. Gunakan arbitrary font families (contoh: `font-['EB_Garamond',serif]`).
4. **Border-radius standar:** Card menggunakan `rounded-xl` (`0.75rem`), tombol menggunakan `rounded-[0.4rem]`, pill menggunakan `rounded-full`.
5. **Hover card:** Selalu berikan efek `transition-all duration-300 hover:-translate-y-1` disertai shadow kustom hijau gelap.
6. **Focus input:** Selalu gunakan `focus:outline-none focus:border-[#C4542E] focus:ring-[3px] focus:ring-[#C4542E]/10`.
7. **Breakpoint:** Gunakan standar Tailwind `sm:`, `md:`, `lg:`, `xl:`.
8. **File CSS Kustom:** Gunakan `App.css` atau `index.css` HANYA untuk keyframes animasi yang rumit (`@keyframes`) atau utilitas spesifik yang tidak bisa dijangkau Tailwind murni. Jangan membuat file CSS baru untuk setiap halaman.
9. **Background halaman:** Selalu gunakan `bg-[#faf7f2]` atau `bg-[#faf8f5]`.
