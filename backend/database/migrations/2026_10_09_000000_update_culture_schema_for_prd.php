<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cultures', function (Blueprint $table) {
            $table->enum('status', ['draft', 'published', 'archived'])
                ->default('draft')
                ->after('featured');
            $table->text('source')->nullable()->after('status');
            $table->longText('history')->nullable()->after('source');
            $table->json('facts')->nullable()->after('history');
            $table->json('images')->nullable()->after('facts');
        });

        // Existing catalog rows were already public before publication status existed.
        DB::table('cultures')->update(['status' => 'published']);

        Schema::table('culture_proposals', function (Blueprint $table) {
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])
                ->default('pending')
                ->change();
            $table->text('source')->nullable()->after('description');
            $table->longText('history')->nullable()->after('source');
            $table->json('facts')->nullable()->after('history');
            $table->json('images')->nullable()->after('facts');
            $table->boolean('copyright_consent')->default(false)->after('images');
        });
    }

    public function down(): void
    {
        DB::table('culture_proposals')->where('status', 'draft')->update(['status' => 'pending']);

        Schema::table('culture_proposals', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected'])
                ->default('pending')
                ->change();
            $table->dropColumn([
                'source',
                'history',
                'facts',
                'images',
                'copyright_consent',
            ]);
        });

        Schema::table('cultures', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'source',
                'history',
                'facts',
                'images',
            ]);
        });
    }
};
