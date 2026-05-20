<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Estudio extends Model
{
    use HasFactory;

    protected $table = 'estudios';

    
    public function persona()
    {
        return $this->hasOne(Perfpersona::class);
    }

}

