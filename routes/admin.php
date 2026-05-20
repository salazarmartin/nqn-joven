<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EventoController;
use App\Http\Controllers\Admin\LinkController;
use App\Http\Controllers\Admin\PublicacionAdminController;
use App\Http\Controllers\Admin\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->middleware(['auth', 'admin'])
    ->name('admin.')
    ->group(function () {

        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Eventos
        Route::get('/eventos', [EventoController::class, 'index'])->name('eventos.index');
        Route::get('/eventos/crear', [EventoController::class, 'create'])->name('eventos.create');
        Route::post('/eventos', [EventoController::class, 'store'])->name('eventos.store');
        Route::get('/eventos/{evento}/editar', [EventoController::class, 'edit'])->name('eventos.edit');
        Route::put('/eventos/{evento}', [EventoController::class, 'update'])->name('eventos.update');
        Route::delete('/eventos/{evento}', [EventoController::class, 'destroy'])->name('eventos.destroy');

        // Links
        Route::get('/links', [LinkController::class, 'index'])->name('links.index');
        Route::get('/links/crear', [LinkController::class, 'create'])->name('links.create');
        Route::post('/links', [LinkController::class, 'store'])->name('links.store');
        Route::get('/links/{link}/editar', [LinkController::class, 'edit'])->name('links.edit');
        Route::put('/links/{link}', [LinkController::class, 'update'])->name('links.update');
        Route::delete('/links/{link}', [LinkController::class, 'destroy'])->name('links.destroy');

        // Usuarios
        Route::get('/usuarios', [UsuarioController::class, 'index'])->name('usuarios.index');
        Route::get('/usuarios/{usuario}', [UsuarioController::class, 'show'])->name('usuarios.show');
        Route::patch('/usuarios/{usuario}/estado', [UsuarioController::class, 'updateEstado'])->name('usuarios.estado');
        Route::patch('/usuarios/{usuario}/verificar', [UsuarioController::class, 'verificarInstitucion'])->name('usuarios.verificar');
        Route::delete('/usuarios/{usuario}', [UsuarioController::class, 'destroy'])->name('usuarios.destroy');

        // Publicaciones / Novedades
        Route::get('/noticias', [PublicacionAdminController::class, 'index'])->name('noticias.index');
        Route::get('/noticias/crear', [PublicacionAdminController::class, 'create'])->name('noticias.create');
        Route::post('/noticias', [PublicacionAdminController::class, 'store'])->name('noticias.store');
        Route::get('/noticias/{noticia}/editar', [PublicacionAdminController::class, 'edit'])->name('noticias.edit');
        Route::put('/noticias/{noticia}', [PublicacionAdminController::class, 'update'])->name('noticias.update');
        Route::patch('/noticias/{noticia}/toggle-publicado', [PublicacionAdminController::class, 'togglePublicado'])->name('noticias.toggle-publicado');
        Route::patch('/noticias/{noticia}/toggle-destacado', [PublicacionAdminController::class, 'toggleDestacado'])->name('noticias.toggle-destacado');
        Route::delete('/noticias/{noticia}', [PublicacionAdminController::class, 'destroy'])->name('noticias.destroy');
    });
