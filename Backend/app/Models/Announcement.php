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
    ];

    public function admin(){ //to know that an announcement is for A CERTAIN admin
        return $this->belongsTo(User::class);
    }
}
