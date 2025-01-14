<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = ['latitude', 'longitude', 'product_id'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
