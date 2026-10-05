<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder {
    public function run(): void {
        $data = [
            ['name' => 'Seni Pertunjukan', 'slug' => 'seni-pertunjukan'],
            ['name' => 'Tarian', 'slug' => 'tarian'],
            ['name' => 'Kuliner', 'slug' => 'kuliner'],
            ['name' => 'Musik', 'slug' => 'musik'],
            ['name' => 'Kerajinan', 'slug' => 'kerajinan'],
        ];
        foreach($data as $item) Category::updateOrCreate(['slug' => $item['slug']], $item);
    }
}
