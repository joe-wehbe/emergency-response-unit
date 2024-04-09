<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emergency extends Model
{
    use HasFactory;

    protected $fillable = [
        'location',
        'reporter_description',
        'medic_description',
        'history',
        'patient_condition',
        'treatment_administration',
        'transportation',
        'equipment',
        'status',
        'medic_id',
        'patient_name',
        'patient_lau_id',
        'issues',
        'case_report'
    ];

    public function medic(){
        return $this->belongsTo(User::class, 'medic_id');
    }

    public function assessments(){
        return $this->hasMany(Assessment::class);
    }

    
}
