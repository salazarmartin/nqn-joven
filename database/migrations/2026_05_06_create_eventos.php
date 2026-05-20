<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('eventos')) return;

        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->string('imagen')->nullable();

            $table->string('lugar');
            $table->date('fecha');
            $table->string('hora');

            $table->tinyInteger('publicado')->nullable();
            $table->string('link_externo')->nullable();
            $table->enum('modalidad', ['presencial', 'virtual', 'hibrida'])->default('presencial');

            $table->unsignedBigInteger('region_id')->nullable();
            $table->foreign('region_id')->references('id')->on('regiones')->onDelete('cascade')->onUpdate('cascade');

            $table->unsignedBigInteger('categoria_id')->nullable();
            $table->foreign('categoria_id')->references('id')->on('categorias')->onDelete('cascade')->onUpdate('cascade');
            
            $table->unsignedBigInteger('admin_id')->nullable();
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            
            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};