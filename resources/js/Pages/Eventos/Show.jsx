import { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Calendar, MapPin} from "lucide-react";

import {
    Send,
    ChevronLeft,
    ChevronRight,
    Download,
    X,
    FileText,
} from "lucide-react";
import EventoActions from "@/Components/Publicacion/EventoActions";
import ComentarioItem from "@/Components/Publicacion/ComentarioItem";
import toast from "react-hot-toast";
import axios from "axios";

export function DateDisplay({fechaEntrada}) {
  
    const fecha = new Date(fechaEntrada.replace(" ", "T"));

    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();

    return dia+'/'+mes+'/'+año;
}

export default function Show({ auth, adminevento, evento, userType }) {
console.log(adminevento)    ;
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const media = "";
    const imagenPortada = evento.imagen
        ? `/storage/${evento.imagen}`
        : null;


    const isOwner =
        userType === "institucion" &&
        auth.user.institucion?.id === evento.perf_institucion_id;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={evento.titulo} />

            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {imagenPortada && (
                        <div className="rounded-2xl overflow-hidden mb-5 shadow-md">
                            <img
                                src={imagenPortada}
                                alt="imagen"
                                className="w-full max-h-80 object-cover"
                            />
                        </div>
                    )}
                    
                    {media != "" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* IZQUIERDA - Slider */}
                            <div className="bg-white rounded-3xl border border-gray-700 overflow-hidden h-[450px]">
                                <div className="relative bg-black h-full flex items-center justify-center">
                                    

                                    <img src={media} alt="" />
                                </div>
                            </div>

                            {/* DERECHA - info */}
                            <EventoInfo
                                evento={evento}
                                adminevento={adminevento}
                                
                                
                                
                            />
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-full max-w-6xl">
                                <EventoInfo
                                    adminevento={adminevento}
                                    evento={evento}
                                    
                                />
                            </div>
                        </div>
                    )}

                    
                </div>
            </div>

            {/* MODAL FULLSCREEN */}
            {showFullscreen && imagenPortada && (
                <FullscreenModal
                    allMedia={media}
                    initialIndex={media}
                    onClose={() => setShowFullscreen(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}

/* ----------------------------- COMPONENTES ----------------------------- */

function EventoInfo({
    evento,
    adminevento
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between h-full transition-colors">
            <div>
                <div className="flex items-center space-x-3 mb-4">
                    <img
                        src={adminevento.profile_photo_url}
                        alt=""
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                            {adminevento.nombre}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(
                                evento.created_at
                            ).toLocaleDateString("es-AR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {evento.titulo}
                </h1>
                <p className="text-md font-bold text-gray-900 dark:text-white mb-3 flex gap-1 mt-0.5">
                
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-300 flex-shrink-0 mt-0.5" /> 
                    {evento.lugar}
                    
                </p>
                <p className="text-md font-bold text-gray-900 dark:text-white mb-3 flex gap-1 mt-0.5">
                    <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-300 flex-shrink-0 mt-0.5" />
                    <DateDisplay fechaEntrada={evento.fecha}/> - {evento.hora} hs
                    
                </p>
                
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed mb-4 max-h-[240px] overflow-y-auto pr-2 custom-scroll">
                    {evento.descripcion}
                </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700">
                <EventoActions
                    isLiked={isLiked}
                    likesCount={likesCount}
                    onLike={handleLike}
                    canLike={canLike}
                    comentariosCount={comentarios.length}
                    isFavorite={isFavorite}
                    onFavorite={handleFavorite}
                    canFavorite={canFavorite}
                    eventoId={evento.id}
                    layout="spaced"
                    size="default"
                />
            </div>
        </div>
    );
}


function FullscreenModal({ allMedia, initialIndex, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef(null);

    const currentMedia = allMedia;
    const hasMultiple = false;

    // Manejar tecla ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    
    
    const togglePlayPause = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        if (!videoRef.current || !duration) return;

        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = Math.max(0, Math.min(pos * duration, duration));

        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e) => {
        e.stopPropagation();
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Header con controles superiores */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-20">
                <div className="flex items-center justify-between">
                    {/* Botones de navegación */}
                    <div className="flex items-center space-x-2">
                        {hasMultiple && (
                            <>
                                <button
                                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition backdrop-blur-sm"
                                    onClick={handlePrevious}
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition backdrop-blur-sm"
                                    onClick={handleNext}
                                    aria-label="Siguiente"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>


                    {/* Botón cerrar */}
                    <button
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition backdrop-blur-sm"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex items-center justify-center p-4 pt-20 pb-24">
                
                    <img
                        src={currentMedia}
                        alt="Vista completa"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                
                {currentMedia.tipo === "video" && (
                    <div className="relative max-w-full max-h-full">
                        <video
                            key={currentMedia.id || currentIndex}
                            ref={videoRef}
                            src={currentMedia.url_publica}
                            autoPlay
                            className="max-w-full max-h-[calc(100vh-200px)] object-contain rounded-lg shadow-2xl"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                        >
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                )}

                {currentMedia.tipo === "documento" && (
                    <div className="bg-gray-900 rounded-lg p-12 text-center">
                        <FileText className="w-32 h-32 text-gray-400 mx-auto mb-6" />
                        <p className="text-white text-xl mb-6">
                            {currentMedia.url?.split("/").pop() || "Documento"}
                        </p>
                        <a
                            href={currentMedia.url_publica}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg"
                        >
                            <Download className="w-6 h-6 mr-3" />
                            Descargar documento
                        </a>
                    </div>
                )}
            </div>

            {/* Controles de video personalizados - solo para videos */}
            {currentMedia.tipo === "video" && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 z-20">
                    {/* Barra de progreso */}
                    <div
                        className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer group"
                        onClick={handleSeek}
                    >
                        <div
                            className="h-full bg-blue-500 rounded-full relative group-hover:bg-blue-400 transition"
                            style={{
                                width: `${
                                    duration
                                        ? (currentTime / duration) * 100
                                        : 0
                                }%`,
                            }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition"></div>
                        </div>
                    </div>

                    {/* Controles inferiores */}
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-3">
                            {/* Play/Pause */}
                            <button
                                className="hover:bg-white/10 p-2 rounded-full transition"
                                onClick={togglePlayPause}
                            >
                                {isPlaying ? (
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>

                            {/* Tiempo */}
                            <div className="text-sm">
                                {formatTime(currentTime)} /{" "}
                                {formatTime(duration)}
                            </div>
                        </div>

                        {/* Volumen */}
                        <div className="flex items-center space-x-2">
                            <button
                                className="hover:bg-white/10 p-2 rounded-full transition"
                                onClick={toggleMute}
                            >
                                {isMuted || volume === 0 ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                                    </svg>
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                                        volume * 100
                                    }%, rgba(255,255,255,0.2) ${
                                        volume * 100
                                    }%, rgba(255,255,255,0.2) 100%)`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}