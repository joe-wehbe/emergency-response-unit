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
            $table->string('shift_status')->default(0);
            $table->time('checkin_time')->nullable();
            $table->integer('missed_attendance')->default(1);
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
