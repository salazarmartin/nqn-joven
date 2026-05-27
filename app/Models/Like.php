<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class Like extends Model
{
    use HasFactory;

    protected $fillable = ['perf_persona_id', 'perf_institucion_id', 'target_id', 'target_tipo'];

    public function persona()
    {
        return $this->belongsTo(PerfPersona::class, 'perf_persona_id');
    }

    public function institucion()
    {
        return $this->belongsTo(PerfInstitucion::class, 'perf_institucion_id');
    }

    public function noticia()
    {
        return $this->belongsTo(Noticia::class, 'target_id');
    }

    public function evento()
    {
        return $this->belongsTo(Evento::class, 'target_id');
    }

    public function link()
    {
        return $this->belongsTo(Link::class, 'target_id');
    }

    public function comentario()
    {
        if($this->target_tipo == "noticia")
            return $this->belongsTo(ComentNoticia::class, 'target_id');
        if($this->target_tipo == "evento")
            return $this->belongsTo(ComentEvento::class, 'target_id');
        if($this->target_tipo == "link")
            return $this->belongsTo(ComentLink::class, 'target_id');
    }



    public function target()
    {
        return $this->morphTo(null, 'target_tipo', 'target_id');
    }

    /**
     * Obtener el autor del like (puede ser persona o institución)
     */
    public function autor()
    {
        if ($this->perf_persona_id) {
            return $this->persona();
        }
        return $this->institucion();
    }
}