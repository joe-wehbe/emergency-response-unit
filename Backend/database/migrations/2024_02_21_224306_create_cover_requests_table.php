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
        Schema::create('cover_requests', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->integer('shift_id');
            $table->integer('request_status')->default(0);
            $table->integer('covered_by')->nullable();
            $table->string('reason');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cover_requests');
    }
};
