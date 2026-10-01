export const provinces = [
  { id: 'aceh', name: 'Aceh', slug: 'aceh', image: 'https://images.unsplash.com/photo-1622597943118-45ebacc528d1?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', tag: 'Serambi Mekah', count: 42 },
  { id: 'sumut', name: 'Sumatera Utara', slug: 'sumatera-utara', image: 'https://images.unsplash.com/photo-1569081562679-6d71c00aab86?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', tag: 'Danau Toba', count: 58 },
  { id: 'sumbar', name: 'Sumatera Barat', slug: 'sumatera-barat', image: 'https://images.unsplash.com/photo-1606633007433-a1abd835f6cd?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', tag: 'Ranah Minang', count: 67 },
  { id: 'riau', name: 'Riau', slug: 'riau', image: 'https://images.unsplash.com/photo-1694769473628-a6a01930ae73?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', tag: 'Bumi Lancang Kuning', count: 34 },
  { id: 'kepri', name: 'Kepulauan Riau', slug: 'kepulauan-riau', image: 'https://images.unsplash.com/photo-1553193094-d7add06beb10?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', tag: 'Bunda Tanah Melayu', count: 28 },
  { id: 'jambi', name: 'Jambi', slug: 'jambi', image: 'https://images.unsplash.com/photo-1708481686679-1bfebe1afefc?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', tag: 'Sepucuk Jambi Sembilan Lurah', count: 31 },
  { id: 'sumsel', name: 'Sumatera Selatan', slug: 'sumatera-selatan', image: 'https://images.unsplash.com/photo-1571669829691-9bfdc2943044?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', tag: 'Bumi Sriwijaya', count: 45 },
  { id: 'bengkulu', name: 'Bengkulu', slug: 'bengkulu', image: 'https://images.unsplash.com/photo-1634532999884-ecd677928bac?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', tag: 'Bumi Rafflesia', count: 22 },
  { id: 'lampung', name: 'Lampung', slug: 'lampung', image: 'https://images.unsplash.com/photo-1592639298199-7b9d01c1cf29?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', tag: 'Sang Bumi Ruwa Jurai', count: 38 },
  { id: 'babel', name: 'Bangka Belitung', slug: 'bangka-belitung', image: 'https://images.unsplash.com/photo-1444362408440-274ecb6fc730?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', tag: 'Negeri Serumpun Sebalai', count: 26 },
];

export const features = [
  { icon: 'Compass', title: 'Eksplorasi Budaya', desc: 'Jelajahi ratusan entri warisan budaya dari 10 provinsi Sumatera yang terkurasi dengan rapi dan mendalam.' },
  { icon: 'Users', title: 'Kontribusi Komunitas', desc: 'Bagikan pengetahuan Anda. Usulkan entri budaya baru atau sunting yang sudah ada bersama komunitas.' },
  { icon: 'BadgeCheck', title: 'Verifikasi Terpercaya', desc: 'Setiap entri melewati proses tinjauan oleh kurator dan ahli budaya untuk menjamin keakuratan.' },
];

export const categories = [
  { id: 'all', name: 'Semua' },
  { id: 'tari', name: 'Tari' },
  { id: 'musik', name: 'Musik' },
  { id: 'kuliner', name: 'Kuliner' },
  { id: 'kain', name: 'Kain Tenun' },
  { id: 'rumah', name: 'Rumah Adat' },
  { id: 'upacara', name: 'Upacara' },
  { id: 'senjata', name: 'Senjata' },
];

