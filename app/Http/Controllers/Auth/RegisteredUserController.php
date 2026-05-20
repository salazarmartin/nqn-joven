<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $existe = User::where('email','=',$request->email)->get();
        if(count($existe)>0){
            if($existe[0]->deleted_at){
                
            }else{
                return redirect()->route('register');
            }
        }
        
        $request->validate([
            'email' => 'required|string|lowercase|email|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'tipo_usuario' => 'required|in:persona,institucion'
        ]);

        // Crear usuario con datos minimos
        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tipo_usuario' => $request->tipo_usuario,
            'estado' => 'pendiente_verif',
            'nombre' => ' ',
            'telefono' => ' ',
            'ciudad' => ' ',
            'provincia' => ' ',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('verification.notice');
    }

    public function chequearemail($email){
        
        $existe = User::where('email','=',$email)->get();
        if(count($existe)>0){
            if($existe[0]->deleted_at){
                return response()->json(['sepuede' => true]);
            }else{
                return response()->json(['sepuede' => false]);
            }
        }
        return response()->json(['sepuede' => true]);
    }
}
