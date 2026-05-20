<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class NoticiaMedia extends Model
{
    use HasFactory;

    protected $table = 'noticia_media';

    protected $fillable = [
        'noticia_id',
        'tipo',   // 'imagen' | 'video' | 'documento'
        'url',    // ruta en storage
        'orden',
    ];

    // url publica
    protected $appends = ['url_publica'];

    public function noticia()
    {
        return $this->belongsTo(Noticia::class, 'noticia_id');
    }

    // accesor para obtener la URL publica (Storage::url)
    public function getUrlPublicaAttribute()
    {
        return $this->url ? Storage::url($this->url) : null;
    }
}
