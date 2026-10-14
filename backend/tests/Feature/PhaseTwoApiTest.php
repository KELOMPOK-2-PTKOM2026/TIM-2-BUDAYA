<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Culture;
use App\Models\Province;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhaseTwoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_provinces_and_categories_are_ordered_by_name(): void
    {
        Province::create(['name' => 'Sumatera Barat', 'slug' => 'sumatera-barat']);
        Province::create(['name' => 'Aceh', 'slug' => 'aceh']);
        Province::create(['name' => 'Riau', 'slug' => 'riau']);

        Category::create(['name' => 'Tari Tradisional', 'slug' => 'tari-tradisional']);
        Category::create(['name' => 'Alat Musik', 'slug' => 'alat-musik']);

        $resProvinces = $this->getJson('/api/provinces');
        $resProvinces->assertOk();
        $this->assertSame(['Aceh', 'Riau', 'Sumatera Barat'], array_column($resProvinces->json(), 'name'));

        $resCategories = $this->getJson('/api/categories');
        $resCategories->assertOk();
        $this->assertSame(['Alat Musik', 'Tari Tradisional'], array_column($resCategories->json(), 'name'));
    }

    public function test_user_can_update_profile_with_same_or_new_unique_email(): void
    {
        $user = User::factory()->create([
            'name'  => 'User Awal',
            'email' => 'user@example.com',
        ]);

        $otherUser = User::factory()->create([
            'email' => 'other@example.com',
        ]);

        // Same email should succeed (Rule::unique()->ignore)
        $resSame = $this->actingAs($user)
            ->putJson('/api/me', [
                'name'  => 'User Diperbarui',
                'email' => 'user@example.com',
            ]);

        $resSame->assertOk()
            ->assertJsonPath('user.name', 'User Diperbarui')
            ->assertJsonPath('user.email', 'user@example.com');

        // Duplicate email from other user should fail validation
        $resDup = $this->actingAs($user)
            ->putJson('/api/me', [
                'name'  => 'User Diperbarui',
                'email' => 'other@example.com',
            ]);

        $resDup->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_admin_can_crud_provinces(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user  = User::factory()->create(['role' => 'user']);

        // Forbidden for regular user
        $this->actingAs($user)->postJson('/api/admin/provinces', [
            'name' => 'Bengkulu',
        ])->assertStatus(403);

        // Create by admin
        $createRes = $this->actingAs($admin)->postJson('/api/admin/provinces', [
            'name' => 'Bengkulu',
            'tag'  => 'Bumi Rafflesia',
        ]);

        $createRes->assertStatus(201)
            ->assertJsonPath('data.name', 'Bengkulu')
            ->assertJsonPath('data.slug', 'bengkulu')
            ->assertJsonPath('data.tag', 'Bumi Rafflesia');

        $provinceId = $createRes->json('data.id');

        // Update
        $updateRes = $this->actingAs($admin)->putJson("/api/admin/provinces/{$provinceId}", [
            'name' => 'Bengkulu Selatan',
            'tag'  => 'Updated Tag',
        ]);

        $updateRes->assertOk()
            ->assertJsonPath('data.name', 'Bengkulu Selatan')
            ->assertJsonPath('data.tag', 'Updated Tag');

        // Delete
        $deleteRes = $this->actingAs($admin)->deleteJson("/api/admin/provinces/{$provinceId}");
        $deleteRes->assertOk();

        $this->assertDatabaseMissing('provinces', ['id' => $provinceId]);
    }

    public function test_admin_cannot_delete_province_with_related_cultures(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $province = Province::create(['name' => 'Aceh', 'slug' => 'aceh']);
        $category = Category::create(['name' => 'Tari', 'slug' => 'tari']);

        Culture::create([
            'province_id' => $province->id,
            'category_id' => $category->id,
            'title'       => 'Tari Saman',
            'slug'        => 'tari-saman',
            'desc'        => 'Tari tradisional Aceh',
        ]);

        $deleteRes = $this->actingAs($admin)->deleteJson("/api/admin/provinces/{$province->id}");
        $deleteRes->assertStatus(409);

        $this->assertDatabaseHas('provinces', ['id' => $province->id]);
    }

    public function test_admin_can_crud_categories(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // Create
        $createRes = $this->actingAs($admin)->postJson('/api/admin/categories', [
            'name' => 'Senjata Tradisional',
        ]);

        $createRes->assertStatus(201)
            ->assertJsonPath('data.name', 'Senjata Tradisional')
            ->assertJsonPath('data.slug', 'senjata-tradisional');

        $categoryId = $createRes->json('data.id');

        // Update
        $updateRes = $this->actingAs($admin)->putJson("/api/admin/categories/{$categoryId}", [
            'name' => 'Senjata Adat',
        ]);

        $updateRes->assertOk()
            ->assertJsonPath('data.name', 'Senjata Adat');

        // Delete
        $deleteRes = $this->actingAs($admin)->deleteJson("/api/admin/categories/{$categoryId}");
        $deleteRes->assertOk();

        $this->assertDatabaseMissing('categories', ['id' => $categoryId]);
    }

    public function test_admin_cannot_delete_category_with_related_cultures(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $province = Province::create(['name' => 'Aceh', 'slug' => 'aceh']);
        $category = Category::create(['name' => 'Tari', 'slug' => 'tari']);

        Culture::create([
            'province_id' => $province->id,
            'category_id' => $category->id,
            'title'       => 'Tari Saman',
            'slug'        => 'tari-saman',
            'desc'        => 'Tari tradisional Aceh',
        ]);

        $deleteRes = $this->actingAs($admin)->deleteJson("/api/admin/categories/{$category->id}");
        $deleteRes->assertStatus(409);

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }
}
