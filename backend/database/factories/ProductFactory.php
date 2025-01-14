<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dummyImages = [];

        foreach (range(1, rand(2, 5)) as $index) {
            $dummyImages[] = "images/dummy{$index}.png";
        }

        $likes = User::inRandomOrder()->limit(rand(1, 10))->get()->pluck('id');

        return [
            'vendor_id' => Vendor::inRandomOrder()->first()->id,
            'user_id' => User::inRandomOrder()->first()->id,
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement(['Makanan', 'Minuman', 'Pakaian', 'Furnitur', 'Elektronik', 'Jasa & Layanan', 'Kerajinan', 'Pertanian/Perkebunan', 'Bahan Pokok']),
            'type' => fake()->randomElement(['Keliling', 'Tetap', 'Ruko']),
            'images' => $dummyImages,
            'price' => ['min' => fake()->numberBetween(1000, 50000), 'max' => fake()->numberBetween(51000, 1000000)],
            'open_time' => fake()->time(),
            'close_time' => fake()->time(),
            'likes' =>  $likes,
        ];
    }
}