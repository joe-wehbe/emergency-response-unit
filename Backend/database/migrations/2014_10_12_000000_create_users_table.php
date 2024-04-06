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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('lau_email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->integer('student_id')->nullable()->unique();
            $table->string('phone_number')->nullable();
            $table->string('major')->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('bio')->nullable();
            $table->string('tags')->nullable();
            $table->integer('user_type')->default(2);
            $table->integer('user_rank')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
