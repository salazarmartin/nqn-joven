<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InterestResource extends JsonResource
{
    public function toArray($request)
    {
        // $this es un string del JSON
        return [
            'id' => null, // no hay id porque no es un modelo
            'nombre' => (string) $this->resource,
        ];
    }
}