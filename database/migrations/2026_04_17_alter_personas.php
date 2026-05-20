<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('perf_persona', function (Blueprint $table) {
            
            
            $table->enum('trabaja_emprende', ['No', 'Trabaja', 'Emprende', 'Ambos'])->default('No');
            $table->string('qr_token');
            $table->integer('dni')->nullable();
            
        });
    }

    public function down(): void
    {
        Schema::table('perf_persona', function (Blueprint $table) {
            $table->dropColumn('dni');
        });
    }
};
