<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('eventos', function (Blueprint $table) {
            $table->boolean('inscripcion_habilitada')->default(false)->after('destacado');
            $table->unsignedInteger('cupos')->nullable()->after('inscripcion_habilitada');
            $table->dateTime('fecha_inicio_inscripcion')->nullable()->after('cupos');
            $table->dateTime('fecha_fin_inscripcion')->nullable()->after('fecha_inicio_inscripcion');
        });
    }

    public function down(): void
    {
        Schema::table('eventos', function (Blueprint $table) {
            $table->dropColumn(['inscripcion_habilitada', 'cupos', 'fecha_inicio_inscripcion', 'fecha_fin_inscripcion']);
        });
    }
};
