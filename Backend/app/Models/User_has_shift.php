<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User_has_shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shift_id',
        'shift_status',
        'checkin_time',
        'attended',
    ];   

    public function coverRequest(){ 
        return $this->hasMany(Cover_request::class);
    }
   
}
