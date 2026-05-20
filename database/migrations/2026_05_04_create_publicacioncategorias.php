<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('noticiacategorias', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('categoria_id')->nullable();
            $table->foreign('categoria_id')->references('id')->on('categorias')->onDelete('cascade')->onUpdate('cascade');
            
            $table->unsignedBigInteger('noticia_id')->nullable();
            $table->foreign('noticia_id')->references('id')->on('noticias')->onDelete('cascade')->onUpdate('cascade');
            
            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('noticiacategorias');
    }
};