<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\LocationCategory;

class LocationFactory extends Factory
{
    protected $model = Location::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'address' => $this->faker->address(),
            'description' => $this->faker->paragraph(),
            'image' => $this->faker->imageUrl(640, 480, 'city', true),
            'category_id' => LocationCategory::inRandomOrder()->first()?->id ?? LocationCategory::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
