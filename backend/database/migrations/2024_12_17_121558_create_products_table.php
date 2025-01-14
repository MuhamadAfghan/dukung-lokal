<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('vendor_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description');
            $table->enum('category', ['Makanan', 'Minuman', 'Pakaian', 'Furnitur', 'Elektronik', 'Jasa & Layanan', 'Kerajinan', 'Pertanian/Perkebunan', 'Bahan Pokok']);
            $table->enum('type', ['Keliling', 'Tetap', 'Ruko']);
            $table->json('images');
            $table->json('price');
            $table->time('open_time');
            $table->time('close_time');
            $table->json('likes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};