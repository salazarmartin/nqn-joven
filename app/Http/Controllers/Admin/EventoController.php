<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Evento;
use App\Models\EventoInscripcion;
use App\Models\Region;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EventoController extends Controller
{
    public function index()
    {
        $eventos = Evento::with(['region', 'categoria'])
            ->orderByDesc('fecha')
            ->paginate(15);

        return Inertia::render('Admin/Eventos/Index', [
            'eventos' => $eventos,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Eventos/Form', [
            'regiones'   => Region::orderBy('nombre')->get(),
            'categorias' => Categoria::orderBy('nombre')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titulo'                   => 'required|string|max:255',
            'descripcion'              => 'nullable|string',
            'lugar'                    => 'required|string|max:255',
            'fecha'                    => 'required|date',
            'hora'                     => 'required|string',
            'modalidad'                => 'required|in:presencial,virtual,hibrida',
            'link_externo'             => 'nullable|url|max:255',
            'publicado'                => 'boolean',
            'destacado'                => 'boolean',
            'region_id'                => 'nullable|exists:regiones,id',
            'categoria_id'             => 'nullable|exists:categorias,id',
            'imagen'                   => 'nullable|image|max:2048',
            'inscripcion_habilitada'   => 'boolean',
            'cupos'                    => 'nullable|integer|min:1',
            'fecha_inicio_inscripcion' => 'nullable|date',
            'fecha_fin_inscripcion'    => 'nullable|date|after_or_equal:fecha_inicio_inscripcion',
        ]);

        if ($request->hasFile('imagen')) {
            $data['imagen'] = $request->file('imagen')->store('eventos', 'public');
        }

        $data['admin_id'] = $request->user()->id;

        Evento::create($data);

        return redirect()->route('admin.eventos.index')
            ->with('message', 'Evento creado correctamente.');
    }

    public function edit(Evento $evento)
    {
        return Inertia::render('Admin/Eventos/Form', [
            'evento'     => $evento,
            'regiones'   => Region::orderBy('nombre')->get(),
            'categorias' => Categoria::orderBy('nombre')->get(),
        ]);
    }

    public function update(Request $request, Evento $evento)
    {
        $data = $request->validate([
            'titulo'                   => 'required|string|max:255',
            'descripcion'              => 'nullable|string',
            'lugar'                    => 'required|string|max:255',
            'fecha'                    => 'required|date',
            'hora'                     => 'required|string',
            'modalidad'                => 'required|in:presencial,virtual,hibrida',
            'link_externo'             => 'nullable|url|max:255',
            'publicado'                => 'boolean',
            'destacado'                => 'boolean',
            'region_id'                => 'nullable|exists:regiones,id',
            'categoria_id'             => 'nullable|exists:categorias,id',
            'imagen'                   => 'nullable|image|max:2048',
            'remove_imagen'            => 'boolean',
            'inscripcion_habilitada'   => 'boolean',
            'cupos'                    => 'nullable|integer|min:1',
            'fecha_inicio_inscripcion' => 'nullable|date',
            'fecha_fin_inscripcion'    => 'nullable|date|after_or_equal:fecha_inicio_inscripcion',
        ]);

        if ($request->hasFile('imagen')) {
            if ($evento->imagen) {
                Storage::disk('public')->delete($evento->imagen);
            }
            $data['imagen'] = $request->file('imagen')->store('eventos', 'public');
        } elseif (!empty($data['remove_imagen'])) {
            if ($evento->imagen) {
                Storage::disk('public')->delete($evento->imagen);
            }
            $data['imagen'] = null;
        } else {
            unset($data['imagen']);
        }

        unset($data['remove_imagen']);
        $evento->update($data);

        return redirect()->route('admin.eventos.index')
            ->with('message', 'Evento actualizado correctamente.');
    }

    public function destroy(Evento $evento)
    {
        if ($evento->imagen) {
            Storage::disk('public')->delete($evento->imagen);
        }
        $evento->delete();

        return redirect()->route('admin.eventos.index')
            ->with('message', 'Evento eliminado correctamente.');
    }

    public function inscriptos(Evento $evento)
    {
        $inscriptos = EventoInscripcion::where('evento_id', $evento->id)
            ->with(['user.persona'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($ins) {
                return [
                    'id'         => $ins->id,
                    'nombre'     => $ins->user->nombre,
                    'apellido'   => $ins->user->persona?->apellido,
                    'email'      => $ins->user->email,
                    'dni'        => $ins->user->persona?->dni,
                    'provincia'  => $ins->user->provincia,
                    'created_at' => $ins->created_at->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('Admin/Eventos/Inscriptos', [
            'evento'     => $evento,
            'inscriptos' => $inscriptos,
            'total'      => $inscriptos->count(),
        ]);
    }
}
