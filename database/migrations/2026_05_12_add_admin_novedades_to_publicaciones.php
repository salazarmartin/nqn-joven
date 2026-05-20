<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('noticias', function (Blueprint $table) {
            // Permite noticias sin institución (creadas por admin)
            $table->unsignedBigInteger('perf_institucion_id')->nullable()->change();

            // Admin que creó la publicación
            $table->unsignedBigInteger('admin_id')->nullable()->after('perf_institucion_id');
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('noticias', function (Blueprint $table) {
            $table->dropForeign(['admin_id']);
            $table->dropColumn('admin_id');
            $table->unsignedBigInteger('perf_institucion_id')->nullable(false)->change();
        });
    }
};
