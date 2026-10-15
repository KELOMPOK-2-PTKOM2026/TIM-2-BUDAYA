<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\CultureProposal;
use App\Models\Province;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProposalApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_my_proposals(): void
    {
        $response = $this->getJson('/api/proposals/mine');
        $response->assertStatus(401);
    }

    public function test_user_can_view_own_proposals_only(): void
    {
        $user1 = User::factory()->create(['name' => 'Budi Siregar', 'email' => 'budi@example.com']);
        $user2 = User::factory()->create(['name' => 'User Lain', 'email' => 'lain@example.com']);

        CultureProposal::create([
            'user_id' => $user1->id,
            'title' => 'Tari Piring',
            'province_name' => 'Sumatera Barat',
            'category_name' => 'Tari',
            'description' => 'Tari piring dari Minangkabau',
            'status' => 'pending',
        ]);

        CultureProposal::create([
            'user_id' => $user2->id,
            'title' => 'Tari Saman',
            'province_name' => 'Aceh',
            'category_name' => 'Tari',
            'description' => 'Tari saman dari Gayo',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user1)->getJson('/api/proposals/mine');
        $response->assertOk();

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertSame('Tari Piring', $data[0]['title']);
    }

    public function test_user_can_submit_proposal(): void
    {
        $user = User::factory()->create();
        Province::create(['name' => 'Sumatera Barat', 'slug' => 'sumbar']);
        Category::create(['name' => 'Tari Tradisional', 'slug' => 'tari-tradisional']);

        $response = $this->actingAs($user)->postJson('/api/proposals', [
            'title' => 'Tari Randai',
            'province_name' => 'Sumatera Barat',
            'category_name' => 'Tari Tradisional',
            'description' => 'Kesenian teater dan tari khas Minangkabau.',
            'copyright_consent' => true,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('culture_proposals', [
            'title' => 'Tari Randai',
            'user_id' => $user->id,
            'status' => 'pending',
        ]);
    }

    public function test_admin_approving_proposal_sets_culture_audit_fields(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();
        $province = Province::create(['name' => 'Sumatera Barat', 'slug' => 'sumbar']);
        $category = Category::create(['name' => 'Tari Tradisional', 'slug' => 'tari-tradisional']);

        $proposal = CultureProposal::create([
            'user_id' => $user->id,
            'title' => 'Tari Randai',
            'province_name' => $province->name,
            'category_name' => $category->name,
            'description' => 'Kesenian teater dan tari khas Minangkabau.',
            'status' => 'pending',
        ]);

        $res = $this->actingAs($admin)->postJson("/api/admin/proposals/{$proposal->id}/verify", [
            'status' => 'approved',
            'admin_note' => 'Disetujui untuk rilis',
        ]);

        $res->assertOk();
        $this->assertDatabaseHas('cultures', [
            'title' => 'Tari Randai',
            'created_by' => $admin->id,
            'updated_by' => $admin->id,
        ]);
    }

    public function test_admin_can_update_culture_and_sets_updated_by(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $province = Province::create(['name' => 'Aceh', 'slug' => 'aceh']);
        $category = Category::create(['name' => 'Adat dan Tradisi', 'slug' => 'adat-dan-tradisi']);

        $culture = \App\Models\Culture::create([
            'province_id' => $province->id,
            'category_id' => $category->id,
            'title' => 'Budaya Awal',
            'slug' => 'budaya-awal',
            'desc' => 'Deskripsi awal',
            'image' => null,
            'status' => 'published',
        ]);

        $res = $this->actingAs($admin)->putJson("/api/admin/cultures/{$culture->id}", [
            'image' => '/images/new-image.jpg',
            'desc' => 'Deskripsi diperbarui',
        ]);

        $res->assertOk();
        $this->assertDatabaseHas('cultures', [
            'id' => $culture->id,
            'image' => '/images/new-image.jpg',
            'updated_by' => $admin->id,
        ]);
    }
}
