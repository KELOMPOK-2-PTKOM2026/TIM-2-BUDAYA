<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Admin Jelajah',
            'email'    => 'admin@jelajahsumatera.id',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'User Demo',
            'email'    => 'user@jelajahsumatera.id',
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]);
    }
}
