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
            $table->integer('heart_rate');
            $table->string('blood_pressure');
            $table->integer('oxygen_saturation');
            $table->integer('temperature');
            $table->integer('respiration_rate');
            $table->integer('capillary_refill_time');
            $table->integer('hemoglucotest');
            $table->integer('pupils_reaction');
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
