<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Culture;
use App\Models\Province;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhaseThreeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_respects_other_filters_due_to_closure_scoping(): void
    {
        $provAceh = Province::create(['name' => 'Aceh', 'slug' => 'aceh']);
        $provRiau = Province::create(['name' => 'Riau', 'slug' => 'riau']);
        $catTari = Category::create(['name' => 'Tari', 'slug' => 'tari']);

        // Culture in Aceh with 'Tari'
        Culture::create([
            'province_id' => $provAceh->id,
            'category_id' => $catTari->id,
            'title'       => 'Tari Saman',
            'slug'        => 'tari-saman',
            'desc'        => 'Tarian suku Gayo di Aceh',
            'status'      => 'published',
        ]);

        // Culture in Riau with 'Tari'
        Culture::create([
            'province_id' => $provRiau->id,
            'category_id' => $catTari->id,
            'title'       => 'Tari Zapin',
            'slug'        => 'tari-zapin',
            'desc'        => 'Tarian Melayu Riau',
            'status'      => 'published',
        ]);

        // Search 'Tari' with province filter 'riau' should ONLY return Tari Zapin
        $response = $this->getJson('/api/cultures?search=Tari&province=riau');
        $response->assertOk();

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertSame('Tari Zapin', $data[0]['title']);
    }

    public function test_show_returns_relevant_related_cultures(): void
    {
        $provAceh = Province::create(['name' => 'Aceh', 'slug' => 'aceh']);
        $provSumbar = Province::create(['name' => 'Sumatera Barat', 'slug' => 'sumbar']);

        $catTari = Category::create(['name' => 'Tari', 'slug' => 'tari']);
        $catMusik = Category::create(['name' => 'Musik', 'slug' => 'musik']);

        $main = Culture::create([
            'province_id' => $provAceh->id,
            'category_id' => $catTari->id,
            'title'       => 'Tari Saman',
            'slug'        => 'tari-saman',
            'desc'        => 'Deskripsi Saman',
            'status'      => 'published',
        ]);

        // Same category (Tari) in different province (Sumbar) -> should be included
        $sameCat = Culture::create([
            'province_id' => $provSumbar->id,
            'category_id' => $catTari->id,
            'title'       => 'Tari Piring',
            'slug'        => 'tari-piring',
            'desc'        => 'Deskripsi Piring',
            'status'      => 'published',
        ]);

        // Same province (Aceh) in different category (Musik) -> should be included
        $sameProv = Culture::create([
            'province_id' => $provAceh->id,
            'category_id' => $catMusik->id,
            'title'       => 'Serune Kalee',
            'slug'        => 'serune-kalee',
            'desc'        => 'Alat musik Aceh',
            'status'      => 'published',
        ]);

        // Different province and different category -> should NOT be included
        Culture::create([
            'province_id' => $provSumbar->id,
            'category_id' => $catMusik->id,
            'title'       => 'Saluang',
            'slug'        => 'saluang',
            'desc'        => 'Alat musik Minangkabau',
            'status'      => 'published',
        ]);

        $response = $this->getJson("/api/cultures/{$main->slug}");
        $response->assertOk();

        $relatedTitles = array_column($response->json('related'), 'title');
        $this->assertContains('Tari Piring', $relatedTitles);
        $this->assertContains('Serune Kalee', $relatedTitles);
        $this->assertNotContains('Saluang', $relatedTitles);
        $this->assertNotContains('Tari Saman', $relatedTitles);
    }

    public function test_cors_and_sanctum_config_security_defaults(): void
    {
        $this->assertEquals(['http://localhost:3000'], config('cors.allowed_origins'));
        $this->assertEquals(1440, config('sanctum.expiration'));
    }
}
