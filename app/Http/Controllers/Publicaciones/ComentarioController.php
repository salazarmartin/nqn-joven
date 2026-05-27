<?php

namespace App\Http\Controllers\Publicaciones;

use App\Http\Controllers\ActividadController;
use App\Http\Controllers\Controller;
use App\Models\ComentNoticia;
use App\Models\ComentEvento;
use App\Models\User;
use App\Services\OpenAIModerationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Events\ComentarioCreado;
use App\Events\RespuestaComentarioEvent;
use App\Notifications\RespuestaComentarioNotification;



class ComentarioController extends Controller
{
    protected $moderationService;

    public function __construct(OpenAIModerationService $moderationService)
    {
        $this->moderationService = $moderationService;
    }

    /**
     * Almacena un nuevo comentario
     * Bloquea comentarios con palabras prohibidas
     */
    public function store(Request $request)
    {Log::info($request);
        $validated = $request->validate([
            'noticia_id' => 'required',
            'contenido' => 'required|string|max:1000',
            'coment_padre_id' => 'nullable',
        ]);

        $user = Auth::user();

        // Moderar el contenido ANTES de permitir su noticia
        $moderationResult = $this->moderationService->moderate($validated['contenido']);

        if (!$moderationResult['is_safe']) {
            $detectedCount = count($moderationResult['detected_words'] ?? []);

            return response()->json([
                'success' => false,
                'blocked' => true,
                'detected_words_count' => $detectedCount,
                'message' => $moderationResult['message'],
            ], 422);
        }

        if($request->tipo == "noticia"){
            $comentarioData = [
                'noticia_id' => $validated['noticia_id'],
                'contenido' => $validated['contenido'], // guardar texto original
                'coment_padre_id' => $validated['coment_padre_id'] ?? null,
            ];
            
            if ($user->tipo_usuario === 'persona') {
                $comentarioData['perf_persona_id'] = $user->persona->id;
            } else {
                $comentarioData['perf_institucion_id'] = $user->institucion->id;
            }

            $comentario = ComentNoticia::create($comentarioData);

        }else{
            if($request->tipo == "evento"){
                $comentarioData = [
                    'evento_id' => $validated['noticia_id'],
                    'contenido' => $validated['contenido'], // guardar texto original
                    'coment_padre_id' => $validated['coment_padre_id'] ?? null,
                ];

                if ($user->tipo_usuario === 'persona') {
                    $comentarioData['perf_persona_id'] = $user->persona->id;
                } else {
                    $comentarioData['perf_institucion_id'] = $user->institucion->id;
                }

                $comentario = ComentEvento::create($comentarioData);

            }
        }


        Log::info('Comentario creado:', [
            'id' => $comentario->id,
            'contenido' => $comentario->contenido,
            'coment_padre_id' => $comentario->coment_padre_id,
            'user_id' => $user->id,
        ]);

        if (!$comentario->coment_padre_id) {
        Log::info('Disparando evento ComentarioCreado para comentario normal', ['id' => $comentario->id]);
        
        
        if($request->tipo == "noticia"){
            $noticia = $comentario->noticia;
            
            if($noticia->admin_id){
                $duenoNoticia = User::where('id','=',$noticia->admin_id)->get();
                if(count($duenoNoticia)>0)
                    $dueno = $duenoNoticia[0];
            }
            
            if ($user->id !== $dueno->id) {
                event(new ComentarioCreado($comentario));
            }
        }else{
            if($request->tipo == "evento"){
                $evento = $comentario->evento;
                
                if($evento->admin_id){
                    $duenoevento = User::where('id','=',$evento->admin_id)->get();
                    if(count($duenoevento)>0)
                        $dueno = $duenoevento[0];
                }
                
                if ($user->id !== $dueno->id) {
                    event(new ComentarioCreado($comentario));
                }
            }
        }
    } else {
        if($request->tipo == "noticia"){
            $comentarioPadre = ComentNoticia::find($comentario->coment_padre_id);
            
            // 👇 VERIFICAR ANTES DE DISPARAR EL EVENTO
            $receptorPadre = $comentarioPadre->persona?->user ?? $comentarioPadre->institucion?->user;
            
            if ($receptorPadre && $receptorPadre->id !== $user->id) {
                Log::info('Disparando evento RespuestaComentarioEvent para comentario hijo', [
                    'comentario_id' => $comentario->id,
                    'coment_padre_id' => $comentario->coment_padre_id,
                ]);
                
                event(new RespuestaComentarioEvent($comentario));
                $receptorPadre->notify(new RespuestaComentarioNotification($comentario));
            }
        }else{
            if($request->tipo == "evento"){
                $comentarioPadre = ComentEvento::find($comentario->coment_padre_id);
                
                // 👇 VERIFICAR ANTES DE DISPARAR EL EVENTO
                $receptorPadre = $comentarioPadre->persona?->user ?? $comentarioPadre->institucion?->user;
                
                if ($receptorPadre && $receptorPadre->id !== $user->id) {
                    Log::info('Disparando evento RespuestaComentarioEvent para comentario hijo', [
                        'comentario_id' => $comentario->id,
                        'coment_padre_id' => $comentario->coment_padre_id,
                    ]);
                    
                    event(new RespuestaComentarioEvent($comentario));
                    $receptorPadre->notify(new RespuestaComentarioNotification($comentario));
                }
            }
        }
    }
        
        if($request->tipo == "noticia"){
            $comentario = ComentNoticia::with([
                'persona.user',
                'institucion.user',
                'likes'
            ])->find($comentario->id);

            Log::info('Comentario final con relaciones cargadas:', ['comentario' => $comentario]);

            ActividadController::registrar(
                $user->id,
                'comentario',
                'noticia',
                $validated['noticia_id'],
                'Comentaste una noticia',
                ['comentario' => $validated['contenido']]
            );
        }else{
            if($request->tipo == "evento"){
                $comentario = ComentEvento::with([
                    'persona.user',
                    'institucion.user',
                    'likes'
                ])->find($comentario->id);

                Log::info('Comentario final con relaciones cargadas:', ['comentario' => $comentario]);

                ActividadController::registrar(
                    $user->id,
                    'comentario',
                    'evento',
                    $validated['noticia_id'],
                    'Comentaste un evento',
                    ['comentario' => $validated['contenido']]
                );
            }
        }
        return response()->json([
            'success' => true,
            'comentario' => $comentario,
            'message' => 'Comentario publicado exitosamente',
        ]);
    }


        /**
         * Elimina un comentario (soft delete)
         */
        public function destroy($id)
        {
            $user = Auth::user();
            $comentario = ComentNoticia::with('noticia')->findOrFail($id);

            $puedeEliminar = false;

            // Verificar si es el dueño del comentario
            if ($user->tipo_usuario === 'persona' && $comentario->perf_persona_id === $user->persona->id) {
                $puedeEliminar = true;
            } elseif ($user->tipo_usuario === 'institucion' && $comentario->perf_institucion_id === $user->institucion->id) {
                $puedeEliminar = true;
            }

            // Verificar si es el dueño de la noticia
            if (
                $user->tipo_usuario === 'institucion' &&
                $comentario->noticia->perf_institucion_id === $user->institucion->id
            ) {
                $puedeEliminar = true;
            }

            if (!$puedeEliminar) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para eliminar este comentario',
                ], 403);
            }

            $comentario->update([
                'eliminado' => true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Comentario eliminado exitosamente',
            ]);
        }
    }
