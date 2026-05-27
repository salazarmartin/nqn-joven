<?php

namespace App\Http\Controllers\Publicaciones;

use App\Http\Controllers\ActividadController;
use App\Http\Controllers\Controller;
use App\Models\Favorito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FavoritoController extends Controller
{
    /**
     * Toggle favorito en una noticia
     * guardar y eliminar favoritos
     */
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'noticia_id' => 'required',
            'tipo' => 'required'
        ]);

        $id = $validated['noticia_id'];
        $user = Auth::user();

        $campo = $user->tipo_usuario === 'persona' ? 'perf_persona_id' : 'perf_institucion_id';
        $perfilId = $user->tipo_usuario === 'persona' ? $user->persona->id : $user->institucion->id;

        if($request->tipo == "noticia"){
            $favorito = Favorito::where([
                $campo => $perfilId,
                'noticia_id' => $id,
            ])->first();
        }else{
            if($request->tipo == "evento"){
                $favorito = Favorito::where([
                    $campo => $perfilId,
                    'evento_id' => $id,
                ])->first();
            }
        }

        if ($favorito) {
            $favorito->delete();

            ActividadController::registrar(
                $user->id,
                'dejar_favorito',
                $request->tipo,
                $id,
                'Quitaste de favoritos'
            );

            return response()->json([
                'success' => true,
                'action' => 'removed',
                'message' => $request->tipo.' eliminada/o de favoritos',
            ]);
        } else {
            
            if($request->tipo == "noticia"){
                Favorito::create([
                    $campo => $perfilId,
                    'noticia_id' => $id,
                ]);
            }else{
                if($request->tipo == "evento"){
                    Favorito::create([
                        $campo => $perfilId,
                        'evento_id' => $id,
                    ]);
                }
            }
            ActividadController::registrar(
                $user->id,
                'favorito',
                $request->tipo,
                $id,
                'Guardaste en favoritos'
            );

            return response()->json([
                'success' => true,
                'action' => 'added',
                'message' => $request->tipo.' agregada/o a favoritos',
            ]);
        }
    }

    /**
     * Lista de noticias favoritas del usuario
     */
    public function index()
    {
        $user = Auth::user();

        // Determinar el campo según el tipo de usuario
        $campo = $user->tipo_usuario === 'persona' ? 'perf_persona_id' : 'perf_institucion_id';
        $perfilId = $user->tipo_usuario === 'persona' ? $user->persona->id : $user->institucion->id;

        $favoritos = Favorito::with([
            'noticia.institucion.user',
            'noticia.media',
            'noticia.likes',
        ])
            ->where($campo, $perfilId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $noticias = $favoritos->through(function ($fav) use ($user) {
            $pub = $fav->noticia;
            if ($pub) {
                $pub->is_favorite = true;

                // Contador de likes
                $pub->likes_count = $pub->likes ? $pub->likes->count() : 0;

                // Si el usuario actual ya dio like
                if ($user->tipo_usuario === 'persona') {
                    $pub->user_has_liked = $pub->likes->contains('perf_persona_id', $user->persona->id);
                } else {
                    $pub->user_has_liked = $pub->likes->contains('perf_institucion_id', $user->institucion->id);
                }
            }
            return $pub;
        });

        return inertia('Favoritos/Index', [
            'auth' => ['user' => $user],
            'userType' => $user->tipo_usuario,
            'favoritos' => $noticias,
        ]);
    }
}
