<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Noticia;
use App\Models\Region;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicacionAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = Noticia::with(['institucion.user', 'admin', 'media'])
            ->withCount(['likes', 'comentarios']);

        if ($request->filled('buscar')) {
            $query->where(function ($q) use ($request) {
                $q->where('titulo', 'like', '%' . $request->buscar . '%')
                  ->orWhere('contenido', 'like', '%' . $request->buscar . '%');
            });
        }

        if ($request->filled('publicado')) {
            $query->where('publicado', $request->publicado === '1');
        }

        if ($request->filled('tipo')) {
            if ($request->tipo === 'novedad') {
                $query->whereNull('perf_institucion_id')->whereNotNull('admin_id');
            } elseif ($request->tipo === 'institucion') {
                $query->whereNotNull('perf_institucion_id');
            }
        }

        $noticias = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Publicaciones/Index', [
            'noticias' => $noticias,
            'filtros'       => $request->only('buscar', 'publicado', 'tipo'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Publicaciones/Form', [
            'regiones'   => Region::orderBy('nombre')->get(),
            'categorias' => Categoria::orderBy('nombre')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titulo'       => 'required|string|max:255',
            'contenido'    => 'required|string',
            'resumen'      => 'nullable|string|max:500',
            'link_externo' => 'nullable|url|max:255',
            'publicado'    => 'boolean',
            'destacado'    => 'boolean',
            'region_id'    => 'nullable|exists:regiones,id',
            'categoria_id' => 'nullable|exists:categorias,id',
            'imagen'       => 'nullable|image|max:3072',
        ]);

        if ($request->hasFile('imagen')) {
            $data['imagen'] = $request->file('imagen')->store('noticias', 'public');
        } else {
            unset($data['imagen']);
        }

        $data['admin_id']           = $request->user()->id;
        $data['perf_institucion_id'] = null;

        $noticia = Noticia::create($data);

        return redirect()->route('admin.noticias.index')
            ->with('message', 'Novedad creada correctamente.');
    }

    public function edit(Noticia $noticia)
    {
        return Inertia::render('Admin/Publicaciones/Form', [
            'noticia' => $noticia,
            'regiones'    => Region::orderBy('nombre')->get(),
            'categorias'  => Categoria::orderBy('nombre')->get(),
        ]);
    }

    public function update(Request $request, Noticia $noticia)
    {
        $data = $request->validate([
            'titulo'        => 'required|string|max:255',
            'contenido'     => 'required|string',
            'resumen'       => 'nullable|string|max:500',
            'link_externo'  => 'nullable|url|max:255',
            'publicado'     => 'boolean',
            'destacado'     => 'boolean',
            'region_id'     => 'nullable|exists:regiones,id',
            'categoria_id'  => 'nullable|exists:categorias,id',
            'imagen'        => 'nullable|image|max:3072',
            'remove_imagen' => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            if ($noticia->imagen) {
                Storage::disk('public')->delete($noticia->imagen);
            }
            $data['imagen'] = $request->file('imagen')->store('noticias', 'public');
        } elseif (!empty($data['remove_imagen'])) {
            if ($noticia->imagen) {
                Storage::disk('public')->delete($noticia->imagen);
            }
            $data['imagen'] = null;
        } else {
            unset($data['imagen']);
        }

        unset($data['remove_imagen']);
        $noticia->update($data);

        return redirect()->route('admin.noticias.index')
            ->with('message', 'Novedad actualizada correctamente.');
    }

    public function togglePublicado(Noticia $noticia)
    {
        $noticia->update(['publicado' => !$noticia->publicado]);

        return back()->with('message', 'Estado actualizado.');
    }

    public function toggleDestacado(Noticia $noticia)
    {
        $noticia->update(['destacado' => !$noticia->destacado]);

        return back()->with('message', 'Noticia ' . ($noticia->destacado ? 'destacada' : 'sin destacar') . '.');
    }

    public function destroy(Noticia $noticia)
    {
        if ($noticia->imagen) {
            Storage::disk('public')->delete($noticia->imagen);
        }
        $noticia->delete();

        return back()->with('message', 'Noticia eliminada.');
    }
}
