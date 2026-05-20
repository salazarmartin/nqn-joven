<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('perf_persona', function (Blueprint $table) {
            
            
            $table->unsignedBigInteger('region_id')->nullable();
            $table->foreign('region_id')->references('id')->on('regiones')->onDelete('cascade')->onUpdate('cascade');
            
            $table->string('username')->unique();
            $table->unsignedBigInteger('estudio_id')->nullable();
            $table->foreign('estudio_id')->references('id')->on('estudios')->onDelete('cascade')->onUpdate('cascade');
            
            
        });
    }

    public function down(): void
    {
        Schema::table('perf_persona', function (Blueprint $table) {
            $table->dropColumn('username');
        });
    }
};
