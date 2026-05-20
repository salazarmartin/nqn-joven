<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Evento extends Model
{
    use HasFactory;

    protected $table = 'eventos';

    protected $fillable = [
        'titulo', 'descripcion', 'imagen', 'lugar', 'fecha', 'hora',
        'publicado', 'destacado', 'link_externo', 'modalidad', 'region_id', 'categoria_id', 'admin_id',
    ];

    protected $casts = [
        'fecha'      => 'date',
        'publicado'  => 'boolean',
        'destacado'  => 'boolean',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'target_id')
            ->where('target_tipo', 'evento');
    }

    public function favoritos()
    {
        return $this->hasMany(Favorito::class, 'evento_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comentarios()
    {
        return $this->hasMany(ComentEvento::class);
    }


    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

}

