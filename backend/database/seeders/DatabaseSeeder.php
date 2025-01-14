<?php

namespace Database\Seeders;

use App\Models\Position;
use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(70)->create();
        Vendor::factory(203)->create();
        Product::factory(230)->create();
        Position::factory(240)->create();
        // Vendor::factory(1)->create();
        // User::factory(1)->create();
        // Product::factory(1)->create();
        // Position::factory(1)->create();

        // $user = User::create([
        //     'name' => 'Riski',
        //     'email' => 'riski@gmail.com',
        //     'password' => bcrypt('password'),
        // ]);

        // $vendor = Vendor::create([
        //     'name' => 'Mang Riski',
        //     'contact' => [
        //         'phone' => '08123456789',
        //         'email' => 'riski@example.com'
        //     ],
        // ]);

        // $product = Product::create([
        //     'name' => 'Bakso tiren khas Malang',
        //     'type' => 'Keliling',
        //     'category' => 'Makanan',
        //     'description' => 'Bakso tiren khas Malang adalah bakso yang terkenal di Malang',
        //     'price' => [
        //         'min' => 10000,
        //         'max' => 20000,
        //     ],
        //     'images' => [
        //         'https://picsum.photos/200/300',
        //         'https://picsum.photos/200/300',
        //     ],
        //     'open_time' => '08:00',
        //     'close_time' => '17:00',
        //     'vendor_id' => $vendor->id,
        //     'user_id' => $user->id,
        // ]);

        // $product->positions()->createMany([
        //     [
        //         'latitude' => -6.6479136409785315,
        //         'longitude' => 106.82796478271486,
        //     ],
        //     [
        //         'latitude' => -6.6479136409785318,
        //         'longitude' => 106.82796478271483,
        //     ],
        // ]);
    }
}
