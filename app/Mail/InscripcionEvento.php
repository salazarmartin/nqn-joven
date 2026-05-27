<?php

namespace App\Mail;

use App\Models\Evento;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InscripcionEvento extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $evento;

    public function __construct(User $user, Evento $evento)
    {
        $this->user  = $user;
        $this->evento = $evento;
    }

    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
        return $this->subject('✅ Inscripción confirmada: ' . $this->evento->titulo)
                    ->view('emails.inscripcion-evento')
                    ->with([
                        'nombre'      => $this->user->nombre,
                        'eventoTitulo' => $this->evento->titulo,
                        'eventoFecha' => $this->evento->fecha?->format('d/m/Y'),
                        'eventoHora'  => $this->evento->hora ? substr($this->evento->hora, 0, 5) . ' hs' : null,
                        'eventoLugar' => $this->evento->lugar,
                        'eventoUrl'   => config('app.url') . '/eventos/' . $this->evento->id,
                    ]);
    }
}
