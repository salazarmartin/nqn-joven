<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categorias';

    /*protected $fillable = ['chat_id', 'emisor_id', 'contenido', 'leido_en', 'leido'];

    protected $casts = [
        'leido' => 'boolean',
    ];
    */
    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    public function emisor()
    {
        return $this->belongsTo(User::class, 'emisor_id');
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

}

