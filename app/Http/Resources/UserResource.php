<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'email' => $this->email,
            'estado' => $this->estado,
            'tipo_usuario' => $this->tipo_usuario,
            'provincia' => $this->provincia,
            'ciudad' => $this->ciudad,
            'profile_photo_url' => $this->profile_photo_url,

            // Persona (solo si existe y está cargada)
            'persona' => $this->whenLoaded('persona', function () {
                return $this->persona ? [
                    'apellido' => $this->persona->apellido,
                    'dni' => $this->persona->dni,
                    'trabaja_emprende' => $this->persona->trabaja_emprende,
                    'fecha_nac' => $this->persona->fecha_nac,
                    'estudio' => $this->persona->estudio
                        ? $this->persona->estudio->only(['id','nombre'])
                        : null,
                ] : null;
            }),

            // Institución (solo si existe y está cargada)
            'institucion' => $this->whenLoaded('institucion', function () {
                return $this->institucion ? [
                    'id' => $this->institucion->id,
                    'nombre' => $this->institucion->nombre,
                    'tipo_institucion' => $this->institucion->tipo_institucion,
                    'razon_social' => $this->institucion->razon_social,
                    'direccion' => $this->institucion->direccion,
                    'email_contacto' => $this->institucion->email_contacto,
                ] : null;
            }),
        ];
    }
}