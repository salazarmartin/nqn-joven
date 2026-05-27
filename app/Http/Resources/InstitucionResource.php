<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InstitucionResource extends JsonResource
{
    public function toArray($request)
    {
        if (!$this) return null;

        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'tipo_institucion' => $this->tipo_institucion,
            'razon_social' => $this->razon_social,
            'direccion' => $this->direccion,
            'email_contacto' => $this->email_contacto,
        ];
    }
}