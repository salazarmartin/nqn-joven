<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Link;
use App\Models\Region;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LinkController extends Controller
{
    public function index()
    {
        $links = Link::with(['region', 'categoria'])
            ->orderBy('orden')
            ->paginate(15);

        return Inertia::render('Admin/Links/Index', [
            'links' => $links,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Links/Form', [
            'regiones'   => Region::orderBy('nombre')->get(),
            'categorias' => Categoria::orderBy('nombre')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titulo'       => 'required|string|max:255',
            'descripcion'  => 'nullable|string',
            'url'          => 'required|url|max:255',
            'icono'        => 'nullable|string|max:100',
            'imagen'       => 'nullable|image|max:2048',
            'activo'       => 'boolean',
            'destacado'    => 'boolean',
            'orden'        => 'integer|min:0',
            'region_id'    => 'nullable|exists:regiones,id',
            'categoria_id' => 'nullable|exists:categorias,id',
        ]);

        if ($request->hasFile('imagen')) {
            $data['imagen'] = $request->file('imagen')->store('links', 'public');
        }

        Link::create($data);

        return redirect()->route('admin.links.index')
            ->with('message', 'Link creado correctamente.');
    }

    public function edit(Link $link)
    {
        return Inertia::render('Admin/Links/Form', [
            'link'       => $link,
            'regiones'   => Region::orderBy('nombre')->get(),
            'categorias' => Categoria::orderBy('nombre')->get(),
        ]);
    }

    public function update(Request $request, Link $link)
    {
        $data = $request->validate([
            'titulo'       => 'required|string|max:255',
            'descripcion'  => 'nullable|string',
            'url'          => 'required|url|max:255',
            'icono'        => 'nullable|string|max:100',
            'imagen'       => 'nullable|image|max:2048',
            'activo'       => 'boolean',
            'destacado'    => 'boolean',
            'orden'        => 'integer|min:0',
            'region_id'    => 'nullable|exists:regiones,id',
            'categoria_id' => 'nullable|exists:categorias,id',
        ]);

        if ($request->hasFile('imagen')) {
            if ($link->imagen) {
                Storage::disk('public')->delete($link->imagen);
            }
            $data['imagen'] = $request->file('imagen')->store('links', 'public');
        } else {
            unset($data['imagen']);
        }

        $link->update($data);

        return redirect()->route('admin.links.index')
            ->with('message', 'Link actualizado correctamente.');
    }

    public function destroy(Link $link)
    {
        $link->delete();

        return redirect()->route('admin.links.index')
            ->with('message', 'Link eliminado correctamente.');
    }
}
