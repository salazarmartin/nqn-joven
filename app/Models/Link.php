<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Link extends Model
{
    use HasFactory;

    protected $table = 'links_interes';

    protected $fillable = [
        'titulo', 'descripcion', 'icono', 'imagen', 'url', 'activo', 'destacado', 'orden', 'region_id', 'categoria_id',
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

    
    public function likes()
    {
        return $this->hasMany(Like::class, 'target_id')
            ->where('target_tipo', 'link');
    }

    public function favoritos()
    {
        return $this->hasMany(Favorito::class, 'link_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comentarios()
    {
        return $this->hasMany(ComentLink::class);
    }

}

