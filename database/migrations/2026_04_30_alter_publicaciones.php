<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('noticias', function (Blueprint $table) {
            
            
            $table->unsignedBigInteger('region_id')->nullable();
            $table->foreign('region_id')->references('id')->on('regiones')->onDelete('cascade')->onUpdate('cascade');
            
            $table->text('resumen')->nullable();
            $table->string('imagen')->nullable();
            $table->string('link_externo')->nullable();
            
        });
    }

    public function down(): void
    {
        Schema::table('noticias', function (Blueprint $table) {
            $table->dropColumn('resumen');
        });
    }
};
