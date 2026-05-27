<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Categoria;
use App\Models\Region;
use App\Models\Noticia;
use App\Models\Evento;
use App\Models\Link;


class NotificacionController extends Controller
{
    public function marcarLeidas(Request $request)
    {
        $user = $request->user();

        DatabaseNotification::where('notifiable_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['ok' => true]);
    }

    public function todas()
    {
        $user = Auth::id();

        $notificaciones = DatabaseNotification::where('notifiable_id', $user);

        return Inertia::render('Notificaciones/index', [
            'notificaciones' => $notificaciones,
            'auth' => [
                'user' => $user,
            ],
        ]);
        
    }

    
    public function explorar($buscar, $cat, $reg)
    {
        $catNombre = ($cat !== "todas") ? (Categoria::find($cat)?->nombre ?? '') : null;

        // Noticias — guardan categorías como JSON
        $queryNoticias = Noticia::with('region', 'categoria')->where('publicado', 1);
        if ($catNombre) {
            $queryNoticias->where('categorias', 'LIKE', '%"' . $catNombre . '"%');
        }
        if ($reg !== "todas") {
            $queryNoticias->where('region_id', $reg);
        }
        $noticias = $queryNoticias->orderBy('created_at', 'asc')->get();

        // Eventos — usan categoria_id
        $queryEventos = Evento::with('region', 'categoria')->where('publicado', 1);
        if ($cat !== "todas") {
            $queryEventos->where('categoria_id', $cat);
        }
        if ($reg !== "todas") {
            $queryEventos->where('region_id', $reg);
        }
        $eventos = $queryEventos->orderBy('created_at', 'asc')->get();

        // Links — usan categoria_id
        $queryLinks = Link::with('region', 'categoria')->where('activo', 1);
        if ($cat !== "todas") {
            $queryLinks->where('categoria_id', $cat);
        }
        if ($reg !== "todas") {
            $queryLinks->where('region_id', $reg);
        }
        $links = $queryLinks->orderBy('orden', 'asc')->get();

        $categorias = Categoria::orderBy('nombre', 'asc')->get();
        $regiones   = Region::orderBy('nombre', 'asc')->get();

        return Inertia::render('Notificaciones/explorar', [
            'noticias'         => $noticias,
            'eventos'          => $eventos,
            'links'            => $links,
            'categorias'       => $categorias,
            'regiones'         => $regiones,
            'categoriaelegida' => ($cat === "todas") ? 0 : $cat,
        ]);
    }

    public function buscarnoticias($buscar,$cat,$reg)
    {
        $noticias = [];
        $eventos = [];
        $links = [];

        if($buscar=="noticias"){
            if($cat!="todas"){
                // Las noticias guardan categorías como JSON — buscamos por nombre de categoría
                $catNombre = Categoria::find($cat)?->nombre ?? '';
                if($reg!="todas"){
                    $noticias = Noticia::where('categorias', 'LIKE', '%"' . $catNombre . '"%')
                    ->where('region_id','=',$reg)
                    ->with('region')
                    ->with('categoria')
                    ->orderBy('created_at','asc')
                    ->get();
                }else{
                    $noticias = Noticia::where('categorias', 'LIKE', '%"' . $catNombre . '"%')
                    ->with('region')
                    ->with('categoria')
                    ->orderBy('created_at','asc')
                    ->get();
                }
            }else{
                if($reg!="todas"){
                    $noticias = Noticia::where('region_id','=',$reg)
                    ->with('region')
                    ->with('categoria')
                    ->orderBy('created_at','asc')
                    ->get();
                }else{
                    $noticias = Noticia::with('region')
                    ->with('categoria')
                    ->orderBy('created_at','asc')
                    ->get();
                }
            }
        }else{
            if($buscar=="eventos"){
                if($cat!="todas"){
                    if($reg!="todas"){
                        $eventos = Evento::where('categoria_id','=',$cat)
                        ->with('categoria')
                        ->where('region_id','=',$reg)
                        ->with('region')
                        ->orderBy('created_at','asc')
                        ->get();
                    }else{
                        $eventos = Evento::where('categoria_id','=',$cat)    
                        ->with('categoria')
                        ->with('region')
                        ->orderBy('created_at','asc')
                        ->get();
                    }
                }else{
                    if($reg!="todas"){
                        $eventos = Evento::where('region_id','=',$reg)
                        ->with('categoria')
                        ->with('region')
                        ->orderBy('created_at','asc')
                        ->get();
                    }else{
                        
                        $eventos = Evento::with('region')
                        ->with('categoria')
                        ->orderBy('created_at','asc')
                        ->get();
                    }
                }
            }else{
                    
                if($cat!="todas"){
                    if($reg!="todas"){
                        $links = Link::where('categoria_id','=',$cat)
                        ->with('categoria')
                        ->where('region_id','=',$reg)
                        ->with('region')
                        ->orderBy('created_at','asc')
                        ->get();
                    }else{
                        $links = Link::where('categoria_id','=',$cat)    
                        ->with('categoria')
                        ->with('region')
                        ->orderBy('created_at','asc')
                        ->get();
                    }
                }else{
                    if($reg!="todas"){
                        $links = Link::where('region_id','=',$reg)
                        ->with('categoria')
                        ->with('region')
                        ->orderBy('created_at','asc')
                        ->get();
                    }else{
                        
                        $links = Link::with('region')
                        ->with('categoria')
                        ->orderBy('created_at','asc')
                        ->get();
                    }
                }
            }
        }

        return response()->json(
            ['noticias' => $noticias,
            'eventos' => $eventos,
            'links' => $links
            ]);

        
    }
}