export const cultures = [
  { id: 1, slug: 'tari-saman-gayo', title: 'Tari Saman Gayo', category: 'Tari', province: 'Aceh', image: 'https://images.unsplash.com/photo-1741272689174-f7f03b09a0ab?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Tarian ritmis dari suku Gayo yang menampilkan harmoni gerak dan tepukan tangan.', featured: true },
  { id: 2, slug: 'rendang-minang', title: 'Rendang Minang', category: 'Kuliner', province: 'Sumatera Barat', image: 'https://images.unsplash.com/photo-1681378128359-a5c2492a3535?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Masakan daging kaya rempah yang dimasak lama hingga menghasilkan cita rasa yang khas.', featured: false },
  { id: 3, slug: 'gong-sekatur', title: 'Gong Sekatur', category: 'Musik', province: 'Kepulauan Riau', image: 'https://images.unsplash.com/photo-1755077005329-13ce030aa794?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Alat musik pukul tradisional yang menjadi ciri khas kesenian Melayu.', featured: false },
  { id: 4, slug: 'kain-ulos-batak', title: 'Kain Ulos Batak', category: 'Kain Tenun', province: 'Sumatera Utara', image: 'https://images.unsplash.com/photo-1655149238677-9b5cb1a0afc6?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Kain tenun sakral yang dipakai dalam setiap upacara adat masyarakat Batak.', featured: false },
  { id: 5, slug: 'upacara-besale', title: 'Upacara Besale', category: 'Upacara', province: 'Jambi', image: 'https://images.unsplash.com/photo-1622572771591-6ca7813cc39d?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Ritual pengobatan masyarakat Suku Anak Dalam yang penuh dengan simbol spiritual.', featured: false },
  { id: 6, slug: 'piper-lampung', title: 'Piper Lampung', category: 'Musik', province: 'Lampung', image: 'https://images.unsplash.com/photo-1605524085608-919f50601c8f?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Alat musik tiup khas Lampung yang menghasilkan nada melodis yang memikat.', featured: false },
  { id: 7, slug: 'songket-palembang', title: 'Songket Palembang', category: 'Kain Tenun', province: 'Sumatera Selatan', image: 'https://images.unsplash.com/photo-1571669829691-9bfdc2943044?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Kain tenun bersulam benang emas warisan Kerajaan Sriwijaya.', featured: true },
  { id: 8, slug: 'rumah-batu-besi', title: 'Rumah Batu Besi', category: 'Rumah Adat', province: 'Bengkulu', image: 'https://images.unsplash.com/photo-1714702769194-9be6068abb6c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Rumah adat yang dibangun dengan kayu kuat dan filosofi hidup selaras alam.', featured: false },
  { id: 9, slug: 'rumah-gadang', title: 'Rumah Gadang', category: 'Rumah Adat', province: 'Sumatera Barat', image: 'https://images.unsplash.com/photo-1606633007433-a1abd835f6cd?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Rumah tradisional Minangkabau dengan atap bagonjong yang ikonik.', featured: true },
  { id: 10, slug: 'tari-piring', title: 'Tari Piring', category: 'Tari', province: 'Sumatera Barat', image: 'https://images.unsplash.com/photo-1539755530862-00f623c00f52?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Tarian tradisional yang menggunakan piring sebagai properti dengan gerakan dinamis.', featured: false },
  { id: 11, slug: 'mie-aceh', title: 'Mie Aceh', category: 'Kuliner', province: 'Aceh', image: 'https://images.unsplash.com/photo-1680169590313-9a14f3cd8148?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Hidangan mie dengan kuah kari pedas kaya rempah khas Aceh.', featured: false },
  { id: 12, slug: 'pempek', title: 'Pempek Palembang', category: 'Kuliner', province: 'Sumatera Selatan', image: 'https://images.unsplash.com/photo-1539755530862-00f623c00f52?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', desc: 'Hidangan ikan tenggiri dengan kuah cuko manis-asam yang legendaris.', featured: false },
];

export const destinations = [
  { id: 1, name: 'Danau Toba', province: 'Sumatera Utara', image: 'https://images.unsplash.com/photo-1569081562679-6d71c00aab86?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200', desc: 'Danau vulkanik terbesar di Asia Tenggara dengan Pulau Samosir di tengahnya.' },
  { id: 2, name: 'Jam Gadang', province: 'Sumatera Barat', image: 'https://images.unsplash.com/photo-1606633007433-a1abd835f6cd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200', desc: 'Menara jam ikonik di Bukittinggi yang menjadi simbol kota.' },
  { id: 3, name: 'Masjid Raya Baiturrahman', province: 'Aceh', image: 'https://images.unsplash.com/photo-1622597943118-45ebacc528d1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200', desc: 'Masjid bersejarah dengan arsitektur megah di jantung Kota Banda Aceh.' },
  { id: 4, name: 'Pantai Tanjung Tinggi', province: 'Bangka Belitung', image: 'https://images.unsplash.com/photo-1553193094-d7add06beb10?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200', desc: 'Pantai eksotis dengan batu granit raksasa yang terkenal lewat film Laskar Pelangi.' },
];

