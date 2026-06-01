<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('provincias')) return;

        Schema::create('provincias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            
            $table->integer('lat')->nullable();
            $table->integer('lng')->nullable();

            $table->integer('habitantes_censo_2010')->nullable();
            $table->integer('habitantes_censo_2022')->nullable();

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provincias');
    }
};