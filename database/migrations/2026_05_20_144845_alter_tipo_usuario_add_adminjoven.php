<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Buscar el CHECK constraint actual sobre tipo_usuario
        $constraint = DB::selectOne("
            SELECT constraint_name
            FROM all_cons_columns
            WHERE table_name = 'USERS'
              AND column_name = 'TIPO_USUARIO'
              AND owner = SYS_CONTEXT('USERENV','CURRENT_SCHEMA')
              AND constraint_name IN (
                  SELECT constraint_name FROM all_constraints
                  WHERE constraint_type = 'C'
                    AND table_name = 'USERS'
                    AND owner = SYS_CONTEXT('USERENV','CURRENT_SCHEMA')
              )
        ");

        if ($constraint) {
            DB::statement("ALTER TABLE USERS DROP CONSTRAINT {$constraint->constraint_name}");
        }

        DB::statement("
            ALTER TABLE USERS ADD CONSTRAINT users_tipo_usuario_chk
            CHECK (tipo_usuario IN ('persona', 'institucion', 'admin', 'adminjoven'))
        ");
    }

    public function down(): void
    {
        // Eliminar el constraint si existe (nombre puede estar en mayúsculas en Oracle)
        DB::statement("
            BEGIN
                EXECUTE IMMEDIATE 'ALTER TABLE USERS DROP CONSTRAINT USERS_TIPO_USUARIO_CHK';
            EXCEPTION
                WHEN OTHERS THEN NULL;
            END;
        ");

        // Buscar y eliminar cualquier constraint CHECK sobre TIPO_USUARIO
        $constraints = DB::select("
            SELECT c.constraint_name
            FROM all_constraints c
            JOIN all_cons_columns cc ON c.constraint_name = cc.constraint_name
            WHERE c.table_name = 'USERS'
              AND c.constraint_type = 'C'
              AND cc.column_name = 'TIPO_USUARIO'
              AND c.owner = SYS_CONTEXT('USERENV','CURRENT_SCHEMA')
        ");

        foreach ($constraints as $c) {
            DB::statement("ALTER TABLE USERS DROP CONSTRAINT {$c->constraint_name}");
        }

        DB::statement("
            ALTER TABLE USERS ADD CONSTRAINT users_tipo_usuario_chk
            CHECK (tipo_usuario IN ('persona', 'institucion', 'admin'))
        ");
    }
};
