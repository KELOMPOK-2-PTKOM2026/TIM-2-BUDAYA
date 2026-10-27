<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Province;
use App\Models\Category;
use App\Models\Culture;

class CultureSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'title' => 'Mak Meugang',
                'province' => 'Aceh',
                'category' => 'Adat dan Tradisi',
                'origin' => 'Gayo Lues, Aceh',
                'description' => 'Tradisi menyembelih dan memasak daging untuk menyambut Ramadan, Idulfitri, dan I...',
                'source_name' => 'detiksumut',
                'source_url' => 'Apa Itu Meugang? Tradisi Unik Aceh Menyambut Bulan Puasa',
                'image' => 'https://drive.google.com/file/d/1gBeb3YRNLfi1YK5J5SHCpO3V0kyRLq4T/view?usp=drive_link',
            ],
            [
                'title' => 'Didong',
                'province' => 'Aceh',
                'category' => 'Bahasa Dan Sastra',
                'origin' => 'Aceh Tengah',
                'description' => 'Kesenian yang memadukan unsur sastra, nyanyian, dan pertunjukan. Didong berkemba...',
                'source_name' => 'Wikipedia',
                'source_url' => 'Didong - Wikipedia bahasa Indonesia, ensiklopedia bebas',
                'image' => 'https://drive.google.com/file/d/1pwpT0G7B1fFDIeTQ-1xT3fwLFcBJqLVZ/view?usp=drive_link',
            ],
            [
                'title' => 'Mon Seuribee',
                'province' => 'Aceh',
                'category' => 'Cerita Atau Legenda',
                'origin' => 'Gampong Parang IX, Kecamatan Matangkuli, Aceh Utara',
                'description' => 'Legenda masyarakat tentang Teungku Muhammad Syah Sabi/Teungku Batèe Putéh dan pe...',
                'source_name' => 'Jurnal Ilmiah Universitas Malikussaleh',
                'source_url' => 'ANALISIS PESAN MORAL DALAM LEGENDA MON SEURIBÃˆE DI GAMPÃ”NG PARANG IX, KECAMATAN MATANGKULI, KABUPATEN ACEH UTARA | Kande : Jurnal Ilmiah Pendidikan Bahasa dan Sastra Indonesia',
                'image' => 'https://drive.google.com/file/d/1tRozr2IxQb3FsUvY2gpP1EVgwax5b7bS/view?usp=drive_link',
            ],
            [
                'title' => 'Tari Moyo',
                'province' => 'Sumatera Utara',
                'category' => 'Adat dan Tradisi',
                'origin' => 'pulau nias',
                'description' => 'Tari Moyo atau disebut juga sebagai tari elang merupakan salah satu seni tari tr...',
                'source_name' => 'Wikipedia',
                'source_url' => 'https://id.wikipedia.org/wiki/Tari_Moyo',
                'image' => 'https://drive.google.com/file/d/1YbYh6qnVFTKPrx_9HPM8zIa_R5UPK7-k/view?usp=drive_link',
            ],
            [
                'title' => 'Pustaha Laklak',
                'province' => 'Sumatera Utara',
                'category' => 'Bahasa Dan Sastra',
                'origin' => 'batak toba',
                'description' => 'Pustaha laklak merupakan kitab kuno masyarakat Batak Toba yang berfungsi sebagai...',
                'source_name' => 'detik.com',
                'source_url' => 'https://www.detik.com/sumut/budaya/d-8334861/pustaha-laklak-kitab-kuno-batak-toba-yang-menyimpan-ilmu-dan-tradisi-leluhur/amp',
                'image' => 'https://drive.google.com/file/d/1SN--g4OrhpeFzZ6gQqjgv-gfzGhTq3H4/view?usp=drive_link',
            ],
            [
                'title' => 'Legenda Danau Toba',
                'province' => 'Sumatera Utara',
                'category' => 'Cerita Atau Legenda',
                'origin' => 'toba',
                'description' => 'Legenda Danau Toba adalah salah satu sastra lisan yang sangat terkenal di Sumate...',
                'source_name' => 'wikipedia',
                'source_url' => 'https://id.wikipedia.org/wiki/Legenda_Danau_Toba',
                'image' => 'https://drive.google.com/file/d/1nuh37R7ZJmgl-aOPpS6vIjj2j7_soxx2/view?usp=drive_link',
            ],
            [
                'title' => 'Batagak Pangulu',
                'province' => 'Sumatera Barat',
                'category' => 'Adat dan Tradisi',
                'origin' => 'Minangkabau, Sumatera Barat',
                'description' => 'Prosesi ini merupakan tradisi pengangkatan seorang pemimpin kaum (penghulu) yang...',
                'source_name' => 'Artikel detik.com',
                'source_url' => 'https://www.detik.com/sumut/budaya/d-7108633/mengenal-upacara-batagak-pangulu-pada-adat-minangkabau',
                'image' => 'https://drive.google.com/file/d/19fLJxoS-lLRKGwcpUE-iIpKjqcnnpGAN/view?usp=drive_link',
            ],
            [
                'title' => 'Kaba',
                'province' => 'Sumatera Barat',
                'category' => 'Bahasa Dan Sastra',
                'origin' => 'Minangkabau, Sumatera Barat',
                'description' => 'Kaba merupakan sastra naratif khas Minangkabau yang selama berabad-abad hidup me...',
                'source_name' => 'Kemendikdasmen',
                'source_url' => 'https://balaibahasa-sumbar.kemendikdasmen.go.id/kaba-jembatan-antara-tradisi-dan-masa-depan-minangkabau/',
                'image' => 'https://drive.google.com/file/d/1eDmynCA_HRNQQJG1f5V3mw2WTTVt5B3P/view?usp=drive_link',
            ],
            [
                'title' => 'Nagari Minangkabau',
                'province' => 'Sumatera Barat',
                'category' => 'Cerita Atau Legenda',
                'origin' => 'Minangkabau, Sumatera Barat',
                'description' => 'Asal usul Nagari Minangkabau berasal dari legenda adu kerbau antara penduduk set...',
                'source_name' => 'artikel beritaminang.com',
                'source_url' => 'https://www.beritaminang.com/berita/249/legenda-asal-mula-nama-nagari-minangkabau#google_vignette',
                'image' => 'https://drive.google.com/file/d/1FEcacqQtoyjdimvAW8c0-DmUtIRRF5fi/view?usp=drive_link',
            ],
            [
                'title' => 'Pacu Jalur',
                'province' => 'Riau',
                'category' => 'Adat dan Tradisi',
                'origin' => 'Kabupaten Kuantan Singingi, Riau',
                'description' => 'adalah perlombaan tradisional dayung sampan di Kabupaten Kuantan Singingi, Riau....',
                'source_name' => 'Wikipedia',
                'source_url' => 'https://id.wikipedia.org/wiki/Pacu_jalur',
                'image' => 'https://drive.google.com/file/d/1A2yk_PO8DhHU8hN3JshRADenITPINLKW/view?usp=drive_link',
            ],
            [
                'title' => 'Bahasa Melayu Riau',
                'province' => 'Riau',
                'category' => 'Bahasa Dan Sastra',
                'origin' => 'Riau',
                'description' => 'adalah bentuk asli bahasa Melayu yang diturunkan langsung dari bahasa Melayu Kun...',
                'source_name' => 'Wikipedia',
                'source_url' => 'https://id.wikipedia.org/wiki/Bahasa_Melayu_Riau',
                'image' => 'https://drive.google.com/file/d/1pIrifDCG8IEhH-sUEG0jkTOp0WUO_xPC/view?usp=drive_link',
            ],
            [
                'title' => 'Batu Belah Batu Betangkup',
                'province' => 'Riau',
                'category' => 'Cerita Atau Legenda',
                'origin' => 'Indragiri Hilir, Riau',
                'description' => 'Batu Belah Batu Betangkup adalah cerita rakyat dari Indragiri Hilir, Riau, tenta...',
                'source_name' => 'potretnews.com',
                'source_url' => 'https://www.potretnews.com/artikel/potret-riau/2016/01/01/cerita-rakyat-dari-inhil-riau-batu-belah-batu-betangkup/',
                'image' => 'https://drive.google.com/file/d/1uTOAsF_619jSPQi38QHV7Mz-TTjO6rH7/view?usp=drive_link',
            ],
            [
                'title' => 'Mandi Safar',
                'province' => 'Kepulauan Riau',
                'category' => 'Adat dan Tradisi',
                'origin' => 'Kabupaten Lingga, Kepulauan Riau',
                'description' => 'Mandi Safar merupakan tradisi budaya Melayu di Kepulauan Riau yang telah ditetap...',
                'source_name' => 'indepthnews.id',
                'source_url' => 'https://indepthnews.id/mandi-safar-warisan-budaya-lingga-kepulauan-riau/',
                'image' => 'https://drive.google.com/file/d/1glXVpZFqNh_q5qSYNDIecXosJljfjRYB/view?usp=drive_link',
            ],
            [
                'title' => 'Gurindam Dua Belas',
                'province' => 'Kepulauan Riau',
                'category' => 'Bahasa Dan Sastra',
                'origin' => 'Kepulauan Riau',
                'description' => 'Gurindam Dua Belas adalah karya sastra atau puisi didaktik (Syi\'r Al-Irsyadi) y...',
                'source_name' => 'Kompas.com',
                'source_url' => 'https://regional.kompas.com/read/2022/11/05/154757578/gurindam-dua-belas-karya-raja-ali-haji-pengertian-sejarah-ciri-ciri-dan-isi?page=all',
                'image' => 'https://drive.google.com/file/d/1TuaP9vuuesuPmXoImtg2u5L_q8EUs3pt/view?usp=drive_link',
            ],
            [
                'title' => 'Legenda Batu Ampar',
                'province' => 'Kepulauan Riau',
                'category' => 'Cerita Atau Legenda',
                'origin' => 'Kota Batam, Kepulauan Riau',
                'description' => 'Cerita rakyat yang diceritakan secara turun-temurun ini mengisahkan asal-usul te...',
                'source_name' => 'Kompas.com',
                'source_url' => 'https://regional.kompas.com/read/2022/06/05/105255678/legenda-batu-ampar-wilayah-yang-terbentuk-dari-kekuatan-lemparan-si-badang?page=all',
                'image' => 'https://drive.google.com/file/d/1zqpLlbITBvwSSKbUZHxRYAymccX9LlHZ/view?usp=drive_link',
            ],
            [
                'title' => 'Berburu Sumbun',
                'province' => 'Jambi',
                'category' => 'Adat dan Tradisi',
                'origin' => 'Masyarakat Pesisir Jambi, khususnya suku Duano',
                'description' => 'Bagi masyarakat pesisir, khususnya Suku Duano, ada Tradisi Berburu Sumbun yang k...',
                'source_name' => 'BPSDM Provinsi Jambi',
                'source_url' => 'https://portalbpsdm.jambiprov.go.id/artikel/buku-sastra/warisan-budaya-dan-kekayaan-tradisi-suku-jambi/#1_Upacara_Adat_Kumau',
                'image' => 'https://drive.google.com/file/d/1oCuNxKWDyVKQ0QXManbxbAX8sztJNv25/view?usp=drive_link',
            ],
            [
                'title' => 'Seloko Jambi',
                'province' => 'Jambi',
                'category' => 'Bahasa Dan Sastra',
                'origin' => 'Jambi',
                'description' => 'Seloko Jambi adalah salah satu bentuk tradisi lisan masyarakat Jambi yang diwari...',
                'source_name' => 'Journal UIN Alauddin Makassar',
                'source_url' => 'https://journal.uin-alauddin.ac.id/index.php/rihlah/article/download/56778/22578/182255',
                'image' => 'https://drive.google.com/file/d/1UwJjCo-4-pGwjflw4e4ty2xPS9Y8nSZf/view?usp=drive_link',
            ],
            [
                'title' => 'Orang Kayo Hitam',
                'province' => 'Jambi',
                'category' => 'Cerita Atau Legenda',
                'origin' => 'Jambi',
                'description' => 'Orang Kayo Hitam adalah tokoh legendaris dalam cerita adat masyarakat Jambi yang...',
                'source_name' => 'Detik Sumbagsel',
                'source_url' => 'https://www.detik.com/sumbagsel/budaya/d-6980236/5-cerita-rakyat-populer-yang-berasal-dari-jambi',
                'image' => 'https://drive.google.com/file/d/1QlssVIUb7YDw7uv6PaPEwIhItMmDOce0/view?usp=drive_link',
            ],
            [
                'title' => 'Tabut',
                'province' => 'Bengkulu',
                'category' => 'Adat dan Tradisi',
                'origin' => 'Bengkulu',
                'description' => 'Festival Tabut merupakan tradisi budaya masyarakat Bengkulu yang telah berlangsu...',
                'source_name' => 'Kementerian Pariwisata RI',
                'source_url' => 'https://kemenpar.go.id/berita/mengenal-festival-tabut-warisan-sejarah-identitas-budaya-dan-daya-tarik-pariwisata-bengkulu',
                'image' => 'https://drive.google.com/file/d/1I9lA5f7fn7dpwm8DncOMKaNrfIO-eGKu/view?usp=drive_link',
            ],
            [
                'title' => 'Dialek Muko-muko',
                'province' => 'Bengkulu',
                'category' => 'Bahasa Dan Sastra',
                'origin' => 'Bengkulu',
                'description' => 'Bahasa Mukomuko (Bahaso Mukomuko) adalah bahasa dalam rumpun bahasa Minangkabaui...',
                'source_name' => 'Wikipedia',
                'source_url' => 'https://id.wikipedia.org/wiki/Bahasa_Mukomuko',
                'image' => 'https://drive.google.com/file/d/13Q2Zd7kiUiZH9hPiowldnJE4VWALO1s0/view?usp=drive_link',
            ],
            [
                'title' => 'Putri Gading Cempaka',
                'province' => 'Bengkulu',
                'category' => 'Cerita Atau Legenda',
                'origin' => 'Bengkulu',
                'description' => 'Putri Gading Cempaka adalah tokoh perempuan yang dalam tradisi sejarah lokal Ben...',
                'source_name' => 'bencooleanmall',
                'source_url' => 'https://bencoolenmall.com/sejarah-putri-gading-cempaka-bengkulu/',
                'image' => 'https://drive.google.com/file/d/19I0QnLgl9UHjyhQ7wQOLO6UvrPKB0jL2/view?usp=drive_link',
            ],
            [
                'title' => 'Ngobeng',
                'province' => 'Sumatera Selatan',
                'category' => 'Adat dan Tradisi',
                'origin' => 'Sumatera Selatan',
                'description' => 'Ngobeng ada tradisi menghidangkan makanan dalam kegiatan adat Palembang seperti ...',
                'source_name' => 'Kemendikdasmen',
                'source_url' => 'https://referensi.data.kemendikdasmen.go.id/budayakita/wbtb/objek/AA000404',
                'image' => 'https://drive.google.com/file/d/11zq2UzPcDT14HkevSdnXuYU-BLaIfpYt/view?usp=drive_link',
            ],
            [
                'title' => 'Komering',
                'province' => 'Sumatera Selatan',
                'category' => 'Bahasa Dan Sastra',
                'origin' => 'Sumatera Selatan',
                'description' => 'Bahasa Komering, dialek Umum, adalah bahasa yang dituturkan oleh suku Komering y...',
                'source_name' => 'Kemendikdasmen',
                'source_url' => 'https://petabahasa.kemendikdasmen.go.id/infobahasa.php?idb=30',
                'image' => 'https://drive.google.com/file/d/1QupDOEqHWjMYiI04BRQkW2dxXHbsXm5J/view?usp=drive_link',
            ],
            [
                'title' => 'Legenda Sang Pendekar Si Pahit Lidah',
                'province' => 'Sumatera Selatan',
                'category' => 'Cerita Atau Legenda',
                'origin' => 'Sumatera Selatan',
                'description' => 'Legenda Sang Pendekar Si Pahit Lidah (Serunting Sakti) Si Pahit Lidah adalah sal...',
                'source_name' => 'National Geographic Indonesia',
                'source_url' => 'https://nationalgeographic.grid.id/read/133895822/mitologi-si-pahit-lidah-yang-diyakini-benar-terjadi-di-sumatra-selatan?page=all',
                'image' => 'https://drive.google.com/file/d/1nevrsZx3mF9a-VHoKHC1evGDhRBL76f0/view?usp=drive_link',
            ],
            [
                'title' => 'Muang Jong',
                'province' => 'Bangka Belitung',
                'category' => 'Adat dan Tradisi',
                'origin' => 'Belitung',
                'description' => 'Ritual adat masyarakat Suku Sawang/Orang Laut yang secara harfiah berarti mengan...',
                'source_name' => 'Wartamu.id',
                'source_url' => 'Tradisi “Muang Jong” Masyarakat Belitung – WARTAMU.ID',
                'image' => 'https://drive.google.com/file/d/1apvNZZqtuNxXCGSlERhsFKSBWsTNFgqS/view?usp=drive_link',
            ],
            [
                'title' => 'Campak',
                'province' => 'Bangka Belitung',
                'category' => 'Bahasa Dan Sastra',
                'origin' => 'Pulau Bangka',
                'description' => 'Bentuk pantun Melayu Bangka yang dinyanyikan oleh muda-mudi, biasanya berkaitan ...',
                'source_name' => 'Indonesia Kaya',
                'source_url' => 'Campak: Ajang Adu Keahlian Berpantun Khas Belitung - Indonesia Kaya',
                'image' => 'https://drive.google.com/file/d/1xjJCR7I5rf8BLsGixRE3Mj79LsmqcOl7/view?usp=drive_link',
            ],
            [
                'title' => 'Putri Nibung di Sarang Lanun',
                'province' => 'Bangka Belitung',
                'category' => 'Cerita Atau Legenda',
                'origin' => 'Bangka Belitung',
                'description' => 'Dalam versi aslinya, cerita ini berjudul “Putri Nibung dan Manuang Keling”. Demi...',
                'source_name' => 'Kemendikdasmen',
                'source_url' => 'Putri Nibung di sarang lanun : cerita rakyat Bangka Belitung - Repositori Institusi Kementerian Pendidikan dan Kebudayaan',
                'image' => 'https://drive.google.com/file/d/1F7TnF6khRjr-HaxEv42JPHH3z8jN2nwi/view?usp=drive_link',
            ],
            [
                'title' => 'Begawi',
                'province' => 'Lampung',
                'category' => 'Adat dan Tradisi',
                'origin' => 'Pepadun',
                'description' => 'Begawi atau Gawi merupakan suatu perayaan atas hasil kerja adat dalam komunitas ...',
                'source_name' => 'Wikipedia',
                'source_url' => 'https://id.wikipedia.org/wiki/Begawi',
                'image' => 'https://drive.google.com/file/d/1n7nwZ7bCWAXRtr7-G5IbzaAT3R4xSypv/view?usp=drive_link',
            ],
            [
                'title' => 'Sesikun/Sekiman',
                'province' => 'Lampung',
                'category' => 'Bahasa Dan Sastra',
                'origin' => 'Lampung',
                'description' => 'Sesikun/Sekiman adalah jenis sastra yang menggunakan bahasa kiasan, atau tidak b...',
                'source_name' => 'Wikipedia',
                'source_url' => 'https://id.wikipedia.org/wiki/Sastra_Lampung',
                'image' => 'https://drive.google.com/file/d/1tITXHYCq_zXu4dIV5cLNSnS0yseXCzCM/view?usp=drive_link',
            ],
            [
                'title' => 'Legenda Sumur Putri',
                'province' => 'Lampung',
                'category' => 'Cerita Atau Legenda',
                'origin' => 'Teluk Betung',
                'description' => 'Legenda Sumur Putri adalah salah satu cerita rakyat yang sangat terkenal di Lamp...',
                'source_name' => 'Traveloka',
                'source_url' => 'https://www.traveloka.com/id-id/explore/destination/cerita-rakyat-lampung-trp/549266?utm_id=YAYGNHV0',
                'image' => 'https://drive.google.com/file/d/1qTeamcBQTZ5YHrv0DKbn6S3yIlA3smhJ/view?usp=drive_link',
            ],
        ];

        foreach ($data as $item) {
            // 1. Cari atau buat entitas Provinsi berdasarkan nama dari CSV
            $province = Province::firstOrCreate(
                ['name' => trim($item['province'])],
                ['slug' => Str::slug(trim($item['province']))]
            );

            // 2. Cari atau buat entitas Kategori berdasarkan nama dari CSV
            $category = Category::firstOrCreate(
                ['name' => trim($item['category'])],
                ['slug' => Str::slug(trim($item['category']))]
            );

            // Konversi Google Drive Link ke Direct Image Link
            $imageUrl = $item['image'];
            if (preg_match('/d\/([a-zA-Z0-9_-]+)/', $imageUrl, $matches)) {
                $imageUrl = 'https://drive.google.com/uc?export=view&id=' . $matches[1];
            }

            // 3. Masukkan data ke tabel cultures dengan FK yang sesuai
            Culture::updateOrCreate(
                ['slug' => Str::slug($item['title'])], // Acuan agar tidak dobel saat di-seed ulang
                [
                    'province_id' => $province->id,
                    'category_id' => $category->id,
                    'title'       => trim($item['title']),
                    'desc'        => $item['description'],
                    'image'       => $imageUrl,
                    'status'      => 'published',
                    'featured'    => false,
                    'source'      => $item['source_name'] . ' - ' . $item['source_url'],
                    'facts'       => json_encode(['origin' => $item['origin']]), // Memasukkan daerah asal ke kolom JSON
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]
            );
        }
    }
}

