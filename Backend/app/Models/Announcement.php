<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'importance',
        'description',
        'visible_to',
    ];

    public function admin(){
        return $this->belongsTo(User::class);
    }
}
