<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('ciudades')) return;

        Schema::create('ciudades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            
            $table->integer('lat')->nullable();
            $table->integer('lng')->nullable();
            
            $table->unsignedBigInteger('provincia_id')->nullable();
            $table->foreign('provincia_id')->references('id')->on('provincias')->onDelete('cascade')->onUpdate('cascade');

            $table->unsignedBigInteger('region_id')->nullable();
            $table->foreign('region_id')->references('id')->on('regiones')->onDelete('cascade')->onUpdate('cascade');

            $table->integer('habitantes')->nullable();
            $table->date('fecha_aniversario')->nullable();
            $table->string('codigo_postal')->nullable();
            $table->string('prefijo_telefono')->nullable();

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ciudades');
    }
};