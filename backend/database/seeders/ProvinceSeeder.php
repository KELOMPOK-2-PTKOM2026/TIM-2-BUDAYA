<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Province;

class ProvinceSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['name' => 'Aceh', 'slug' => 'aceh', 'image' => 'https://images.unsplash.com/photo-1622597943118-45ebacc528d1?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'tag' => 'Serambi Mekah'],
            ['name' => 'Sumatera Utara', 'slug' => 'sumatera-utara', 'image' => 'https://images.unsplash.com/photo-1569081562679-6d71c00aab86?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'tag' => 'Danau Toba'],
            ['name' => 'Sumatera Barat', 'slug' => 'sumatera-barat', 'image' => 'https://images.unsplash.com/photo-1606633007433-a1abd835f6cd?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'tag' => 'Ranah Minang'],
            ['name' => 'Riau', 'slug' => 'riau', 'image' => 'https://images.unsplash.com/photo-1694769473628-a6a01930ae73?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'tag' => 'Bumi Lancang Kuning'],
            ['name' => 'Kepulauan Riau', 'slug' => 'kepulauan-riau', 'image' => 'https://images.unsplash.com/photo-1553193094-d7add06beb10?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'tag' => 'Bunda Tanah Melayu'],
            ['name' => 'Jambi', 'slug' => 'jambi', 'image' => 'https://images.unsplash.com/photo-1708481686679-1bfebe1afefc?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'tag' => 'Sepucuk Jambi Sembilan Lurah'],
            ['name' => 'Sumatera Selatan', 'slug' => 'sumatera-selatan', 'image' => 'https://images.unsplash.com/photo-1571669829691-9bfdc2943044?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'tag' => 'Bumi Sriwijaya'],
            ['name' => 'Bengkulu', 'slug' => 'bengkulu', 'image' => 'https://images.unsplash.com/photo-1634532999884-ecd677928bac?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'tag' => 'Bumi Rafflesia'],
            ['name' => 'Lampung', 'slug' => 'lampung', 'image' => 'https://images.unsplash.com/photo-1592639298199-7b9d01c1cf29?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'tag' => 'Sang Bumi Ruwa Jurai'],
            ['name' => 'Bangka Belitung', 'slug' => 'bangka-belitung', 'image' => 'https://images.unsplash.com/photo-1444362408440-274ecb6fc730?crop=entropy&cs=srgb&fm=jpg&q=85&w=800', 'tag' => 'Negeri Serumpun Sebalai'],
        ];

        foreach ($data as $item) {
            Province::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
