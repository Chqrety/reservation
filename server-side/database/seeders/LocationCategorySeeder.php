<?php

namespace Database\Seeders;

use App\Models\LocationCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LocationCategory::factory()->count(5)->create();
    }
}
