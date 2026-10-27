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

    public function test_registration_creates_unverified_user_and_blocks_unverified_login(): void
    {
        $res = $this->postJson('/api/register', [
            'name'                  => 'Budi Unverified',
            'email'                 => 'budi.unverified@example.com',
            'password'              => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $res->assertStatus(201)
            ->assertJsonPath('requires_verification', true);

        $this->assertDatabaseHas('users', [
            'email'             => 'budi.unverified@example.com',
            'email_verified_at' => null,
        ]);

        $loginRes = $this->postJson('/api/login', [
            'email'    => 'budi.unverified@example.com',
            'password' => 'Password123',
        ]);

        $loginRes->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_unverified_user_can_reregister_without_unique_constraint_error(): void
    {
        User::factory()->create([
            'name'              => 'Initial User',
            'email'             => 'retry.unverified@example.com',
            'email_verified_at' => null,
        ]);

        $res = $this->postJson('/api/register', [
            'name'                  => 'Updated User',
            'email'                 => 'retry.unverified@example.com',
            'password'              => 'NewPassword123',
            'password_confirmation' => 'NewPassword123',
        ]);

        $res->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'retry.unverified@example.com',
            'name'  => 'Updated User',
        ]);
    }

    public function test_verified_user_cannot_reregister_with_same_email(): void
    {
        User::factory()->create([
            'email'             => 'verified@example.com',
            'email_verified_at' => now(),
        ]);

        $res = $this->postJson('/api/register', [
            'name'                  => 'Another Name',
            'email'                 => 'verified@example.com',
            'password'              => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $res->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_registration_requires_strong_password(): void
    {
        // Missing mixed case & numbers
        $res = $this->postJson('/api/register', [
            'name'                  => 'Weak Password User',
            'email'                 => 'weak@example.com',
            'password'              => 'password',
            'password_confirmation' => 'password',
        ]);

        $res->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_login_rate_limiting_triggers_after_five_failed_attempts(): void
    {
        $user = User::factory()->create([
            'email'             => 'rate.limit@example.com',
            'password'          => bcrypt('CorrectPass123'),
            'email_verified_at' => now(),
        ]);

        for ($i = 0; $i < 5; $i++) {
            $res = $this->postJson('/api/login', [
                'email'    => 'rate.limit@example.com',
                'password' => 'WrongPass123',
            ]);
            $res->assertStatus(422);
        }

        // 6th attempt should return 429
        $throttledRes = $this->postJson('/api/login', [
            'email'    => 'rate.limit@example.com',
            'password' => 'WrongPass123',
        ]);

        $throttledRes->assertStatus(429)
            ->assertJsonStructure(['message']);
        $this->assertStringContainsString('Terlalu banyak percobaan', $throttledRes->json('message'));
    }
}
