<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Culture;
use App\Models\Province;
use App\Models\Category;

class CultureSeeder extends Seeder {
    public function run(): void {
        $aceh = Province::where('slug', 'aceh')->first()->id;
        $sumbar = Province::where('slug', 'sumatera-barat')->first()->id;
        $sumut = Province::where('slug', 'sumatera-utara')->first()->id;
        $seni = Category::where('slug', 'seni-pertunjukan')->first()->id;
        $kuliner = Category::where('slug', 'kuliner')->first()->id;
        $kerajinan = Category::where('slug', 'kerajinan')->first()->id;
        
        $data = [
            ['province_id' => $aceh, 'category_id' => $seni, 'title' => 'Tari Saman Gayo', 'slug' => 'tari-saman', 'image' => '/images/tari-saman.jpg', 'desc' => 'Tarian unik berkecepatan tinggi yang merefleksikan persatuan gayo.', 'featured' => true],
            ['province_id' => $sumbar, 'category_id' => $kuliner, 'title' => 'Rendang Minang', 'slug' => 'rendang-minang', 'image' => '/images/rendang-minang.jpg', 'desc' => 'Olahan daging sapi legendaris Minangkabau dengan rempah berlapis.', 'featured' => true],
            ['province_id' => $aceh, 'category_id' => $kuliner, 'title' => 'Mie Aceh', 'slug' => 'mie-aceh', 'image' => '/images/mie-aceh.jpg', 'desc' => 'Mie kuning tebal berpadu kuah kari kental kaya rempah.', 'featured' => false],
            ['province_id' => $sumut, 'category_id' => $kerajinan, 'title' => 'Kain Ulos Batak', 'slug' => 'kain-ulos-batak', 'image' => '/images/kain-ulos.jpg', 'desc' => 'Kain tenun sakral pembawa restu dalam setiap siklus kehidupan tradisi.', 'featured' => false],
        ];
        foreach($data as $item) Culture::updateOrCreate(['slug' => $item['slug']], $item);
    }
}
