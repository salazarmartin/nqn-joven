<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Region extends Model
{
    use HasFactory;

    protected $table = 'regiones';

    public function persona()
    {
        return $this->hasOne(Perfpersona::class);
    }

    public function noticia()
    {
        return $this->hasOne(Noticia::class);
    }

    public function evento()
    {
        return $this->hasOne(Evento::class);
    }

    public function link()
    {
        return $this->hasOne(Link::class);
    }

    public function institucion()
    {
        return $this->hasOne(PerfInstitucion::class);
    }

    public function ciudad()
    {
        return $this->hasOne(Ciudad::class);
    }
}

