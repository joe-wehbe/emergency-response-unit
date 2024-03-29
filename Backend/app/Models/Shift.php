<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'time_start',
        'time_end',
        'day'
    ];

    public function userShift(){
        return $this->hasMany(User_has_shift::class);
    }
}
