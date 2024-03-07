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
        Schema::create('emergencies', function (Blueprint $table) {
            $table->id();
            $table->string('location');
            $table->string('reporter_description');
            $table->string('medic_description')->nullable();;
            $table->string('history')->nullable();
            $table->string('patient_condition')->nullable();
            $table->string('treatment_administration')->nullable();
            $table->string('transportation')->nullable();
            $table->string('equipment')->nullable();
            $table->integer('status')->nullable();
            $table->integer('medic_id')->nullable();
            $table->integer('patient_id')->nullable();
            $table->integer('issues')->nullable();
            $table->integer('case_report')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emergencies');
    }
};
