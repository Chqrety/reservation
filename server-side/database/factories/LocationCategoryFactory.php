<?php

namespace Database\Factories;

use App\Models\LocationCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class LocationCategoryFactory extends Factory
{
    protected $model = LocationCategory::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
