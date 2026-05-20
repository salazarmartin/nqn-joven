<?php

namespace App\Http\Controllers\Publicaciones;

use App\Http\Controllers\ActividadController;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Noticia;
use App\Models\Evento;
use App\Models\NoticiaMedia;
use App\Models\VisitaInstitucion;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NoticiaController extends Controller
{
    /**
     * Almacena una nueva noticia
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->tipo_usuario !== 'institucion') {
            abort(403, 'Solo las instituciones pueden crear noticias');
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
            'publicado' => 'nullable',
            'categorias' => 'required|array|min:1|max:5',
            'categorias.*' => 'string|max:255',
        ]);

        // Crear la noticia
        $noticia = Noticia::create([
            'perf_institucion_id' => $user->institucion->id,
            'titulo' => $validated['titulo'],
            'contenido' => $validated['contenido'],
            'publicado' => $request->input('publicado') == '1' || $request->input('publicado') == 1 || $request->input('publicado') === true,
            'categorias' => $validated['categorias'],
        ]);

        // Procesar archivos multimedia
        $mediaCount = 0;

        $index = 0;
        while ($request->hasFile("media.{$index}.file")) {
            try {
                $file = $request->file("media.{$index}.file");
                $tipo = $request->input("media.{$index}.tipo");

                Log::info("Procesando media.{$index}.file", [
                    'original_name' => $file->getClientOriginalName(),
                    'tipo' => $tipo,
                    'size' => $file->getSize(),
                ]);

                // Guardar el archivo
                $path = $file->store('noticias', 'public');

                // Crear el registro en la base de datos
                $media = NoticiaMedia::create([
                    'noticia_id' => $noticia->id,
                    'tipo' => $tipo,
                    'url' => $path,
                    'orden' => $index,
                ]);

                $mediaCount++;
            } catch (\Exception $e) {
                Log::error("Error procesando media.{$index}.file: " . $e->getMessage());
                Log::error($e->getTraceAsString());
            }

            $index++;
        }

        if ($noticia->publicado) {
            // Cargar la relación de la institución
            $noticia->load('institucion');
            
            // Obtener usuarios que guardaron esta institución
            $usuariosInteresados = $noticia->institucion->guardadaPorUsuarios;
            
            // Enviar notificación a cada usuario
            foreach ($usuariosInteresados as $ubicacionGuardada) {
                $usuario = $ubicacionGuardada->user;
                if ($usuario) {
                    $usuario->notify(new \App\Notifications\UbicacionGuardadaNotification($noticia));
                }
            }
            
            // Disparar evento de broadcast
            event(new \App\Events\PublicacionCreada($noticia));
        }

        return redirect()->route('noticias.misPublicaciones')
            ->with('success', 'noticia creada exitosamente');
    }

    /**
     * Muestra el feed principal filtrado por intereses del usuario
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->tipo_usuario === 'persona' && !$user->persona) {
            abort(500, 'Perfil de persona no encontrado');
        }
        if ($user->tipo_usuario === 'institucion' && !$user->institucion) {
            abort(500, 'Perfil de institución no encontrado');
        }

        // Obtener intereses del usuario
        $perfil = $user->tipo_usuario === 'persona' ? $user->persona : $user->institucion;

        $interesesUsuario = [];
        if ($perfil && $perfil->interests) {
            $interesesUsuario = is_array($perfil->interests) ? $perfil->interests : [];
        }

        // Construir query base
        $query = Noticia::with([
            'institucion.user',
            'media' => function ($query) {
                $query->orderBy('orden', 'asc');
            },
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
        ])
            ->where('publicado', true);

        // FILTRAR POR INTERESES si el usuario tiene intereses configurados
        if (!empty($interesesUsuario) && is_array($interesesUsuario)) {
            $query->where(function ($q) use ($interesesUsuario) {
                foreach ($interesesUsuario as $interes) {
                    $interesSafe = addslashes($interes);
                    $q->orWhere('categorias', 'LIKE', '%"' . $interesSafe . '"%');
                }
            });
        }

        $query->orderBy('created_at', 'desc');
        $noticias = $query->paginate(10);

        // Calcular relevancia y agregar información adicional
        $noticias->getCollection()->transform(function ($noticia) use ($user, $interesesUsuario) {
            if (!empty($interesesUsuario)) {
                $categorias = is_array($noticia->categorias)
                    ? $noticia->categorias
                    : json_decode($noticia->categorias, true);

                $noticia->relevance_score = is_array($categorias)
                    ? collect($categorias)->intersect($interesesUsuario)->count()
                    : 0;
            } else {
                $noticia->relevance_score = 0;
            }

            $noticia->likes_count = $noticia->likes->count();
            $noticia->comentarios_count = $noticia->comentarios->count();

            if ($user->tipo_usuario === 'persona') {
                $noticia->user_has_liked = $noticia->likes->contains(fn($like) => $like->perf_persona_id === $user->persona->id);
            } else {
                $noticia->user_has_liked = $noticia->likes->contains(fn($like) => $like->perf_institucion_id === $user->institucion->id);
            }

            $noticia->is_favorite = $noticia->favoritos->isNotEmpty();

            return $noticia;
        });

        if (!empty($interesesUsuario)) {
            $sorted = $noticias->getCollection()
                ->sortByDesc(fn($pub) => [$pub->relevance_score, $pub->created_at->timestamp])
                ->values();
            $noticias->setCollection($sorted);
        }

        // Obtener instituciones visitadas recientemente (solo para personas)
        $institucionesVisitadas = [];
        if ($user->tipo_usuario === 'persona') {
            $institucionesVisitadas =   VisitaInstitucion::ultimasVisitadas($user->id, 5);
        }
        $categorias = Categoria::orderBy('nombre')->get();

        $destacados = collect()
            ->concat(
                Noticia::with(['region', 'categoria'])
                    ->where('destacado', 1)->where('publicado', 1)
                    ->orderByDesc('created_at')->take(6)->get()
                    ->map(fn($p) => [
                        'id'          => $p->id,
                        'titulo'      => $p->titulo,
                        'descripcion' => $p->resumen ?? substr(strip_tags($p->contenido ?? ''), 0, 100),
                        'imagen'      => $p->imagen ? asset('storage/' . $p->imagen) : null,
                        'url'         => '/noticias/' . $p->id,
                        'tipo'        => 'noticia',
                        'categoria_id'   => $p->categoria?->nombre,
                        'region_id'      => $p->region?->nombre,
                        
                    ])
            )
            ->concat(
                Evento::with(['region', 'categoria'])
                    ->where('destacado', 1)->where('publicado', 1)
                    ->orderBy('fecha')->take(6)->get()
                    ->map(fn($e) => [
                        'id'          => $e->id,
                        'titulo'      => $e->titulo,
                        'descripcion' => ($e->fecha ? $e->fecha->format('d/m/Y') . ' — ' : '') . ($e->lugar ?? ''),
                        'imagen'      => $e->imagen ? asset('storage/' . $e->imagen) : null,
                        'url'         => $e->link_externo ?: null,
                        'tipo'        => 'evento',
                        'categoria_id'   => $e->categoria?->nombre,
                        'region_id'      => $e->region?->nombre,
                        
                    ])
            )
            ->concat(
                \App\Models\Link::with(['region', 'categoria'])
                    ->where('destacado', 1)->where('activo', 1)
                    ->orderBy('orden')->take(6)->get()
                    ->map(fn($l) => [
                        'id'          => $l->id,
                        'titulo'      => $l->titulo,
                        'descripcion' => $l->url,
                        'imagen'      => null,
                        'url'         => $l->url,
                        'tipo'        => 'link',
                        'categoria_id'   => $l->categoria?->nombre,
                        'region_id'      => $l->region?->nombre,
                        
                    ])
            )
            ->values();

        //$destacados = $noticias->union($eventos)->get();

        return Inertia::render('Inicio', [
            'noticias' => $noticias,
            'categorias' => $categorias,
            'destacados' => $destacados,
            'userType' => $user->tipo_usuario,
            'regionNombre' => $user->persona->region->nombre,
            'institucionesVisitadas' => $institucionesVisitadas,
        ]);
    }

    /**
     * Muestra una noticia específica
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

        $noticia = Noticia::with([
            'institucion.user',
            'media' => function ($query) {
                $query->orderBy('orden', 'asc');
            },
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
            'noticia',
            $id,
            'Viste una noticia'
        );

        $noticia->increment('count_visualizaciones');
        $noticia->likes_count = $noticia->likes->count();

        if ($user->tipo_usuario === 'persona') {
            $noticia->user_has_liked = $noticia->likes->contains(function ($like) use ($user) {
                return $like->perf_persona_id === $user->persona->id;
            });
        } else {
            $noticia->user_has_liked = $noticia->likes->contains(function ($like) use ($user) {
                return $like->perf_institucion_id === $user->institucion->id;
            });
        }

        if ($user->tipo_usuario === 'persona') {
            $noticia->is_favorite = $noticia->favoritos->isNotEmpty();
        } else {
            $noticia->is_favorite = $noticia->favoritos->isNotEmpty();
        }

        return Inertia::render('Publicaciones/Show', [
            'noticia' => $noticia,
            'userType' => $user->tipo_usuario,
        ]);
    }

    /**
     * Muestra las noticias de la institución actual
     */
    public function misPublicaciones()
    {
        $user = Auth::user();

        if ($user->tipo_usuario !== 'institucion') {
            abort(403, 'No tienes permiso para acceder a esta página');
        }

        $noticias = Noticia::with([
            'media' => function ($query) {
                $query->orderBy('orden', 'asc');
            },
            'likes',
            'comentarios'
        ])
            ->where('perf_institucion_id', $user->institucion->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $noticias->getCollection()->transform(function ($noticia) {
            $noticia->likes_count = $noticia->likes->count();
            $noticia->comentarios_count = $noticia->comentarios->count();
            return $noticia;
        });

        return Inertia::render('Publicaciones/MisPublicaciones', [
            'noticias' => $noticias,
        ]);
    }

    /**
     * Muestra el formulario para crear una nueva noticia
     */
    public function create()
    {
        $user = Auth::user();

        if ($user->tipo_usuario !== 'institucion') {
            abort(403, 'Solo las instituciones pueden crear noticias');
        }

        return Inertia::render('Publicaciones/Create');
    }

    /**
     * Muestra el formulario de edición
     */
    public function edit($id)
    {
        $user = Auth::user();
        $noticia = Noticia::with('media')->findOrFail($id);

        if ($noticia->perf_institucion_id !== $user->institucion->id) {
            abort(403, 'No tienes permiso para editar esta noticia');
        }

        return Inertia::render('Publicaciones/Edit', [
            'noticia' => $noticia,
        ]);
    }

    /**
     * Actualiza una noticia existente
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $noticia = Noticia::findOrFail($id);

        if ($noticia->perf_institucion_id !== $user->institucion->id) {
            abort(403, 'No tienes permiso para editar esta noticia');
        }

        if ($noticia->publicado) {
            // Solo actualizar contenido si está publicada
            $validated = $request->validate([
                'contenido' => 'required|string',
            ]);

            $noticia->update([
                'contenido' => $validated['contenido'],
            ]);
        } else {
            // Actualizar todo si es borrador
            $validated = $request->validate([
                'titulo' => 'required|string|max:255',
                'contenido' => 'required|string',
                'publicado' => 'nullable',
                'categorias' => 'required|array|min:1|max:5',
                'categorias.*' => 'string|max:255',
            ]);

            $noticia->update([
                'titulo' => $validated['titulo'],
                'contenido' => $validated['contenido'],
                'publicado' => $request->input('publicado') == '1' || $request->input('publicado') == 1,
                'categorias' => $validated['categorias'],
            ]);

            // Eliminar media marcada
            if ($request->has('deleted_media')) {
                $deletedMedia = $request->input('deleted_media');
                if (is_array($deletedMedia)) {
                    foreach ($deletedMedia as $mediaId) {
                        $media = NoticiaMedia::find($mediaId);
                        if ($media && $media->noticia_id === $noticia->id) {
                            Storage::disk('public')->delete($media->url);
                            $media->delete();
                        }
                    }
                }
            }

            // Agregar nueva media
            $currentMaxOrder = $noticia->media()->max('orden') ?? -1;
            $index = 0;

            while ($request->hasFile("media.{$index}.file")) {
                try {
                    $file = $request->file("media.{$index}.file");
                    $tipo = $request->input("media.{$index}.tipo");
                    $path = $file->store('noticias', 'public');

                    NoticiaMedia::create([
                        'noticia_id' => $noticia->id,
                        'tipo' => $tipo,
                        'url' => $path,
                        'orden' => $currentMaxOrder + $index + 1,
                    ]);
                } catch (\Exception $e) {
                    Log::error("Error procesando nueva media: " . $e->getMessage());
                }

                $index++;
            }
        }

        return redirect()->route('noticias.misPublicaciones')
            ->with('success', 'noticia actualizada exitosamente');
    }

    /**
     * Elimina una noticia (soft delete)
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $noticia = Noticia::findOrFail($id);

        if ($noticia->perf_institucion_id !== $user->institucion->id) {
            abort(403, 'No tienes permiso para eliminar esta noticia');
        }

        $noticia->delete();

        return redirect()->back()
            ->with('success', 'Noticia eliminada exitosamente');
    }
}