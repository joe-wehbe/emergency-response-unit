<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cover_request extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "shift_id",
        'reason',
        'request_status',
    ];
}
