<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Login_attempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'attempt_time',
        'attempt_date',
        'email',
        
    ];
}
