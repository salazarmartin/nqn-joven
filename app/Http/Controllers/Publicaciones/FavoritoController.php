<?php

namespace App\Http\Controllers\Publicaciones;

use App\Http\Controllers\ActividadController;
use App\Http\Controllers\Controller;
use App\Models\Favorito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoritoController extends Controller
{
    /**
     * Toggle favorito en una noticia
     * guardar y eliminar favoritos
     */
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'noticia_id' => 'required|exists:noticias,id',
        ]);

        $noticiaId = $validated['noticia_id'];
        $user = Auth::user();

        $campo = $user->tipo_usuario === 'persona' ? 'perf_persona_id' : 'perf_institucion_id';
        $perfilId = $user->tipo_usuario === 'persona' ? $user->persona->id : $user->institucion->id;

        $favorito = Favorito::where([
            $campo => $perfilId,
            'noticia_id' => $noticiaId,
        ])->first();

        if ($favorito) {
            $favorito->delete();

            ActividadController::registrar(
                $user->id,
                'dejar_favorito',
                'noticia',
                $noticiaId,
                'Quitaste de favoritos'
            );

            return response()->json([
                'success' => true,
                'action' => 'removed',
                'message' => 'Noticia eliminada de favoritos',
            ]);
        } else {
            Favorito::create([
                $campo => $perfilId,
                'noticia_id' => $noticiaId,
            ]);

            ActividadController::registrar(
                $user->id,
                'favorito',
                'noticia',
                $noticiaId,
                'Guardaste en favoritos'
            );

            return response()->json([
                'success' => true,
                'action' => 'added',
                'message' => 'Noticia agregada a favoritos',
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
