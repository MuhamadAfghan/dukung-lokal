<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Position>
 */
class PositionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $locations = [
            // Jawa
            ['latitude' => -6.2088, 'longitude' => 106.8456], // Jakarta
            ['latitude' => -6.9175, 'longitude' => 107.6191], // Bandung
            ['latitude' => -7.7956, 'longitude' => 110.3695], // Yogyakarta
            ['latitude' => -7.2575, 'longitude' => 112.7521], // Surabaya
            ['latitude' => -6.9939, 'longitude' => 110.4162], // Semarang
            ['latitude' => -6.2297, 'longitude' => 106.6895], // Tangerang
            ['latitude' => -7.0060, 'longitude' => 107.5281], // Cimahi
            ['latitude' => -6.8868, 'longitude' => 107.6151], // Cirebon
            ['latitude' => -7.8021, 'longitude' => 112.1610], // Malang
            ['latitude' => -6.5900, 'longitude' => 106.7920], // Bogor
            ['latitude' => -6.4058, 'longitude' => 106.0640], // Sukabumi
            ['latitude' => -6.9818, 'longitude' => 110.4090], // Pekalongan
            ['latitude' => -6.8754, 'longitude' => 109.6545], // Tegal
            ['latitude' => -7.6129, 'longitude' => 111.5300], // Madiun
            ['latitude' => -7.4214, 'longitude' => 112.7270], // Sidoarjo
            ['latitude' => -8.0933, 'longitude' => 112.1623], // Blitar

            // Sumatra
            ['latitude' => 3.5952, 'longitude' => 98.6722], // Medan
            ['latitude' => -2.9977, 'longitude' => 104.7750], // Palembang
            ['latitude' => 0.5333, 'longitude' => 101.4500], // Pekanbaru
            ['latitude' => -3.6915, 'longitude' => 102.2753], // Bengkulu
            ['latitude' => 3.3299, 'longitude' => 99.1310], // Pematangsiantar
            ['latitude' => -0.9429, 'longitude' => 100.3713], // Padang
            ['latitude' => 1.4748, 'longitude' => 102.4230], // Dumai
            ['latitude' => 5.2010, 'longitude' => 97.1507], // Lhokseumawe
            ['latitude' => 0.5052, 'longitude' => 101.4381], // Bangkinang
            ['latitude' => 3.5833, 'longitude' => 98.6667], // Binjai
            ['latitude' => 1.6796, 'longitude' => 101.4567], // Rengat

            // Kalimantan
            ['latitude' => -3.3192, 'longitude' => 114.5909], // Banjarmasin
            ['latitude' => 0.1266, 'longitude' => 109.3297], // Pontianak
            ['latitude' => -1.2416, 'longitude' => 116.8594], // Balikpapan
            ['latitude' => -0.5022, 'longitude' => 117.1536], // Samarinda
            ['latitude' => -0.4500, 'longitude' => 111.7333], // Ketapang
            ['latitude' => -1.6394, 'longitude' => 113.5811], // Sampit
            ['latitude' => -2.2105, 'longitude' => 113.9166], // Pangkalan Bun
            ['latitude' => 3.2999, 'longitude' => 117.6324], // Tarakan
            ['latitude' => -3.2942, 'longitude' => 117.2642], // Tanah Grogot

            // Sulawesi
            ['latitude' => -5.1477, 'longitude' => 119.4328], // Makassar
            ['latitude' => 0.5560, 'longitude' => 123.0590], // Gorontalo
            ['latitude' => 1.4541, 'longitude' => 124.7963], // Manado
            ['latitude' => -3.9921, 'longitude' => 122.5186], // Kendari
            ['latitude' => -1.1394, 'longitude' => 120.8089], // Palu
            ['latitude' => -3.9678, 'longitude' => 119.6522], // Parepare
            ['latitude' => -5.5560, 'longitude' => 120.1973], // Bone
            ['latitude' => -1.5261, 'longitude' => 123.5820], // Luwuk
            ['latitude' => -2.5346, 'longitude' => 121.3580], // Kolaka

            // Bali & Nusa Tenggara
            ['latitude' => -8.4095, 'longitude' => 115.1889], // Denpasar
            ['latitude' => -8.6525, 'longitude' => 115.2190], // Gianyar
            ['latitude' => -9.6644, 'longitude' => 120.2647], // Labuan Bajo
            ['latitude' => -8.7574, 'longitude' => 116.2727], // Mataram
            ['latitude' => -10.1772, 'longitude' => 123.6070], // Kupang
            ['latitude' => -8.8716, 'longitude' => 117.4765], // Bima

            // Papua & Maluku
            ['latitude' => -2.5337, 'longitude' => 140.7181], // Jayapura
            ['latitude' => -3.6822, 'longitude' => 128.1913], // Ambon
            ['latitude' => -2.9316, 'longitude' => 132.2986], // Sorong
            ['latitude' => -0.8833, 'longitude' => 134.0833], // Manokwari
            ['latitude' => -3.6530, 'longitude' => 128.1900], // Tual
            ['latitude' => -2.8424, 'longitude' => 131.1267], // Fakfak
        ];

        $kampusIbikLocation = [
            'latitude' => -6.606194,
            'longitude' => 106.799600,
        ];

        $totalRecords = 210; // Jumlah total data yang ingin dibuat
        $ibikCount = 30; // Jumlah data yang berasal dari Kampus IBIK
        $randomCount = $totalRecords - $ibikCount; // Sisanya dari lokasi lain

        $allLocations = [];

        // Tambahkan lokasi IBIK sesuai jumlah yang diinginkan
        for ($i = 0; $i < $ibikCount; $i++) {
            $allLocations[] = [
                'latitude' => $kampusIbikLocation['latitude'] + fake()->randomFloat(4, -0.001, 0.001),
                'longitude' => $kampusIbikLocation['longitude'] + fake()->randomFloat(4, -0.001, 0.001),
            ];
        }

        // Tambahkan lokasi acak dari daftar lain sesuai jumlah yang tersisa
        for ($i = 0; $i < $randomCount; $i++) {
            $randomLocation = fake()->randomElement($locations);
            $allLocations[] = [
                'latitude' => $randomLocation['latitude'] + fake()->randomFloat(4, -0.1, 0.1),
                'longitude' => $randomLocation['longitude'] + fake()->randomFloat(4, -0.1, 0.1),
            ];
        }

        // Pilih lokasi secara acak dari array hasil campuran
        $finalLocation = fake()->randomElement($allLocations);

        return [
            'product_id' => Product::inRandomOrder()->first()->id,
            'latitude' => $finalLocation['latitude'],
            'longitude' => $finalLocation['longitude'],
        ];
    }
}
