<?php

namespace App\Http\Controllers\Publicaciones;

use App\Http\Controllers\ActividadController;
use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\LikeCreado;
use Illuminate\Support\Facades\Log;

class LikeController extends Controller
{
    /**
     * Toggle (crear o eliminar) like en una noticia o comentario
     */
    public function toggle(Request $request)
    {
        
        $validated = $request->validate([
            'target_id' => 'required|integer',
            'target_tipo' => 'required|in:noticia,comentario,evento,like',
        ]);

        $user = Auth::user();

        // Identificar perfil
        // Obtener el ID del perfil segun el tipo de usuario
        if ($user->tipo_usuario === 'persona') {
            $perfId = $user->persona->id;
            $perfKey = 'perf_persona_id';
        } else {
            $perfId = $user->institucion->id;
            $perfKey = 'perf_institucion_id';
        }

        // Buscar si ya existe el like
        $like = Like::where([
            $perfKey => $perfId,
            'target_id' => $validated['target_id'],
            'target_tipo' => $validated['target_tipo'],
        ])->first();
        
        if ($like) {
            // Si existe, eliminar
            $like->delete();

            ActividadController::registrar(
                $user->id,
                'unlike',
                'noticia',
                $validated['target_id'],
                'Quitaste tu like'
            );

            return response()->json([
                'success' => true,
                'action' => 'unliked',
                'message' => 'Like eliminado',
            ]);
        } else {
            // Si no existe, crear (like)
            $like = Like::create([
                $perfKey => $perfId,
                'target_id' => $validated['target_id'],
                'target_tipo' => $validated['target_tipo'],
            ]);

            // Determinar el dueño según el tipo de target
            $duenoUserId = null;
            
            if ($validated['target_tipo'] === 'noticia') {
                $noticia = $like->noticia;
                if($noticia->admin_id){
                    $duenoNoticia = User::where('id','=',$noticia->admin_id)->get();
                    if(count($duenoNoticia)>0)
                        $duenoUserId = $duenoNoticia[0]->id;
                }
                
            } elseif ($validated['target_tipo'] === 'evento') {
                $evento = $like->evento;
                if($evento->admin_id){
                    $duenoNoticia = User::where('id','=',$evento->admin_id)->get();
                    if(count($duenoNoticia)>0)
                        $duenoUserId = $duenoNoticia[0]->id;
                }
             
            } elseif ($validated['target_tipo'] === 'comentario') {
                $comentario = $like->comentario;
                // El dueño del comentario puede ser persona o institución
                $duenoUserId = $comentario->persona?->user->id 
                            ?? $comentario->institucion?->user->id;
            }
            
            // Solo hacer broadcast si NO eres el dueño
            if ($duenoUserId && $user->id !== $duenoUserId) {
                broadcast(new LikeCreado($like))->toOthers();
            }

            ActividadController::registrar(
                $user->id,
                'like',
                $validated['target_tipo'], // 👈 Usar el tipo correcto
                $validated['target_id'],
                'Te gustó ' . ($validated['target_tipo'] === 'noticia' ? 'una noticia/evento' : 'un comentario')
            );

            return response()->json([
                'success' => true,
                'action' => 'liked',
                'message' => 'Like agregado',
            ]);
        }
    }
}
