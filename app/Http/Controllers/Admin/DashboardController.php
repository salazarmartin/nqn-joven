<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Evento;
use App\Models\Link;
use App\Models\Noticia;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'usuarios'      => User::count(),
                'personas'      => User::where('tipo_usuario', 'persona')->count(),
                'instituciones' => User::where('tipo_usuario', 'institucion')->count(),
                'pendientes'    => User::where('estado', 'pendiente_aprobacion')->count(),
                'noticias' => Noticia::count(),
                'eventos'       => Evento::count(),
                'links'         => Link::count(),
            ],
        ]);
    }
}
