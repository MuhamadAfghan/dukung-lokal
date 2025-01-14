<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportProduct extends Model
{
    protected $fillable = ['report_id', 'category', 'reason', 'user_id'];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}
