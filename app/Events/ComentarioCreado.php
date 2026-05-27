<?php

namespace App\Events;

use App\Models\ComentNoticia;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Notifications\ComentarioCreadoNotification;
use Illuminate\Support\Facades\Notification;

class ComentarioCreado implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $comentario;
    public $receptorId;

    public function __construct($comentario)
    {
        $this->comentario = $comentario;
        $this->receptorId = null;
        
        if(get_class($comentario) == "App\Models\ComentNoticia"){
            $id = $comentario->noticia->admin_id;
        }else{
            if(get_class($comentario) == "App\Models\ComentEvento"){
               $id = $comentario->evento->admin_id;
            }
        }
        if($id){
            $dueno = User::where('id','=',$id)->get();
            if(count($dueno)>0)
                $this->receptorId = $dueno[0];
        }

         $usuarioQueComento = $comentario->persona->user;
    
        if ($usuarioQueComento && $usuarioQueComento->id !== $this->receptorId) {
            $receptor = $this->receptorId;
            $receptor->notify(new ComentarioCreadoNotification($comentario));
        }
    }

    public function broadcastOn()
    {
        return [
            new PrivateChannel('user.' . $this->receptorId),
        ];
    }

    public function broadcastAs()
    {
        return 'ComentarioCreado';
    }

    public function broadcastWith()
    {
        $this->comentario->load([
            'persona.user',
            'institucion.user',
        ]);

        // Determinar el usuario que hizo el comentario
        $usuario = $this->comentario->persona->user;

        // Foto del usuario (misma lógica que en toDatabase)
        $usuario_foto = $usuario && $usuario->profile_photo_path
            ? asset('storage/' . $usuario->profile_photo_path)
            : ('/storage/profile-photos/default-avatar.webp');

        
        if(get_class($comentario) == "App\Models\ComentNoticia"){    
            return [
                'comentario' => [
                    'id' => $this->comentario->id,
                    'contenido' => $this->comentario->contenido,
                    'noticia_id' => $this->comentario->noticia_id,

                    'usuario' => [
                        'id' => $usuario->id ?? null,
                        'name' => $usuario->nombre ?? $usuario->name ?? 'Sin nombre',
                        'foto' => $usuario_foto, 
                    ],

                    'created_at' => $this->comentario->created_at,
                ],
            ];
        }else{
            if(get_class($this->comentario) == "App\Models\ComentEvento"){    
                return [
                    'comentario' => [
                        'id' => $this->comentario->id,
                        'contenido' => $this->comentario->contenido,
                        'evento_id' => $this->comentario->evento_id,

                        'usuario' => [
                            'id' => $usuario->id ?? null,
                            'name' => $usuario->nombre ?? $usuario->name ?? 'Sin nombre',
                            'foto' => $usuario_foto, 
                        ],

                        'created_at' => $this->comentario->created_at,
                    ],
                ];
            }
        }
    }


}
