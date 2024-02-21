<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_has_shifts', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->integer('shift_id');
            $table->string('shift_status');
            $table->time('checkin_time');
            $table->integer('missed_attendance');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_has_shifts');
    }
};