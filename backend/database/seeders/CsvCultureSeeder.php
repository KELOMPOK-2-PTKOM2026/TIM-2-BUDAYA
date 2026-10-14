<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Culture;
use App\Models\Province;
use App\Models\Category;

class CsvCultureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure all categories from the CSV exist
        $categoriesMap = [
            'Adat dan Tradisi' => Category::firstOrCreate(['slug' => 'adat-dan-tradisi'], ['name' => 'Adat dan Tradisi']),
            'Bahasa Dan Sastra' => Category::firstOrCreate(['slug' => 'bahasa-dan-sastra'], ['name' => 'Bahasa Dan Sastra']),
            'Cerita Atau Legenda' => Category::firstOrCreate(['slug' => 'cerita-atau-legenda'], ['name' => 'Cerita Atau Legenda']),
        ];

        // 2. Resolve Provinces
        $provinces = Province::all()->keyBy(fn($p) => strtolower(trim($p->name)));

        // Helper to resolve province id
        $getProvinceId = function ($name) use ($provinces) {
            $key = strtolower(trim($name));
            if (isset($provinces[$key])) {
                return $provinces[$key]->id;
            }
            foreach ($provinces as $pName => $prov) {
                if (str_contains($pName, $key) || str_contains($key, $pName)) {
                    return $prov->id;
                }
            }
            return 1;
        };

        // 3. Culture entries mapped and enriched from CSV
        $items = [
            // ACEH
            [
                'province' => 'Aceh',
                'category' => 'Adat dan Tradisi',
                'title' => 'Mak Meugang',
                'slug' => 'mak-meugang',
                'image' => '/images/dummy-kuliner.svg',
                'desc' => 'Tradisi menyembelih dan memasak daging untuk menyambut Ramadan, Idulfitri, dan Iduladha. Tradisi ini juga mengandung nilai berbagi, sedekah, dan kebersamaan.',
                'featured' => false,
                'status' => 'published',
                'source' => 'detiksumut (Apa Itu Meugang? Tradisi Unik Aceh Menyambut Bulan Puasa)',
                'history' => 'Mak Meugang (atau Meugang) merupakan tradisi sakral masyarakat Aceh yang telah berlangsung sejak masa Kesultanan Aceh Darussalam pada abad ke-16. Menjelang hari-hari besar Islam seperti bulan suci Ramadan, Idulfitri, dan Iduladha, masyarakat berkumpul bersama keluarga untuk menyembelih dan memasak daging sapi atau kerbau, lalu menikmatinya bersama serta membagikannya kepada yatim piatu dan kaum duafa.',
                'facts' => [
                    'Berasal dari Gayo Lues, Provinsi Aceh',
                    'Tradisi perayaan daging sakral menyambut Ramadan, Idulfitri, dan Iduladha',
                    'Simbol rasa syukur, kebersamaan, dan kepedulian sosial antar sesama',
                ],
                'images' => ['/images/dummy-kuliner.svg'],
            ],
            [
                'province' => 'Aceh',
                'category' => 'Bahasa Dan Sastra',
                'title' => 'Didong',
                'slug' => 'didong',
                'image' => '/images/dummy-budaya.svg',
                'desc' => 'Kesenian rakyat yang memadukan unsur sastra lisan, nyanyian puitis, dan pertunjukan seni tepuk tangan berirama masyarakat suku Gayo.',
                'featured' => false,
                'status' => 'published',
                'source' => 'Wikipedia (Didong)',
                'history' => 'Didong adalah kesenian rakyat khas suku Gayo di wilayah dataran tinggi Aceh Tengah dan Bener Meriah. Kata Didong dipercaya berasal dari kata \'dendang\' yang berarti menyanyi sambil menghibur hati. Dalam pertunjukannya, sekelompok pria duduk melingkar bersila sambil melantunkan syair-syair puitis penuh makna filosofis, kritik sosial, dan nasihat agama dengan iringan tepukan bantal kecil serta tepuk tangan yang berirama ritmis.',
                'facts' => [
                    'Berasal dari Dataran Tinggi Gayo, Aceh Tengah',
                    'Memadukan seni sastra puisi vokal dengan perkusi tepukan bantal berirama dinamis',
                    'Media ekspresi penyampaian petuah moral, kritik sosial, dan syiar agama',
                ],
                'images' => ['/images/dummy-budaya.svg'],
            ],
            [
                'province' => 'Aceh',
                'category' => 'Cerita Atau Legenda',
                'title' => 'Mon Seuribee',
                'slug' => 'mon-seuribee',
                'image' => '/images/dummy-budaya.svg',
                'desc' => 'Legenda masyarakat tentang Teungku Muhammad Syah Sabi (Teungku Batèe Putéh) dan sumur bersejarah yang sarat pesan keimanan, kejujuran, tanggung jawab, dan gotong royong.',
                'featured' => false,
                'status' => 'published',
                'source' => 'Jurnal Ilmiah Pendidikan Bahasa dan Sastra Indonesia Universitas Malikussaleh (Kande)',
                'history' => 'Legenda Mon Seuribee (Sumur Seribu) berpusat di Gampong Parang IX, Matangkuli, Kabupaten Aceh Utara. Cerita tutur lisan ini mengisahkan keteladanan seorang ulama karismatik bernama Teungku Muhammad Syah Sabi (dikenal juga sebagai Teungku Batèe Putéh). Legenda ini mengajarkan pentingnya menjaga sumber air, kejujuran dalam berjanji, keteguhan iman, dan tradisi gotong royong yang mengakar kuat di kalangan masyarakat pedesaan Aceh.',
                'facts' => [
                    'Berasal dari Gampong Parang IX, Matangkuli, Aceh Utara',
                    'Mengisahkan keteladanan ulama Teungku Muhammad Syah Sabi / Teungku Batèe Putéh',
                    'Menanamkan nilai-nilai luhur kejujuran, keteguhan iman, dan gotong royong',
                ],
                'images' => ['/images/dummy-budaya.svg'],
            ],

            // SUMATERA UTARA
            [
                'province' => 'Sumatera Utara',
                'category' => 'Adat dan Tradisi',
                'title' => 'Tari Moyo',
                'slug' => 'tari-moyo',
                'image' => '/images/dummy-tarian.svg',
                'desc' => 'Seni tari tradisional kepulauan Nias yang melambangkan kepakan sayap burung elang (moyo), menyimbolkan keuletan, perlindungan, dan doa restu bagi sesama.',
                'featured' => true,
                'status' => 'published',
                'source' => 'Wikipedia (https://id.wikipedia.org/wiki/Tari_Moyo)',
                'history' => 'Tari Moyo atau tari elang merupakan salah satu seni tari tradisional yang berasal dari Pulau Nias, Sumatera Utara. Secara etimologi, Moyo dalam bahasa Nias berarti burung elang. Hewan unggas tersebut menjadi ilham bagi masyarakat Nias dalam menciptakan gerakan tarian yang menggambarkan seekor burung elang mengepakkan sayapnya tanpa mengenal lelah, melambangkan keuletan menaklukkan tantangan demi kemakmuran bersama.',
                'facts' => [
                    'Berasal dari Kepulauan Nias, Sumatera Utara',
                    'Secara etimologi, Moyo berarti burung elang dalam bahasa Nias',
                    'Ditarikan oleh penari wanita dengan gerakan anggun menyerupai elang yang mengepakkan sayap',
                ],
                'images' => ['/images/dummy-tarian.svg'],
            ],
            [
                'province' => 'Sumatera Utara',
                'category' => 'Bahasa Dan Sastra',
                'title' => 'Pustaha Laklak',
                'slug' => 'pustaha-laklak',
                'image' => '/images/kain-ulos.jpg',
                'desc' => 'Kitab kuno masyarakat Batak Toba berbahan kulit kayu yang berfungsi sebagai media pencatatan ilmu pengobatan, astronomi lokal, dan kearifan leluhur.',
                'featured' => false,
                'status' => 'published',
                'source' => 'detiksumut (https://www.detik.com/sumut/budaya/d-8334861/pustaha-laklak-kitab-kuno-batak-toba-yang-menyimpan-ilmu-dan-tradisi-leluhur/amp)',
                'history' => 'Pustaha Laklak merupakan kitab naskah kuno masyarakat Batak Toba yang berfungsi sebagai media pencatatan pengetahuan tradisional. Naskah ini ditulis oleh para Datu (cendekiawan adat) menggunakan aksara Batak dan tinta alami pada kulit pohon alim yang dilipat seperti akordeon. Keberadaan naskah ini membuktikan bahwa masyarakat Batak telah memiliki tradisi literasi dan sistem transmisi ilmu pengetahuan yang maju jauh sebelum masa kolonial.',
                'facts' => [
                    'Berasal dari tanah Batak Toba, Sumatera Utara',
                    'Ditulis di atas lembaran kulit kayu pohon alim beraksara Batak kuno',
                    'Memuat catatan ilmu pengobatan herbal, kalender astronomi parhalaan, dan hukum adat',
                ],
                'images' => ['/images/kain-ulos.jpg'],
            ],
            [
                'province' => 'Sumatera Utara',
                'category' => 'Cerita Atau Legenda',
                'title' => 'Legenda Danau Toba',
                'slug' => 'legenda-danau-toba',
                'image' => 'https://images.unsplash.com/photo-1569081562679-6d71c00aab86?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
                'desc' => 'Sastra lisan legendaris mengenai asal-usul terbentuknya danau vulkanik terbesar di Asia Tenggara dan Pulau Samosir akibat pelanggaran janji pemuda kepada putri ikan mas.',
                'featured' => true,
                'status' => 'published',
                'source' => 'Wikipedia (https://id.wikipedia.org/wiki/Legenda_Danau_Toba)',
                'history' => 'Legenda Danau Toba adalah salah satu cerita rakyat paling terkenal di Indonesia. Kisah ini berawal dari seorang petani bernama Toba yang memancing ikan mas ajaib yang menjelma menjadi wanita berparas jelita. Mereka menikah dengan perjanjian suci bahwa Toba tidak boleh mengungkit asal-usul istrinya. Namun di kemudian hari saat emosi, Toba melanggar janji tersebut, memicu murka alam yang menenggelamkan lembah menjadi danau megah yang kini dikenal sebagai Danau Toba.',
                'facts' => [
                    'Berasal dari kawasan Kaldera Danau Toba, Sumatera Utara',
                    'Mengisahkan sumpah antara petani bernama Toba dan seorang putri ikan mas',
                    'Menyampaikan pesan moral fundamental mengenai kewajiban menepati janji dan amanah',
                ],
                'images' => ['https://images.unsplash.com/photo-1569081562679-6d71c00aab86?crop=entropy&cs=srgb&fm=jpg&q=85&w=800'],
            ],

            // SUMATERA BARAT
            [
                'province' => 'Sumatera Barat',
                'category' => 'Adat dan Tradisi',
                'title' => 'Batagak Pangulu',
                'slug' => 'batagak-pangulu',
                'image' => 'https://lh3.googleusercontent.com/d/19fLJxoS-lLRKGwcpUE-iIpKjqcnnpGAN',
                'desc' => 'Upacara peresmian dan pelantikan penghulu (pemimpin kaum) di Ranah Minang yang dilakukan melalui musyawarah mufakat demi menegakkan kepemimpinan adat yang berkeadilan.',
                'featured' => true,
                'status' => 'published',
                'source' => 'detiksumut (https://www.detik.com/sumut/budaya/d-7108633/mengenal-upacara-batagak-pangulu-pada-adat-minangkabau)',
                'history' => 'Batagak Pangulu merupakan prosesi upacara adat agung pengangkatan seorang pemimpin kaum (penghulu/datuk) di Minangkabau. Dalam sistem matrilineal Minangkabau, gelar penghulu tidak dapat diwariskan begitu saja melainkan harus disepakati secara bulat oleh kerapatan suku dan ninik mamak. Upacara ini melibatkan pemotongan kerbau adat, perjamuan makan bersama, serta pengucapan sumpah setia untuk memimpin kaum dengan adil dan bijaksana.',
                'facts' => [
                    'Berasal dari ranah adat Minangkabau, Sumatera Barat',
                    'Prosesi sakral musyawarah mufakat pelantikan pemegang gelar kehormatan Datuk Pangulu',
                    'Melambangkan amanah kepemimpinan mengayomi kaum dan menegakkan hukum adat',
                ],
                'images' => ['https://lh3.googleusercontent.com/d/19fLJxoS-lLRKGwcpUE-iIpKjqcnnpGAN'],
            ],
            [
                'province' => 'Sumatera Barat',
                'category' => 'Bahasa Dan Sastra',
                'title' => 'Kaba Minangkabau',
                'slug' => 'kaba-minangkabau',
                'image' => 'https://lh3.googleusercontent.com/d/1eDmynCA_HRNQQJG1f5V3mw2WTTVt5B3P',
                'desc' => 'Sastra naratif tutur lisan masyarakat Minangkabau yang dibawakan oleh tukang kaba dengan iringan musik tradisional, sarat falsafah hidup dan petuah adat.',
                'featured' => false,
                'status' => 'published',
                'source' => 'Kemendikdasmen (Balai Bahasa Sumbar: https://balaibahasa-sumbar.kemendikdasmen.go.id/kaba-jembatan-antara-tradisi-dan-masa-depan-minangkabau/)',
                'history' => 'Kaba merupakan sastra naratif khas Minangkabau yang selama berabad-abad hidup melalui tradisi lisan sebelum bertransformasi menjadi teks tertulis. Penceritaan kaba dilakukan oleh seorang tukang kaba dalam pertunjukan bakaba yang diiringi gesekan rabab atau tiupan saluang. Setiap pementasan bersifat dinamis dan interaktif, mengajarkan tata karma bermasyarakat, keteguhan hati perantau, serta kearifan lokal \'alam takambang jadi guru\'.',
                'facts' => [
                    'Berasal dari ranah Minangkabau, Sumatera Barat',
                    'Bentuk sastra tutur lisan dinamis yang dilantunkan oleh Tukang Kaba',
                    'Karya-karya masyhur meliputi Kaba Cindua Mato, Kaba Malin Deman, dan Kaba Si Umbut Muda',
                ],
                'images' => ['https://lh3.googleusercontent.com/d/1eDmynCA_HRNQQJG1f5V3mw2WTTVt5B3P'],
            ],
            [
                'province' => 'Sumatera Barat',
                'category' => 'Cerita Atau Legenda',
                'title' => 'Nagari Minangkabau',
                'slug' => 'nagari-minangkabau',
                'image' => 'https://images.unsplash.com/photo-1606633007433-a1abd835f6cd?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
                'desc' => 'Legenda asal-usul toponimi Minangkabau yang lahir dari kemenangan adu kerbau dengan siasat cerdik anak kerbau Minang melawan penyerang dari luar.',
                'featured' => false,
                'status' => 'published',
                'source' => 'beritaminang.com (https://www.beritaminang.com/berita/249/legenda-asal-mula-nama-nagari-minangkabau)',
                'history' => 'Asal usul nama Minangkabau bermula dari legenda rakyat tentang perselisihan teritorial dengan kerajaan luar. Demi menghindari perang berdarah, disepakati pertandingan adu kerbau. Pasukan lawan membawa seekor kerbau raksasa yang buas, sedangkan tetua Minang memilih anak kerbau lapar yang tanduknya dipasangi pisau besi tajam runcing. Ketika dilepas, anak kerbau yang mengira kerbau lawan adalah induknya langsung menyeruduk untuk menyusu hingga merobek perut kerbau lawan. Kemenangan ini melahirkan nama \'manang kabau\' yang menjadi identitas kebanggaan suku Minangkabau.',
                'facts' => [
                    'Berasal dari wilayah adat Luhak Nan Tigo, Sumatera Barat',
                    'Mengisahkan siasat cerdik adu kerbau untuk mencegah pertumpahan darah perang',
                    'Asal mula penyebutan nama \'Minangkabau\' dari sorak kemenangan \'manang kabau\'',
                ],
                'images' => ['https://images.unsplash.com/photo-1606633007433-a1abd835f6cd?crop=entropy&cs=srgb&fm=jpg&q=85&w=800'],
            ],

            // KEPULAUAN RIAU
            [
                'province' => 'Kepulauan Riau',
                'category' => 'Adat dan Tradisi',
                'title' => 'Mandi Safar',
                'slug' => 'mandi-safar',
                'image' => 'https://lh3.googleusercontent.com/d/1glXVpZFqNh_q5qSYNDIecXosJljfjRYB',
                'desc' => 'Tradisi tolak bala masyarakat Melayu Lingga yang digelar pada hari Rabu terakhir bulan Safar, berakar dari era Kesultanan Riau-Lingga dan telah ditetapkan sebagai WBTB Indonesia.',
                'featured' => true,
                'status' => 'published',
                'source' => 'indepthnews.id (https://indepthnews.id/mandi-safar-warisan-budaya-lingga-kepulauan-riau/)',
                'history' => 'Mandi Safar merupakan tradisi budaya Melayu di Kepulauan Riau yang telah ditetapkan sebagai Warisan Budaya Tak Benda (WBTB) Indonesia pada tahun 2018. Tradisi penjagaan warisan nenek moyang ini dilakukan sejak pagi hingga sore hari di pantai atau pemandian alam. Tradisi ini sudah rutin dilaksanakan masyarakat setempat sejak era Sultan Abdulrahman Muazamsyah memerintah pada tahun 1883-1911, diawali dengan pembacaan doa tolak bala dan meminum air wafak demi memohon perlindungan dari mara bahaya.',
                'facts' => [
                    'Berasal dari Kabupaten Lingga, Bunda Tanah Melayu, Kepulauan Riau',
                    'Ditetapkan sebagai Warisan Budaya Tak Benda (WBTB) Indonesia pada 2018',
                    'Telah dilaksanakan sejak masa Sultan Abdulrahman Muazamsyah (1883-1911)',
                ],
                'images' => ['https://lh3.googleusercontent.com/d/1glXVpZFqNh_q5qSYNDIecXosJljfjRYB'],
            ],
            [
                'province' => 'Kepulauan Riau',
                'category' => 'Bahasa Dan Sastra',
                'title' => 'Gurindam Dua Belas',
                'slug' => 'gurindam-dua-belas',
                'image' => 'https://lh3.googleusercontent.com/d/1TuaP9vuuesuPmXoImtg2u5L_q8EUs3pt',
                'desc' => 'Karya puisi didaktik monumental gubahan Raja Ali Haji pada tahun 1847 di Pulau Penyengat, memuat 12 pasal tuntunan moral, akhlak, dan kepemimpinan Islam-Melayu.',
                'featured' => true,
                'status' => 'published',
                'source' => 'Kompas.com (https://regional.kompas.com/read/2022/11/05/154757578/gurindam-dua-belas-karya-raja-ali-haji-pengertian-sejarah-ciri-ciri-dan-isi?page=all)',
                'history' => 'Gurindam Dua Belas adalah karya sastra puisi didaktik (Syi\'ir Al-Irsyadi) yang ditulis menggunakan bahasa Melayu klasik oleh pujangga besar Raja Ali Haji di Pulau Penyengat. Karya ini berisi kumpulan nasihat kehidupan yang berkaitan sangat erat dengan ajaran Islam dan tata pergaulan Melayu. Gurindam ini terdiri atas baris berpasangan yang bersajak a-a, di mana baris pertama menyatakan persoalan dan baris kedua memberikan jawabannya, menjadi landasan penting dalam perkembangan bahasa Indonesia modern.',
                'facts' => [
                    'Berasal dari Pulau Penyengat, Kepulauan Riau',
                    'Dikarang oleh Pahlawan Nasional dan bapak bahasa Indonesia, Raja Ali Haji, pada tahun 1847',
                    'Terdiri atas 12 pasal yang merangkum ajaran budi pekerti, kepemimpinan, dan hubungan spiritual',
                ],
                'images' => ['https://lh3.googleusercontent.com/d/1TuaP9vuuesuPmXoImtg2u5L_q8EUs3pt'],
            ],
            [
                'province' => 'Kepulauan Riau',
                'category' => 'Cerita Atau Legenda',
                'title' => 'Legenda Batu Ampar',
                'slug' => 'legenda-batu-ampar',
                'image' => 'https://lh3.googleusercontent.com/d/1zqpLlbITBvwSSKbUZHxRYAymccX9LlHZ',
                'desc' => 'Cerita rakyat Batam mengenai asal-usul wilayah Batu Ampar yang tercipta dari batu raksasa yang terhampar hasil kekuatan lemparan pemuda perkasa bernama Si Badang.',
                'featured' => false,
                'status' => 'published',
                'source' => 'Kompas.com (https://regional.kompas.com/read/2022/06/05/105255678/legenda-batu-ampar-wilayah-yang-terbesar-dari-kekuatan-lemparan-si-badang?page=all)',
                'history' => 'Cerita rakyat yang diceritakan secara turun-temurun ini mengisahkan asal-usul terbentuknya wilayah Batu Ampar di Kota Batam yang tercipta dari kekuatan lemparan seorang pemuda bernama Si Badang. Si Badang awalnya dikenal sebagai bujang ceking dan kumal yang sabar dan jujur. Suatu hari, berkat ketulusannya, ia dianugerahi tenaga yang tiada tanding. Dalam sebuah unjuk kekuatan di hadapan raja, ia melemparkan bongkahan batu besar melintasi selat yang kemudian jatuh terhampar di pesisir Batam, yang kelak dikenal sebagai Batu Ampar.',
                'facts' => [
                    'Berasal dari kawasan pesisir Batu Ampar, Kota Batam, Kepulauan Riau',
                    'Mengisahkan kepahlawanan Si Badang, pemuda bersahaja yang beroleh kekuatan ajaib',
                    'Menjadi toponimi penting bagi salah satu kawasan pelabuhan tertua di Pulau Batam',
                ],
                'images' => ['https://lh3.googleusercontent.com/d/1zqpLlbITBvwSSKbUZHxRYAymccX9LlHZ'],
            ],

            // BENGKULU
            [
                'province' => 'Bengkulu',
                'category' => 'Adat dan Tradisi',
                'title' => 'Tabut',
                'slug' => 'tabut-bengkulu',
                'image' => '/images/dummy-upacara.svg',
                'desc' => 'Upacara peringatan budaya tahunan masyarakat Bengkulu selama 1-10 Muharam dengan arak-arakan menara Tabut, akulturasi budaya Islam Timur Tengah dan Melayu pesisir.',
                'featured' => true,
                'status' => 'published',
                'source' => 'Kementerian Pariwisata RI (https://kemenpar.go.id/berita/mengenal-festival-tabut-warisan-sejarah-identitas-budaya-dan-daya-tarik-pariwisata-bengkulu)',
                'history' => 'Festival Tabut merupakan tradisi budaya masyarakat Bengkulu yang telah berlangsung selama berabad-abad sejak era kolonial Inggris pada masa pembangunan Benteng Marlborough. Dibawa oleh para pengrajin Muslim asal India dan diserap ke dalam kearifan lokal, perayaan ini memiliki ritual bertahap dari Mengambik Tanah, Duduk Penja, Meradai, Arak Gedang, hingga Tabut Tebuang diiringi tabuhan perkusi tradisional Dhol.',
                'facts' => [
                    'Berasal dari pesisir Kota Bengkulu, Provinsi Bengkulu',
                    'Diadakan setiap tanggal 1 hingga 10 Muharam dalam kalender Hijriah',
                    'Mencerminkan nilai gotong royong tinggi, seni kriya bambu menara, dan musik dol yang menggelegar',
                ],
                'images' => ['/images/dummy-upacara.svg'],
            ],
            [
                'province' => 'Bengkulu',
                'category' => 'Bahasa Dan Sastra',
                'title' => 'Rejang',
                'slug' => 'sastra-rejang',
                'image' => '/images/dummy-budaya.svg',
                'desc' => 'Tradisi literasi lisan dan aksara kuno suku Rejang (Aksara KaGaNga) yang telah digunakan sejak masa pra-kolonial untuk mencatat hukum adat, sastra tutur, dan ilmu pengetahuan.',
                'featured' => false,
                'status' => 'published',
                'source' => 'Kemendikdasmen / Badan Pengembangan dan Pembinaan Bahasa',
                'history' => 'Suku Rejang merupakan suku bangsa tertua yang mendiami lereng pegunungan Bukit Barisan di Bengkulu. Mereka memiliki bahasa daerah sendiri serta sistem aksara kuno yang disebut Aksara Rejang atau KaGaNga. Aksara ini dituliskan pada media alam seperti bilah bambu kering (gelumpai), tanduk kerbau, dan kulit kayu, menjadi bukti tingginya peradaban literasi nusantara di pedalaman Sumatra.',
                'facts' => [
                    'Berasal dari wilayah suku Rejang di dataran Rejang Lebong dan Kepahiang, Bengkulu',
                    'Memiliki aksara tradisional tersendiri bernama Aksara KaGaNga Rejang',
                    'Kaya sastra tutur lisan seperti sambei, nyo, dan kidung adat leluhur',
                ],
                'images' => ['/images/dummy-budaya.svg'],
            ],

            // SUMATERA SELATAN
            [
                'province' => 'Sumatera Selatan',
                'category' => 'Adat dan Tradisi',
                'title' => 'Ngobeng',
                'slug' => 'ngobeng-palembang',
                'image' => '/images/dummy-kuliner.svg',
                'desc' => 'Tradisi tata krama makan bersama secara melingkar duduk bersila dalam perayaan adat Palembang, warisan adab Kesultanan Palembang Darussalam yang mengutamakan kebersamaan.',
                'featured' => false,
                'status' => 'published',
                'source' => 'Kemendikdasmen (https://referensi.data.kemendikdasmen.go.id/budayakita/wbtb/objek/AA000404)',
                'history' => 'Ngobeng adalah tradisi menghidangkan makanan dalam kegiatan adat Palembang seperti acara pernikahan, khitanan, syukuran, dan perayaan hari-hari keagamaan. Tradisi ini telah ada sejak era Kesultanan Palembang Darussalam. Makanan disajikan secara estafet berdiri (shaf) demi mempercepat hidangan sampai ke hadirin. Hidangan ditaruh dalam talam besar yang dinikmati delapan orang secara bersila, menyantap nasi minyak, iwak, dan pulur secara langsung dengan tangan.',
                'facts' => [
                    'Berasal dari Kota Palembang, Sumatera Selatan',
                    'Tradisi santap bersama warisan Kesultanan Palembang Darussalam',
                    'Satu talam makanan dinikmati oleh 8 orang secara bersila dengan cara makan bersuap tangan',
                ],
                'images' => ['/images/dummy-kuliner.svg'],
            ],
            [
                'province' => 'Sumatera Selatan',
                'category' => 'Bahasa Dan Sastra',
                'title' => 'Komering',
                'slug' => 'bahasa-komering',
                'image' => '/images/dummy-budaya.svg',
                'desc' => 'Bahasa daerah dan tradisi tutur suku Komering di Sumatera Selatan yang kaya akan seni bersastra lisan, peribahasa adat, dan syair berpantun pisaan.',
                'featured' => false,
                'status' => 'published',
                'source' => 'Kemendikdasmen (https://petabahasa.kemendikdasmen.go.id/infobahasa.php?idb=30)',
                'history' => 'Bahasa Komering adalah bahasa yang dituturkan oleh suku Komering yang bermukim di sepanjang aliran Sungai Komering, membentang dari tepian Danau Ranau di pegunungan hingga mendekati Palembang. Bahasa ini memiliki kekayaan kosakata adat dan ungkapan kiasan yang digunakan dalam upacara penyerahan adat, musyawarah marga, serta pertunjukan seni bertutur tradisional.',
                'facts' => [
                    'Berasal dari sepanjang aliran Sungai Komering, Sumatera Selatan',
                    'Memiliki dialek khas yang berkerabat dekat dengan rumpun bahasa Lampung',
                    'Memiliki tradisi sastra tutur puitis berbalas pantun adat bernama Pisaan',
                ],
                'images' => ['/images/dummy-budaya.svg'],
            ],
            [
                'province' => 'Sumatera Selatan',
                'category' => 'Cerita Atau Legenda',
                'title' => 'Legenda Sang Pendekar Si Pahit Lidah',
                'slug' => 'legenda-si-pahit-lidah',
                'image' => 'https://images.unsplash.com/photo-1571669829691-9bfdc2943044?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
                'desc' => 'Legenda mitologi paling terkenal dari Sumatera Selatan tentang kesaktian kutukan Pangeran Serunting Sakti (Si Pahit Lidah) yang berkaitan erat dengan tinggalan batu megalitikum Pasemah.',
                'featured' => true,
                'status' => 'published',
                'source' => 'National Geographic Indonesia (https://nationalgeographic.grid.id/read/133895822/mitologi-si-pahit-lidah-yang-diyakini-benar-terjadi-di-sumatra-selatan?page=all)',
                'history' => 'Legenda Sang Pendekar Si Pahit Lidah (Serunting Sakti) merupakan legenda cerita rakyat paling termasyhur dari Sumatera Selatan, khususnya di kawasan Pasemah (Pagar Alam, Lahat, Muara Enim). Menurut legenda, setelah bertapa di bawah pohon mahameru di Gunung Siguntang, Serunting Sakti dianugerahi kesaktian di mana setiap patah kata dan sumpahnya seketika menjadi kenyataan, termasuk mengutuk orang kikir atau sombong menjadi batu megalit yang hingga kini masih dapat dijumpai di kawasan Pasemah.',
                'facts' => [
                    'Berasal dari kawasan Dataran Tinggi Pasemah dan Semendo, Sumatera Selatan',
                    'Menceritakan kesaktian luar biasa ucapan sumpah Pangeran Serunting Sakti',
                    'Secara folklorik sering dihubungkan dengan keberadaan batu megalitikum purba di Lahat dan Pagar Alam',
                ],
                'images' => ['https://images.unsplash.com/photo-1571669829691-9bfdc2943044?crop=entropy&cs=srgb&fm=jpg&q=85&w=800'],
            ],

            // BANGKA BELITUNG
            [
                'province' => 'Bangka Belitung',
                'category' => 'Adat dan Tradisi',
                'title' => 'Muang Jong',
                'slug' => 'muang-jong',
                'image' => '/images/dummy-upacara.svg',
                'desc' => 'Upacara sakral bahari suku Sawang (Orang Laut) di Belitung dengan melarungkan miniatur perahu (jong) ke laut lepas demi memohon perlindungan dan keselamatan para nelayan.',
                'featured' => false,
                'status' => 'published',
                'source' => 'Wartamu.id (Tradisi Muang Jong Masyarakat Belitung)',
                'history' => 'Muang Jong merupakan ritual adat masyarakat Suku Sawang (Orang Laut) yang bermakna mengantarkan atau melarungkan perahu kecil ke lautan lepas. Upacara yang berlangsung selama tiga hari tiga malam ini diadakan menjelang pergantian musim angin muson barat. Dipimpin oleh dukun laut, prosesi diisi tarian Bedendang dan nyanyian laut, diakhiri dengan pelarungan replika perahu jong ke tengah laut sebagai permohonan keselamatan bagi para pencari nafkah di samudra.',
                'facts' => [
                    'Berasal dari suku Sawang / Orang Laut di Pulau Belitung, Bangka Belitung',
                    'Upacara pelarungan miniatur perahu (jong) berhiaskan sesaji ke laut lepas',
                    'Simbol keselarasan hidup manusia dengan laut dan penghormatan kepada penguasa samudra',
                ],
                'images' => ['/images/dummy-upacara.svg'],
            ],
            [
                'province' => 'Bangka Belitung',
                'category' => 'Bahasa Dan Sastra',
                'title' => 'Campak',
                'slug' => 'pantun-campak',
                'image' => '/images/dummy-tarian.svg',
                'desc' => 'Seni sastra tutur pantun Melayu dan tari pergaulan riang khas Bangka Belitung yang menampilkan adu ketangkasan berpantun jenaka antara bujang dan dayang.',
                'featured' => false,
                'status' => 'published',
                'source' => 'Indonesia Kaya (Campak: Ajang Adu Keahlian Berpantun Khas Belitung)',
                'history' => 'Kesenian Campak merupakan tradisi berpantun dan menari yang berkembang subur di kalangan masyarakat Bangka Belitung. Awalnya dimainkan oleh masyarakat pedesaan sehabis panen padi sebagai media hiburan dan mencari jodoh. Dalam pementasan campak, para penari wanita dan pria saling melempar pantun spontan yang cerdas, jenaka, dan sarat nasihat hidup, diiringi alunan musik riang yang memadukan biola, akordeon, dan tifa gendang.',
                'facts' => [
                    'Berasal dari Kepulauan Bangka Belitung',
                    'Bentuk pertunjukan adu kepiawaian berpantun spontan dalam bahasa Melayu Bangka',
                    'Diiringi akulturasi instrumen musik Melayu dan Barat seperti biola, akordeon, dan gong',
                ],
                'images' => ['/images/dummy-tarian.svg'],
            ],
            [
                'province' => 'Bangka Belitung',
                'category' => 'Cerita Atau Legenda',
                'title' => 'Putri Nibung di Sarang Lanun',
                'slug' => 'putri-nibung-di-sarang-lanun',
                'image' => '/images/dummy-budaya.svg',
                'desc' => 'Cerita rakyat Bangka Belitung tentang keajaiban kelahiran Putri Nibung dan kebijaksanaan budi pekertinya yang berhasil meluluhkan serta menyadarkan komplotan perompak laut (lanun).',
                'featured' => false,
                'status' => 'published',
                'source' => 'Kemendikdasmen (Putri Nibung di sarang lanun : cerita rakyat Bangka Belitung)',
                'history' => 'Cerita Putri Nibung di Sarang Lanun mengisahkan tentang perairan kepulauan Bangka Belitung pada masa lampau yang rawan akan serangan lanun (perompak laut). Putri Nibung, yang dalam legenda lahir secara ajaib dari sebuah pohon nibung, digambarkan memiliki kecantikan lahiriah dan keagungan budi. Ketika ia ditawan ke sarang bajak laut, kelembutan tutur kata dan ketulusan hatinya justru meluluhkan keganasan pemimpin lanun dan anak buahnya, membimbing mereka meninggalkan perompakan untuk bertani dan hidup damai.',
                'facts' => [
                    'Berasal dari cerita rakyat tutur kepulauan Bangka Belitung',
                    'Diangkat dalam Gerakan Literasi Nasional oleh Kementerian Pendidikan dan Kebudayaan',
                    'Mengandung amanat moral luhur tentang kekuatan kebaikan budi dalam menaklukkan kejahatan',
                ],
                'images' => ['/images/dummy-budaya.svg'],
            ],
        ];

        // 4. Insert or update each record
        foreach ($items as $item) {
            $catKey = $item['category'];
            $category = $categoriesMap[$catKey] ?? Category::firstOrCreate(
                ['slug' => Str::slug($catKey)],
                ['name' => $catKey]
            );

            $provinceId = $getProvinceId($item['province']);

            Culture::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'province_id' => $provinceId,
                    'category_id' => $category->id,
                    'title' => $item['title'],
                    'slug' => $item['slug'],
                    'image' => $item['image'],
                    'desc' => $item['desc'],
                    'featured' => $item['featured'] ?? false,
                    'status' => $item['status'] ?? 'published',
                    'source' => $item['source'] ?? null,
                    'history' => $item['history'] ?? null,
                    'facts' => $item['facts'] ?? null,
                    'images' => $item['images'] ?? null,
                ]
            );
        }
    }
}

