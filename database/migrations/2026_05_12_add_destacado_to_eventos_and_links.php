<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('eventos', function (Blueprint $table) {
            if (!Schema::hasColumn('eventos', 'destacado')) {
                $table->tinyInteger('destacado')->default(0)->after('publicado');
            }
        });

        Schema::table('links_interes', function (Blueprint $table) {
            if (!Schema::hasColumn('links_interes', 'destacado')) {
                $table->tinyInteger('destacado')->default(0)->after('activo');
            }
        });
    }

    public function down(): void
    {
        Schema::table('eventos', function (Blueprint $table) {
            $table->dropColumn('destacado');
        });
        Schema::table('links_interes', function (Blueprint $table) {
            $table->dropColumn('destacado');
        });
    }
};
