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

    
    public function explorar($buscar,$cat,$reg)
    {
        $user = Auth::id();

        if($buscar=="noticias"){
            if($cat!="todas"){
                if($reg!="todas"){
                    $noticias = Noticia::join('noticiacategorias','noticias.id','=','noticiacategorias.noticia_id')
                    ->where('noticiacategorias.categoria_id','=',$cat)
                    ->where('region_id','=',$reg)
                    ->with('categoria')
                    ->with('region')
                    ->select('noticias.*')
                    ->orderBy('noticias.created_at','asc')
                    ->get();
                }else{
                    $noticias = Noticia::join('noticiacategorias','noticias.id','=','noticiacategorias.noticia_id')
                    ->where('noticiacategorias.categoria_id','=',$cat)    
                    ->with('region')
                    ->with('categoria')
                    ->select('noticias.*')
                    ->orderBy('noticias.created_at','asc')
                    ->get();
                }
            }else{
                if($reg!="todas"){
                    $noticias = Noticia::where('region_id','=',$reg)
                    ->with('region')
                    ->with('categoria')
                    ->orderBy('noticias.created_at','asc')
                    ->get();
                }else{
                    
                    $noticias = Noticia::with('region')
                    ->with('categoria')
                    ->orderBy('noticias.created_at','asc')
                    ->get();
                }
            }
        }
        
        $categorias = Categoria::orderBy('nombre','asc')->get();
        $regiones = Region::orderBy('nombre','asc')->get();

        return Inertia::render('Notificaciones/explorar', [
            'noticias' => $noticias,
            'categorias' => $categorias,
            'regiones' => $regiones,
            'categoriaelegida' => ($cat=="todas")? 0 : $cat,
            'auth' => [
                'user' => $user,
            ],
        ]);
        
    }

    public function buscarnoticias($buscar,$cat,$reg)
    {
        $noticias = [];
        $eventos = [];
        $links = [];

        if($buscar=="noticias"){
            if($cat!="todas"){
                if($reg!="todas"){
                    $noticias = Noticia::join('noticiacategorias','noticias.id','=','noticiacategorias.noticia_id')
                    ->where('noticiacategorias.categoria_id','=',$cat)
                    ->where('region_id','=',$reg)
                    ->with('region')
                    ->with('categoria')
                    ->select('noticias.*')
                    ->orderBy('noticias.created_at','asc')
                    ->get();
                }else{
                    $noticias = Noticia::join('noticiacategorias','noticias.id','=','noticiacategorias.noticia_id')
                    ->where('noticiacategorias.categoria_id','=',$cat)    
                    ->with('region')
                    ->with('categoria')
                    ->select('noticias.*')
                    ->orderBy('noticias.created_at','asc')
                    ->get();
                }
            }else{
                if($reg!="todas"){
                    $noticias = Noticia::where('region_id','=',$reg)
                    ->with('region')
                    ->with('categoria')
                    ->orderBy('noticias.created_at','asc')
                    ->get();
                }else{
                    
                    $noticias = Noticia::with('region')
                    ->with('categoria')
                    ->orderBy('noticias.created_at','asc')
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
