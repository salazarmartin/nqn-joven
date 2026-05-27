<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventoInscripcion extends Model
{
    protected $table = 'evento_inscripciones';

    protected $fillable = ['evento_id', 'user_id'];

    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
