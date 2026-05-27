<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RegionResource extends JsonResource
{
    public function toArray($request)
    {
        if (!$this) return null;

        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
        ];
    }
}