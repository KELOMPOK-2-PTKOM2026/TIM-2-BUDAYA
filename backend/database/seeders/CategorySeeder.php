<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['name' => 'Tarian', 'slug' => 'tarian'],
            ['name' => 'Musik', 'slug' => 'musik'],
            ['name' => 'Kuliner', 'slug' => 'kuliner'],
            ['name' => 'Upacara', 'slug' => 'upacara'],
            ['name' => 'Kerajinan', 'slug' => 'kerajinan'],
            ['name' => 'Pakaian Adat', 'slug' => 'pakaian-adat'],
            ['name' => 'Seni Pertunjukan', 'slug' => 'seni-pertunjukan'],
        ];

        foreach ($data as $item) {
            Category::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
