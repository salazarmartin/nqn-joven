<?php

namespace App\Notifications;

use App\Models\ComentNoticia;
use Illuminate\Notifications\Notification;

class RespuestaComentarioNotification extends Notification
{
    public $respuesta;

    public function __construct($respuesta)
    {
        $this->respuesta = $respuesta;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        $usuario = $this->respuesta->persona->user 
                ?? $this->respuesta->institucion->user 
                ?? null;

        // Aplanar datos del usuario
        $usuarioArray = $usuario ? [
            'id' => $usuario->id,
            'nombre' => $usuario->nombre ?? $usuario->name,
            'foto' => $usuario->profile_photo_path
                ? asset('storage/' . $usuario->profile_photo_path)
                : '/storage/profile-photos/default-avatar.webp',
        ] : [
            'id' => null,
            'nombre' => 'Usuario desconocido',
            'foto' => '/storage/profile-photos/default-avatar.webp',
        ];

        if(get_class($this->respuesta) == "App\Models\ComentNoticia"){
            return [
                'comentario_id' => $this->respuesta->id,
                'noticia_id' => $this->respuesta->noticia_id,
                'contenido' => $this->respuesta->contenido,
                'usuario' => $usuarioArray, // <<-- usuario aplanado
                'tipo' => 'respuesta',
                'created_at' => $this->respuesta->created_at,
            ];
        }else{
            if(get_class($this->respuesta) == "App\Models\ComentEvento"){
                return [
                    'comentario_id' => $this->respuesta->id,
                    'evento_id' => $this->respuesta->evento_id,
                    'contenido' => $this->respuesta->contenido,
                    'usuario' => $usuarioArray, // <<-- usuario aplanado
                    'tipo' => 'respuesta',
                    'created_at' => $this->respuesta->created_at,
                ];
            }
        }
    }
}
