<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['product_id', 'max_index'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function reportProducts()
    {
        return $this->hasMany(ReportProduct::class);
    }
}
