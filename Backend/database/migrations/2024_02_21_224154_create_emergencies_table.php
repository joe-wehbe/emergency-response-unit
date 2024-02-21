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
            $table->string('medic_description');
            $table->string('history');
            $table->string('patient_condition');
            $table->string('treatment_administration');
            $table->string('transportation');
            $table->string('equipment');
            $table->integer('status');
            $table->integer('medic_id');
            $table->integer('patient_id');
            $table->integer('issues');
            $table->integer('case_report');
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
