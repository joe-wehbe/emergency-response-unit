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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_number')->nullable()->change();
            $table->string('major')->nullable()->change();
            $table->string('student_id')->nullable()->change();
            $table->string('profile_picture')->nullable()->change();
            $table->string('bio')->nullable()->change();
            $table->string('tags')->nullable()->change();
            $table->string('user_rank')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('table_name', function (Blueprint $table) {
            //
        });
    }
};
