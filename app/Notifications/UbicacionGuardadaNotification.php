<?php

namespace App\Notifications;

use App\Models\Noticia;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class UbicacionGuardadaNotification extends Notification
{
    use Queueable;

    public $noticia;

    public function __construct(Noticia $noticia)
    {
        $this->noticia = $noticia;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    // Lo que guardamos en la BD (usado por notificacionesIniciales)
    public function toDatabase($notifiable)
    {
        return [
            'tipo' => 'noticia',
            'mensaje' => " ha publicado: {$this->noticia->titulo}",
            'institucion_id' => $this->noticia->institucion->id,
            'noticia_id' => $this->noticia->id,
            'usuario' => [
                'id' => $this->noticia->institucion->user->id ?? null,
                'nombre' => $this->noticia->institucion->nombre ?? 'Institución',
                // usar el mismo nombre de archivo por defecto que espera el frontend
                'foto' => $this->noticia->institucion->foto_perfil
                    ? asset('storage/' . $this->noticia->institucion->foto_perfil)
                    : '/storage/profile-photos/default-avatar.webp',
            ],
            'created_at' => now()->toDateTimeString(),
        ];
    }

    // Lo que llega por broadcast (tiempo real)
    public function toBroadcast($notifiable)
    {
        $data = $this->toDatabase($notifiable); // Reutilizamos el mismo formato

        // Log para debugging (puedes eliminar luego)
        \Log::info('Broadcasting UbicacionGuardadaNotification', $data);

        return new BroadcastMessage($data);
    }

    // Opcional: toArray para consistencia si se usa en algún lugar
    public function toArray($notifiable)
    {
        return $this->toDatabase($notifiable);
    }

    // Nombre del evento en frontend (si escuchas .UbicacionGuardada)
    public function broadcastType()
    {
        return 'UbicacionGuardada';
    }
}
