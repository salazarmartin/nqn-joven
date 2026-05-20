<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Link extends Model
{
    use HasFactory;

    protected $table = 'links_interes';

    protected $fillable = [
        'titulo', 'descripcion', 'icono', 'url', 'activo', 'destacado', 'orden', 'region_id', 'categoria_id',
    ];

    protected $casts = [
        'activo'    => 'boolean',
        'destacado' => 'boolean',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

}

