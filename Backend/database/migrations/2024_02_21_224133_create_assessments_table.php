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
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->integer('emergency_id');
            $table->integer('heart_rate')->nullable();
            $table->string('blood_pressure')->nullable();
            $table->integer('oxygen_saturation')->nullable();
            $table->integer('temperature')->nullable();
            $table->integer('respiration_rate')->nullable();
            $table->integer('capillary_refill_time')->nullable();
            $table->integer('hemoglucotest')->nullable();
            $table->string('pupils_reaction')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
