<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use App\Models\Region;
use App\Models\Ciudad;
use App\Models\Provincia;
use App\Models\Estudio;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        $regiones = Region::orderBy('nombre','asc')->get();
        $estudios = Estudio::orderBy('nombre','asc')->get();
        $ciudades = Ciudad::orderBy('nombre','asc')->get();
        $provincias = Provincia::orderBy('nombre','asc')->get();
        

        // Si ya verificó el email
        if ($user->hasVerifiedEmail()) {
            // Redirigir según el estado actual
            if ($user->estado === 'pendiente_datos') {
                return redirect()->route('completar.datos', ['type' => $user->tipo_usuario, 'regiones' => $regiones, 'ciudades' => $ciudades, 'provincias' => $provincias, 'estudios'=>$estudios]);
            }

            if ($user->estado === 'pendiente_aprobacion') {
                return redirect()->route('institucion.pendiente');
            }

            return redirect()->route('inicio')->with('verified', true);
        }

        // Marcar email como verificado
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));

            // Cambiar estado a 'pendiente_datos'
            $user->estado = 'pendiente_datos';
            $user->save();
        }

        // Redirigir a completar datos
        return redirect()->route('completar.datos', ['type' => $user->tipo_usuario, 'regiones' => $regiones, 'ciudades' => $ciudades, 'provincias' => $provincias, 'estudios'=>$estudios])
            ->with('success', '¡Email verificado! Ahora completá tus datos.');
    }
}
