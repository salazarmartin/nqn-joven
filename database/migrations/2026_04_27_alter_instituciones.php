<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('perf_institucion', function (Blueprint $table) {
            if (!Schema::hasColumn('perf_institucion', 'region_id')) {
                $table->unsignedBigInteger('region_id')->nullable();
                $table->foreign('region_id')->references('id')->on('regiones')->onDelete('cascade')->onUpdate('cascade');
            }
            if (!Schema::hasColumn('perf_institucion', 'razon_social')) {
                $table->string('razon_social')->nullable();
            }
            if (!Schema::hasColumn('perf_institucion', 'email_contacto')) {
                $table->string('email_contacto')->nullable();
            }
            if (!Schema::hasColumn('perf_institucion', 'logo')) {
                $table->string('logo')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('perf_institucion', function (Blueprint $table) {
            $table->dropColumn('razon_social');
        });
    }
};
