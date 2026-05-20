<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Noticia extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'noticias';

    protected $fillable = [
        'perf_institucion_id',
        'admin_id',
        'titulo',
        'contenido',
        'resumen',
        'imagen',
        'link_externo',
        'publicado',
        'destacado',
        'categorias',
        'categoria_id',
        'region_id',
    ];

    protected $casts = [
        'categorias' => 'array',
        'publicado'  => 'boolean',
        'destacado'  => 'boolean',
    ];

    public function institucion()
    {
        return $this->belongsTo(PerfInstitucion::class, 'perf_institucion_id');
    }
    
    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function comentarios()
    {
        return $this->hasMany(ComentNoticia::class);
    }

    public function media()
    {
        return $this->hasMany(NoticiaMedia::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'target_id')
            ->where('target_tipo', 'noticia');
    }

    public function favoritos()
    {
        return $this->hasMany(Favorito::class, 'noticia_id');
    }

    public function getNombreInstitucionAttribute()
    {
        return $this->institucion?->nombre ?? 'Institución desconocida';
    }

    // Scope para noticias publicadas
    public function scopePublicadas($query)
    {
        return $query->where('publicado', true);
    }

    // Scope para ordenar por más recientes
    public function scopeRecientes($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopePorIntereses($query, array $interesesUsuario)
    {
        if (empty($interesesUsuario)) {
            return $query;
        }

        return $query->whereNotNull('categorias')
            ->where(function ($q) use ($interesesUsuario) {
                foreach ($interesesUsuario as $interes) {
                    $q->orWhere('categorias', 'LIKE', '%' . $interes . '%');
                }
            });
    }

    // Accessor: Convierte JSON string a array al leer
    public function getCategoriasAttribute($value)
    {
        if (is_null($value)) {
            return [];
        }

        if (is_array($value)) {
            return $value;
        }

        $decoded = json_decode($value, true);
        return is_array($decoded) ? $decoded : [];
    }

    // Mutator: Convierte array a JSON string al guardar
    public function setCategoriasAttribute($value)
    {
        if (is_null($value)) {
            $this->attributes['categorias'] = json_encode([]);
        } elseif (is_array($value)) {
            $this->attributes['categorias'] = json_encode($value);
        } else {
            $this->attributes['categorias'] = $value;
        }
    }

    public function user()
    {
        // Si la noticia pertenece a una institución
        if ($this->perf_institucion_id) {
            return $this->institucion?->user;
        }

        // Si la noticia pertenece a un admin
        if ($this->admin_id) {
            return $this->institucion?->user;
        }

        return null;
    }
    public function ownerUser()
    {
        return $this->institucion?->user ?? null;
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function esNovedad(): bool
    {
        return is_null($this->perf_institucion_id) && !is_null($this->admin_id);
    }
}
