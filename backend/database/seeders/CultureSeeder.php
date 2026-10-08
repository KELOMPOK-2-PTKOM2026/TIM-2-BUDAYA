<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Culture;
use App\Models\Province;
use App\Models\Category;

class CultureSeeder extends Seeder {
    public function run(): void {
        // Resolve Provinces
        $aceh = Province::where('slug', 'aceh')->first()->id ?? 1;
        $sumbar = Province::where('slug', 'sumatera-barat')->first()->id ?? 1;
        $sumut = Province::where('slug', 'sumatera-utara')->first()->id ?? 1;
        $riau = Province::where('slug', 'riau')->first()->id ?? 1;
        $kepri = Province::where('slug', 'kepulauan-riau')->first()->id ?? 1;
        $jambi = Province::where('slug', 'jambi')->first()->id ?? 1;
        $sumsel = Province::where('slug', 'sumatera-selatan')->first()->id ?? 1;
        $bengkulu = Province::where('slug', 'bengkulu')->first()->id ?? 1;
        $lampung = Province::where('slug', 'lampung')->first()->id ?? 1;
        $babel = Province::where('slug', 'bangka-belitung')->first()->id ?? 1;

        // Resolve Categories
        $seni = Category::where('slug', 'seni-pertunjukan')->first()->id ?? 1;
        $tarian = Category::where('slug', 'tarian')->first()->id ?? 1;
        $kuliner = Category::where('slug', 'kuliner')->first()->id ?? 1;
        $kerajinan = Category::where('slug', 'kerajinan')->first()->id ?? 1;
        $upacara = Category::where('slug', 'upacara')->first()->id ?? 1;
        $pakaian = Category::where('slug', 'pakaian-adat')->first()->id ?? 1;
        $musik = Category::where('slug', 'musik')->first()->id ?? 1;
        
        $data = [
            ['province_id' => $aceh, 'category_id' => $seni, 'title' => 'Tari Saman Gayo', 'slug' => 'tari-saman', 'image' => '/images/tari-saman.jpg', 'desc' => 'Tarian unik berkecepatan tinggi yang merefleksikan persatuan gayo.', 'featured' => true],
            ['province_id' => $sumbar, 'category_id' => $kuliner, 'title' => 'Rendang Minang', 'slug' => 'rendang-minang', 'image' => '/images/rendang-minang.jpg', 'desc' => 'Olahan daging sapi legendaris Minangkabau dengan rempah berlapis yang dimasak perlahan.', 'featured' => true],
            ['province_id' => $aceh, 'category_id' => $kuliner, 'title' => 'Mie Aceh', 'slug' => 'mie-aceh', 'image' => '/images/dummy-kuliner.svg', 'desc' => 'Mie kuning tebal berpadu kuah kari kental kaya rempah.', 'featured' => false],
            ['province_id' => $sumut, 'category_id' => $kerajinan, 'title' => 'Kain Ulos Batak', 'slug' => 'kain-ulos-batak', 'image' => '/images/kain-ulos.jpg', 'desc' => 'Kain tenun sakral pembawa restu dalam setiap siklus kehidupan tradisi suku Batak Toba.', 'featured' => false],
            ['province_id' => $bengkulu, 'category_id' => $kuliner, 'title' => 'Pendap Bengkulu', 'slug' => 'pendap-bengkulu', 'image' => '/images/dummy-kuliner.svg', 'desc' => 'Ikan laut berbalur bumbu rempah parutan kelapa yang dibungkus berlapis daun talas dan direbus 8 jam.', 'featured' => false],
            ['province_id' => $lampung, 'category_id' => $pakaian, 'title' => 'Siger Lampung', 'slug' => 'siger-lampung', 'image' => '/images/siger-lampung.jpg', 'desc' => 'Mahkota pengantin wanita emas megah berlambang kehormatan, feminitas, dan status sosial.', 'featured' => true],
            ['province_id' => $babel, 'category_id' => $kuliner, 'title' => 'Lempah Kuning Belitung', 'slug' => 'lempah-kuning', 'image' => '/images/dummy-kuliner.svg', 'desc: ' => 'Sup ikan laut khas Bangka berkuah kuning kunyit asam segar dari buah nanas dan cabai rawit merah.', 'featured' => false],
            ['province_id' => $jambi, 'category_id' => $upacara, 'title' => 'Upacara Besale', 'slug' => 'upacara-besale', 'image' => '/images/upacara-besale.jpg', 'desc' => 'Ritual pengobatan tradisional suku Anak Dalam yang memadukan mantra, tari, dan dedaunan khusus.', 'featured' => false],
            ['province_id' => $riau, 'category_id' => $tarian, 'title' => 'Tari Zapin Riau', 'slug' => 'tari-zapin-riau', 'image' => '/images/dummy-tarian.svg', 'desc' => 'Tarian rumpun Melayu berakar tradisi Arab-Hadramaut dengan langkah kaki lincah yang edukatif.', 'featured' => false],
            ['province_id' => $kepri, 'category_id' => $kuliner, 'title' => 'Mie Tarempa Kepri', 'slug' => 'mie-tarempa-kepri', 'image' => '/images/dummy-kuliner.svg', 'desc' => 'Mie pipih khas kepulauan Anambas yang dimasak pedas manis dengan potongan ikan tongkol dan tauge.', 'featured' => false],
            ['province_id' => $sumsel, 'category_id' => $kuliner, 'title' => 'Pempek Palembang', 'slug' => 'pempek-palembang', 'image' => '/images/pempek-palembang.jpg', 'desc' => 'Kuliner khas berbahan dasar ikan tenggiri dan tepung sagu yang disajikan dengan kuah cuko pekat pedas manis.', 'featured' => false],
            ['province_id' => $bengkulu, 'category_id' => $upacara, 'title' => 'Upacara Tabut Bengkulu', 'slug' => 'upacara-tabut-bengkulu', 'image' => '/images/dummy-upacara.svg', 'desc' => 'Festival ritual tahunan mengenang sejarah Islam dengan prosesi arak-arakan menara Tabut bertingkat megah.', 'featured' => false],
            ['province_id' => $sumut, 'category_id' => $pakaian, 'title' => 'Baju Adat Batak Toba', 'slug' => 'baju-adat-batak-toba', 'image' => '/images/batak-ulos-attire.jpg', 'desc' => 'Busana tradisional Batak dengan balutan kain Ulos Ragidup dan ikat kepala Sortali yang melambangkan kemakmuran.', 'featured' => false],
            ['province_id' => $sumbar, 'category_id' => $kerajinan, 'title' => 'Songket Silungkang', 'slug' => 'songket-silungkang', 'image' => '/images/songket-silungkang.jpg', 'desc' => 'Tenun tradisional mewah Minangkabau bertabur benang emas dengan motif geometris yang diwariskan turun-temurun.', 'featured' => true],
            ['province_id' => $sumsel, 'category_id' => $pakaian, 'title' => 'Aesan Gede Palembang', 'slug' => 'aesan-gede-palembang', 'image' => '/images/aesan-gede.jpg', 'desc' => 'Pakaian pengantin kerajaan Sriwijaya bertahtakan perhiasan emas megah dan lilitan kain songket lepus mewah.', 'featured' => false],
        ];
        foreach($data as $item) {
            if (isset($item['desc: '])) {
                $item['desc'] = $item['desc: '];
                unset($item['desc: ']);
            }
            Culture::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