export const articles = [
  { id: 1, title: 'Memahami Filosofi Bagonjong Rumah Gadang', excerpt: 'Atap rumah gadang bukan sekadar bentuk arsitektur, tetapi juga simbol kehidupan dan nilai luhur Minangkabau.', image: 'https://images.unsplash.com/photo-1606633007433-a1abd835f6cd?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', date: '12 Mar 2025', author: 'Dr. Rangkayo' },
  { id: 2, title: 'Perjalanan Sejarah Songket Palembang', excerpt: 'Dari masa Kerajaan Sriwijaya hingga pengakuan UNESCO, songket menyimpan jejak panjang peradaban Nusantara.', image: 'https://images.unsplash.com/photo-1571669829691-9bfdc2943044?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', date: '08 Mar 2025', author: 'Siti Rahayu' },
  { id: 3, title: 'Tari Saman: Harmoni dalam Gerakan', excerpt: 'Pelajari bagaimana ratusan penari Saman menciptakan harmoni sempurna tanpa iringan musik.', image: 'https://images.unsplash.com/photo-1741272689174-f7f03b09a0ab?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', date: '01 Mar 2025', author: 'Teuku Hasan' },
];

export const testimonials = [
  { id: 1, name: 'Prof. Dr. Imam Prayogo', role: 'Antropolog Budaya, UI', text: 'JelajahSumatera adalah inisiatif luar biasa yang mendigitalisasi warisan budaya kita secara terkurasi dan terpercaya. Platform ini menjadi rujukan penting bagi akademisi maupun masyarakat umum.' },
  { id: 2, name: 'Cut Dyan Nazwa', role: 'Pegiat Budaya Aceh', text: 'Saya terbantu sekali dengan platform ini untuk memperkenalkan tari dan tradisi Aceh ke generasi muda. Antarmukanya elegan, kontennya berkualitas, dan prosesnya kolaboratif.' },
];

export const heroImage = 'https://images.unsplash.com/photo-1569081562679-6d71c00aab86?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000';

export const detailCulture = {
  slug: 'tari-saman-gayo',
  title: 'Tari Saman Gayo',
  province: 'Aceh',
  category: 'Tari Tradisional',
  heroImage: 'https://images.unsplash.com/photo-1741272689174-f7f03b09a0ab?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000',
  description: 'Tari Saman adalah salah satu tarian tradisional dari Suku Gayo yang berasal dari dataran tinggi Aceh. Tarian ini biasanya ditampilkan untuk merayakan peristiwa penting dalam adat, serta sebagai media dakwah dan hiburan. Keunikan Tari Saman terletak pada ritme tepukan tangan, dada, dan paha yang bersahutan menciptakan harmoni yang memukau.',
  longDescription: 'Pada tahun 2011, UNESCO menetapkan Tari Saman sebagai Warisan Budaya Takbenda yang memerlukan Perlindungan Mendesak. Pengakuan ini mendorong berbagai upaya pelestarian baik di tingkat lokal, nasional, maupun internasional. Pengajaran Tari Saman kini sudah masuk ke dalam kurikulum sekolah di Aceh dan dipentaskan di berbagai acara kebudayaan.',
  gallery: [
    'https://images.unsplash.com/photo-1741272689174-f7f03b09a0ab?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    'https://images.unsplash.com/photo-1755077005329-13ce030aa794?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    'https://images.unsplash.com/photo-1622597943118-45ebacc528d1?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
  ],
  heritage: [
    { title: 'Tari Saman Aceh', image: 'https://images.unsplash.com/photo-1741272689174-f7f03b09a0ab?crop=entropy&cs=srgb&fm=jpg&q=85&w=400', desc: 'Diakui UNESCO sebagai warisan dunia tahun 2011' },
    { title: 'Kopi Gayo', image: 'https://images.unsplash.com/photo-1680169590313-9a14f3cd8148?crop=entropy&cs=srgb&fm=jpg&q=85&w=400', desc: 'Kopi arabika premium dari dataran tinggi Gayo' },
    { title: 'Bagas', image: 'https://images.unsplash.com/photo-1714702769194-9be6068abb6c?crop=entropy&cs=srgb&fm=jpg&q=85&w=400', desc: 'Rumah tradisional suku Gayo dari kayu pilihan' },
  ],
  facts: [
    { label: 'Asal Daerah', value: 'Dataran Tinggi Gayo, Aceh' },
    { label: 'Jumlah Penari', value: '7 - 70 penari' },
    { label: 'Durasi', value: '15 - 30 menit' },
    { label: 'Status', value: 'Warisan UNESCO 2011' },
  ],
};
