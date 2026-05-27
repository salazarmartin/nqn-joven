<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || $user->tipo_usuario !== 'admin' || $user->estado !== 'activo') {
            abort(403, 'Acceso denegado.');
        }

        return $next($request);
    }
}
