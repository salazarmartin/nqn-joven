<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email    = $this->command->ask('Email del admin', 'admin@nqnjoven.gob.ar');
        $nombre   = $this->command->ask('Nombre', 'Administrador');
        $password = $this->command->secret('Contraseña');
        if (User::where('email', $email)->exists()) {
            $this->command->warn("Ya existe un usuario con el email {$email}.");
            return;
        }

        User::create([
            'email'        => $email,
            'password'     => Hash::make($password),
            'nombre'       => $nombre,
            'tipo_usuario' => 'admin',
            'estado'       => 'activo',
            'telefono'     => '',
            'ciudad'       => '',
            'provincia'    => '',
        ]);

        $this->command->info("Admin '{$email}' creado correctamente.");
    }
}
