<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Province;

class ProvinceSeeder extends Seeder {
    public function run(): void {
        $data = [
            ['name' => 'Aceh', 'slug' => 'aceh', 'image' => '/images/aceh.jpg', 'tag' => 'Serambi Mekah'],
            ['name' => 'Sumatera Utara', 'slug' => 'sumatera-utara', 'image' => '/images/sumut.jpg', 'tag' => 'Danau Toba'],
            ['name' => 'Sumatera Barat', 'slug' => 'sumatera-barat', 'image' => '/images/sumbar.jpg', 'tag' => 'Ranah Minang'],
            ['name' => 'Riau', 'slug' => 'riau', 'image' => '/images/riau.jpg', 'tag' => 'Bumi Lancang Kuning'],
            ['name' => 'Sumatera Selatan', 'slug' => 'sumatera-selatan', 'image' => '/images/sumsel.jpg', 'tag' => 'Bumi Sriwijaya'],
        ];
        foreach($data as $item) Province::updateOrCreate(['slug' => $item['slug']], $item);
    }
}
