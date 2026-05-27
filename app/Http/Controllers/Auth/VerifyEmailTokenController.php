<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class VerifyEmailTokenController extends Controller
{
    public function __invoke($token)
    {
        $user = User::where('email_verification_token', $token)->first();

        if (!$user) {
            return redirect()->route('login')
                ->with('status', 'El enlace de verificación no es válido o ya fue utilizado.');
        }

        $user->email_verified_at        = now();
        $user->email_verification_token = null;
        $user->estado                   = 'pendiente_datos';
        $user->save();

        // Refrescar usuario en sesión para que el middleware lea el estado actualizado
        Auth::login($user->fresh());

        return redirect()->route('completar.datos', ['type' => $user->tipo_usuario]);
    }
}
