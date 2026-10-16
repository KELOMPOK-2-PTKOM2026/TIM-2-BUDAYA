<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@jelajahsumatera.id'],
            [
                'name'     => 'Admin Jelajah',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'user@jelajahsumatera.id'],
            [
                'name'     => 'User Demo',
                'password' => Hash::make('password'),
                'role'     => 'user',
            ]
        );
    }
}
