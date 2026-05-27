<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('links_interes', function (Blueprint $table) {
            
            
            $table->unsignedBigInteger('admin_id')->nullable();
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            
        });
    }

    public function down(): void
    {
        Schema::table('links_interes', function (Blueprint $table) {
            $table->dropColumn('admin_id');
        });
    }
};
