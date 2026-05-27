<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PersonaResource extends JsonResource
{
    public function toArray($request)
    {
        if (!$this) return null;

        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'dni' => $this->dni,
            'fecha_nac' => $this->fecha_nac,
            'trabaja_emprende' => $this->trabaja_emprende,
            'estudio' => $this->estudio
                ? $this->estudio->only(['id','nombre'])
                : null,
        ];
    }
}