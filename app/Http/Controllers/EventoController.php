<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ActividadController;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Models\Evento;
use App\Models\EventoInscripcion;
use App\Models\VisitaInstitucion;
use App\Models\User;
use App\Mail\InscripcionEvento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
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

        $evento->likes_count = $evento->likes->count();

        $inscripcionesCount = $evento->inscripciones()->count();
        $userIsInscrito = false;
        $cuposDisponibles = null;

        if ($evento->inscripcion_habilitada) {
            $userIsInscrito = $evento->inscripciones()->where('user_id', $user->id)->exists();
            if ($evento->cupos !== null) {
                $cuposDisponibles = max(0, $evento->cupos - $inscripcionesCount);
            }
        }


        if ($user->tipo_usuario === 'persona') {
            $evento->user_has_liked = $evento->likes->contains(function ($like) use ($user) {
                return $like->perf_persona_id == $user->persona->id;
            });
        } else {
            $evento->user_has_liked = $evento->likes->contains(function ($like) use ($user) {
                return $like->perf_institucion_id == $user->institucion->id;
            });
        }

        
        if ($user->tipo_usuario === 'persona') {
            $evento->is_favorite = $evento->favoritos->isNotEmpty();
        } else {
            $evento->is_favorite = $evento->favoritos->isNotEmpty();
        }

        $adminevento = User::where('id', '=', $evento->admin_id)->get();
            

        return Inertia::render('Eventos/Show', [
            'evento'           => $evento,
            'adminevento'      => $adminevento[0],
            'userType'         => $user->tipo_usuario,
            'userIsInscrito'   => $userIsInscrito,
            'cuposDisponibles' => $cuposDisponibles,
            'inscripcionesCount' => $inscripcionesCount,
        ]);
    }

    public function inscribirse(Request $request, $id)
    {
        $user = Auth::user();

        if ($user->tipo_usuario !== 'persona') {
            return response()->json(['error' => 'Solo las personas pueden inscribirse.'], 403);
        }

        $evento = Evento::findOrFail($id);

        if (!$evento->inscripcion_habilitada) {
            return response()->json(['error' => 'Este evento no tiene inscripción habilitada.'], 400);
        }

        $ahora = now();
        if ($evento->fecha_inicio_inscripcion && $ahora->lt($evento->fecha_inicio_inscripcion)) {
            return response()->json(['error' => 'El período de inscripción aún no comenzó.'], 400);
        }
        if ($evento->fecha_fin_inscripcion && $ahora->gt($evento->fecha_fin_inscripcion)) {
            return response()->json(['error' => 'El período de inscripción ya finalizó.'], 400);
        }

        if (EventoInscripcion::where('evento_id', $id)->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'Ya estás inscripto en este evento.'], 400);
        }

        if ($evento->cupos !== null) {
            $inscriptos = EventoInscripcion::where('evento_id', $id)->count();
            if ($inscriptos >= $evento->cupos) {
                return response()->json(['error' => 'No hay cupos disponibles.'], 400);
            }
        }

        EventoInscripcion::create([
            'evento_id' => $id,
            'user_id'   => $user->id,
        ]);

        try {
            Mail::to($user->email)->send(new InscripcionEvento($user, $evento));
        } catch (\Exception $e) {
            Log::error('Error al enviar email de inscripción: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => '¡Inscripción exitosa!']);
    }

}