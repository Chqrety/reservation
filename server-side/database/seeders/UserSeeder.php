<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    // create 10 random users
    User::factory()->count(10)->create();

    // create default admin user
    User::create([
      'name' => 'Admin1',
      'email' => 'admin@gmail.com',
      'password' => Hash::make(env('ADMIN_PASSWORD', 'fallbackpassword')),
      'role' => 'admin',
    ]);

    User::create([
      'name' => 'Admin',
      'email' => 'admin@admin.id',
      'password' => Hash::make('123456789'),
      'role' => 'admin',
    ]);

    // create default normal user -> for testing
    User::create([
      'name' => 'user1',
      'email' => 'normal@gmail.com',
      'password' => Hash::make(
        env('NORMAL_PASSWORD', 'fallbackpassow'),
        [
          'type' => 'argon2id',
        ]
      ),
      'role' => 'customer',
    ]);
  }
}
