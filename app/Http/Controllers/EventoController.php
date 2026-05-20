<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ActividadController;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Models\Evento;

use App\Models\VisitaInstitucion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EventoController extends Controller
{
    
    /**
     * Muestra un evento específica
     */
    public function show($id)
    {
        $user = Auth::user();

        if ($user->tipo_usuario === 'persona' && !$user->persona) {
            abort(500, 'Perfil de persona no encontrado');
        }
        if ($user->tipo_usuario === 'institucion' && !$user->institucion) {
            abort(500, 'Perfil de institución no encontrado');
        }

        
        $evento = Evento::with([
            'user',
            
            'likes',
            'comentarios' => function ($query) {
                $query->whereNull('coment_padre_id')
                    ->with([
                        'persona.user',
                        'institucion.user',
                        'respuestas' => function ($subQuery) {
                            $subQuery->with(['persona.user', 'institucion.user', 'likes'])
                                ->orderBy('created_at', 'asc');
                        },
                        'likes'
                    ])
                    ->orderBy('created_at', 'desc');
            },
            'favoritos' => function ($query) use ($user) {
                if ($user->tipo_usuario === 'persona') {
                    $query->where('perf_persona_id', $user->persona->id);
                } else {
                    $query->where('perf_institucion_id', $user->institucion->id);
                }
            }
        ])->findOrFail($id);


        ActividadController::registrar(
            $user->id,
            'vista',
            'evento',
            $id,
            'Viste un evento'
        );

        $adminevento = User::where('id', '=', $evento->admin_id)->get();


        return Inertia::render('Eventos/Show', [
            'evento' => $evento,
            'adminevento' => $adminevento[0],
            'userType' => $user->tipo_usuario,
        ]);
    }

}