<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['persona', 'institucion'])
            ->withCount(['persona as es_persona'])
            ->when($request->filled('buscar'), fn($q) =>
                $q->where(fn($sub) =>
                    $sub->where('nombre', 'like', '%' . $request->buscar . '%')
                        ->orWhere('email', 'like', '%' . $request->buscar . '%')
                ))
            ->when($request->filled('tipo'), fn($q) =>
                $q->where('tipo_usuario', $request->tipo)
            )
            ->when($request->filled('estado'), fn($q) =>
                $q->where('estado', $request->estado)
            );

        $usuarios = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Usuarios/Index', [
            'usuarios' => $usuarios,
            'filtros'  => $request->only('buscar', 'tipo', 'estado'),
            'totales'  => [
                'total'        => User::count(),
                'personas'     => User::where('tipo_usuario', 'persona')->count(),
                'instituciones' => User::where('tipo_usuario', 'institucion')->count(),
                'pendientes'   => User::where('estado', 'pendiente_aprobacion')->count(),
                'inactivos'    => User::where('estado', 'inactivo')->count(),
            ],
        ]);
    }

    public function show(User $usuario)
    {
        $usuario->load(['persona.region', 'institucion.region']);

        return Inertia::render('Admin/Usuarios/Show', [
            'usuario' => $usuario,
        ]);
    }

    public function updateEstado(Request $request, User $usuario)
    {
        $request->validate([
            'estado' => 'required|in:activo,inactivo,pendiente_verif,pendiente_datos,pendiente_aprobacion',
        ]);

        $usuario->update(['estado' => $request->estado]);

        return back()->with('message', 'Estado actualizado a "' . $request->estado . '".');
    }

    public function verificarInstitucion(User $usuario)
    {
        if ($usuario->tipo_usuario !== 'institucion' || !$usuario->institucion) {
            return back()->with('error', 'El usuario no es una institución.');
        }

        $usuario->institucion->update(['verificado' => true]);
        $usuario->update(['estado' => 'activo']);

        return back()->with('message', 'Institución verificada y cuenta activada.');
    }

    public function destroy(User $usuario)
    {
        if ($usuario->id === auth()->id()) {
            return back()->with('error', 'No podés eliminar tu propia cuenta.');
        }

        $usuario->delete();

        return redirect()->route('admin.usuarios.index')
            ->with('message', 'Usuario eliminado correctamente.');
    }
}
