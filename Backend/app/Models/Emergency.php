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
        'patient_id',
        'issues',
        'case_report'
    ];
}
