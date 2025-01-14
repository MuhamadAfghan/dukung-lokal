<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasUuids, HasFactory;
    protected $fillable = [
        'name',
        'description',
        'category',
        'type',
        'images',
        'price',
        'open_time',
        'close_time',
        'vendor_id',
        'likes',
        'user_id',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'array',
        'likes' => 'array',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function positions()
    {
        return $this->hasMany(Position::class);
    }

    public function report()
    {
        return $this->hasOne(Report::class);
    }
}
