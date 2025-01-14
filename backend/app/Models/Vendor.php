<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = ['name', 'contact'];

    protected $casts = [
        'contact' => 'array',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
