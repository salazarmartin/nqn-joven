<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('favoritos', function (Blueprint $table) {
            
            
            $table->unsignedBigInteger('evento_id')->nullable();
            $table->foreign('evento_id')->references('id')->on('eventos')->onDelete('cascade')->onUpdate('cascade');
            
        });
    }

    public function down(): void
    {
        Schema::table('favoritos', function (Blueprint $table) {
            $table->dropColumn('evento_id');
        });
    }
};
