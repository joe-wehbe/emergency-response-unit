<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'emergency_id',
        'heart_rate',
        'blood_pressure',
        'oxygen_saturation',
        'temperature',
        'respiration_rate',
        'capillary_refill_time',
        'hemoglucotest',
        'pupils_reaction',
    ];

    public function emergency(){
        return $this->belongsTo(Emergency::class);
    }
}
