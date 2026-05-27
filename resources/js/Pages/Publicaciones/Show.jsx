import { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Send, ChevronLeft, ChevronRight, Download, X,
    FileText, ArrowLeft, Calendar,
} from "lucide-react";
import PublicacionActions from "@/Components/Publicacion/PublicacionActions";
import ComentarioItem from "@/Components/Publicacion/ComentarioItem";
import toast from "react-hot-toast";
import axios from "axios";

export default function Show({ auth, noticia, userType }) {
    const [isLiked, setIsLiked] = useState(noticia.user_has_liked);
    const [likesCount, setLikesCount] = useState(noticia.likes_count);
    const [isFavorite, setIsFavorite] = useState(noticia.is_favorite);
    const [comentarioText, setComentarioText] = useState("");
    const [comentarios, setComentarios] = useState(noticia.comentarios);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const media = noticia.media || [];
    const imagenPortada = media.length === 0 && noticia.imagen
        ? `/storage/${noticia.imagen}`
        : null;

    const esNovedad = !noticia.perf_institucion_id && noticia.admin_id;
    const autorNombre = esNovedad ? "NQN Joven" : noticia.institucion?.user?.nombre;
    const autorFoto = esNovedad ? "/images/logo-nqnjoven.png" : noticia.institucion?.user?.profile_photo_url;
    const fecha = noticia.created_at
        ? new Date(noticia.created_at).toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })
        : "";

    const canLike = true;
    const canFavorite = userType === "persona";
    const canComment = true;

    const handleLike = async () => {
        const prev = isLiked;
        const prevCount = likesCount;
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        try {
            await axios.post("/likes/toggle", { target_id: noticia.id, target_tipo: "noticia" });
        } catch {
            setIsLiked(prev);
            setLikesCount(prevCount);
            toast.error("No se pudo actualizar el like");
        }
    };

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (userType !== "persona") { toast.error("Solo las personas pueden guardar favoritos"); return; }
        const prev = isFavorite;
        setIsFavorite(!isFavorite);
        try {
            const res = await axios.post("/favoritos/toggle", { noticia_id: noticia.id, tipo:"noticia" });
            if (!res.data.success) setIsFavorite(prev);
        } catch { setIsFavorite(prev); }
    };

    const handleComentarioSubmit = async (e) => {
        e.preventDefault();
        if (!comentarioText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        setErrorMessage("");
        const loadingToast = toast.loading("Publicando comentario...");
        try {
            const response = await axios.post("/comentarios", { noticia_id: noticia.id, tipo: "noticia", contenido: comentarioText });
            if (response.data.success) {
                toast.dismiss(loadingToast);
                toast.success("¡Comentario publicado!");
                setComentarioText("");
                setComentarios([response.data.comentario, ...comentarios]);
                router.reload({ only: ["noticia"], preserveScroll: true });
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            if (error.response?.status === 422) {
                const data = error.response.data;
                if (data.blocked) {
                    setErrorMessage(data.message || "Tu comentario contiene palabras inapropiadas.");
                    toast.error("Comentario bloqueado ⚠️", { duration: 5000 });
                } else {
                    const errores = Object.values(data.errors || {}).flat();
                    setErrorMessage(errores.join(", ") || data.message);
                    toast.error(errores[0] || "Error de validación");
                }
            } else {
                setErrorMessage("Error al publicar. Intentalo de nuevo.");
                toast.error("Error de conexión.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextMedia = () => setCurrentMediaIndex((prev) => (prev + 1) % media.length);
    const prevMedia = () => setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={noticia.titulo} />

            <div className="max-w-2xl mx-auto px-4 pb-10 relative z-10">

                {/* Volver */}
                <button onClick={() => window.history.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#5d4dff] transition-colors mt-2 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                {/* Card principal */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">

                    {/* Imagen de portada (novedades admin) */}
                    {imagenPortada && (
                        <img src={imagenPortada} alt={noticia.titulo} className="w-full max-h-72 object-cover" />
                    )}

                    {/* Slider de media */}
                    {media.length > 0 && (
                        <div className="bg-black h-64 sm:h-80 relative">
                            <MediaSlide media={media[currentMediaIndex]} onFullscreen={() => setShowFullscreen(true)} />
                            {media.length > 1 && (
                                <>
                                    <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                        {media.map((_, i) => (
                                            <button key={i} onClick={() => setCurrentMediaIndex(i)}
                                                className={`h-1.5 rounded-full transition-all ${i === currentMediaIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="absolute top-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-xs z-10">
                                        {currentMediaIndex + 1} / {media.length}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Autor */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <img
                            src={autorFoto}
                            alt={autorNombre}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-gray-100"
                            onError={(e) => { e.onerror = null; e.target.src = "/svg/header/perfil.svg"; }}
                        />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-900 dark:text-white text-sm">{autorNombre}</span>
                                {esNovedad && (
                                    <span className="px-2 py-0.5 bg-[#5d4dff] text-white text-xs rounded-full font-medium">
                                        Novedad oficial
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" /> {fecha}
                            </p>
                        </div>
                    </div>

                    {/* Título y contenido */}
                    <div className="px-5 py-5">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">
                            {noticia.titulo}
                        </h1>

                        {noticia.resumen && (
                            <p className="text-base text-gray-600 dark:text-gray-300 font-medium mb-4 pb-4 border-b border-gray-100 dark:border-gray-700 leading-relaxed">
                                {noticia.resumen}
                            </p>
                        )}

                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px] whitespace-pre-wrap">
                            {noticia.contenido}
                        </div>

                        {noticia.link_externo && (
                            <a
                                href={noticia.link_externo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-[#5d4dff] text-white rounded-xl text-sm font-medium hover:bg-[#4a3aee] transition-colors"
                            >
                                Ver más →
                            </a>
                        )}

                        {noticia.categorias?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                                {noticia.categorias.map((cat, i) => (
                                    <span key={i} className="px-3 py-1 bg-[#c4ff00] text-[#0a0236] rounded-full text-xs font-semibold">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Acciones */}
                    <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700">
                        <PublicacionActions
                            isLiked={isLiked}
                            likesCount={likesCount}
                            onLike={handleLike}
                            canLike={canLike}
                            comentariosCount={comentarios.length}
                            isFavorite={isFavorite}
                            onFavorite={handleFavorite}
                            canFavorite={canFavorite}
                            noticiaId={noticia.id}
                            layout="spaced"
                            size="default"
                        />
                    </div>
                </div>

                {/* Comentarios */}
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                        Comentarios ({comentarios.length})
                    </h2>

                    {canComment && (
                        <form onSubmit={handleComentarioSubmit} className="mb-5">
                            <div className="flex gap-3">
                                <img
                                    src={auth.user.profile_photo_url}
                                    alt={auth.user.nombre}
                                    className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
                                />
                                <div className="flex-1">
                                    <textarea
                                        value={comentarioText}
                                        onChange={(e) => { setComentarioText(e.target.value); if (errorMessage) setErrorMessage(""); }}
                                        placeholder="Escribí un comentario..."
                                        className={`w-full rounded-xl border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#5d4dff]/30 ${errorMessage ? "border-red-300" : "border-gray-200 dark:border-gray-600"}`}
                                        rows="2"
                                        maxLength={500}
                                        disabled={isSubmitting}
                                    />
                                    {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-400">{comentarioText.length}/500</span>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !comentarioText.trim()}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5d4dff] text-white rounded-lg text-sm font-medium hover:bg-[#4a3aee] transition disabled:opacity-50"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            {isSubmitting ? "Enviando..." : "Comentar"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    <div className="space-y-3">
                        {comentarios.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-6">
                                Aún no hay comentarios. ¡Sé el primero!
                            </p>
                        ) : (
                            comentarios.map((comentario) => (
                                <ComentarioItem
                                    key={comentario.id}
                                    tipo="noticia"
                                    comentario={comentario}
                                    userType={userType}
                                    currentUserId={userType === "persona" ? auth.user.persona?.id : auth.user.institucion?.id}
                                    noticiaInstitucionId={noticia.perf_institucion_id}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {showFullscreen && media[currentMediaIndex] && (
                <FullscreenModal allMedia={media} initialIndex={currentMediaIndex} onClose={() => setShowFullscreen(false)} />
            )}
        </AuthenticatedLayout>
    );
}

/* ----------------------------- COMPONENTES ----------------------------- */

function MediaSlide({ media, onFullscreen }) {
    if (!media || !media.url_publica) return null;
    if (media.tipo === "imagen")
        return <img src={media.url_publica} alt="Imagen" className="w-full h-full object-contain cursor-pointer" onClick={onFullscreen} />;
    if (media.tipo === "video")
        return (
            <div className="w-full h-full flex items-center justify-center cursor-pointer" onClick={onFullscreen}>
                <video src={media.url_publica} className="w-full h-full object-contain" preload="metadata" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 rounded-full p-4">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                </div>
            </div>
        );
    if (media.tipo === "documento") {
        const fileName = media.url?.split("/").pop() || "Documento";
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50">
                <FileText className="w-20 h-20 text-gray-400 mb-4" />
                <p className="text-gray-700 text-center mb-4 font-medium">{fileName}</p>
                <a href={media.url_publica} download target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 bg-[#5d4dff] text-white rounded-xl hover:bg-[#4a3aee] transition">
                    <Download className="w-4 h-4 mr-2" /> Descargar
                </a>
            </div>
        );
    }
    return null;
}

function FullscreenModal({ allMedia, initialIndex, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef(null);
    const currentMedia = allMedia[currentIndex];
    const hasMultiple = allMedia.length > 1;

    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const handlePrevious = (e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allMedia.length - 1)); setCurrentTime(0); setIsPlaying(true); };
    const handleNext = (e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev < allMedia.length - 1 ? prev + 1 : 0)); setCurrentTime(0); setIsPlaying(true); };
    const togglePlayPause = (e) => { e.stopPropagation(); if (videoRef.current) { isPlaying ? videoRef.current.pause() : videoRef.current.play(); setIsPlaying(!isPlaying); } };
    const handleSeek = (e) => { if (!videoRef.current || !duration) return; const rect = e.currentTarget.getBoundingClientRect(); const pos = (e.clientX - rect.left) / rect.width; videoRef.current.currentTime = Math.max(0, Math.min(pos * duration, duration)); setCurrentTime(videoRef.current.currentTime); };
    const toggleMute = (e) => { e.stopPropagation(); if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); } };
    const handleVolumeChange = (e) => { e.stopPropagation(); const v = parseFloat(e.target.value); if (videoRef.current) { videoRef.current.volume = v; setVolume(v); setIsMuted(v === 0); } };
    const formatTime = (t) => { if (!t || isNaN(t)) return "0:00"; return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`; };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {hasMultiple && (<>
                            <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition" onClick={handlePrevious}><ChevronLeft className="w-5 h-5" /></button>
                            <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition" onClick={handleNext}><ChevronRight className="w-5 h-5" /></button>
                        </>)}
                    </div>
                    {hasMultiple && <div className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">{currentIndex + 1} / {allMedia.length}</div>}
                    <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition" onClick={onClose}><X className="w-5 h-5" /></button>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 pt-16 pb-20">
                {currentMedia.tipo === "imagen" && <img src={currentMedia.url_publica} alt="" className="max-w-full max-h-full object-contain rounded-lg" />}
                {currentMedia.tipo === "video" && (
                    <video key={currentMedia.id || currentIndex} ref={videoRef} src={currentMedia.url_publica} autoPlay className="max-w-full max-h-[calc(100vh-180px)] object-contain rounded-lg"
                        onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
                        onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
                        onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)} />
                )}
                {currentMedia.tipo === "documento" && (
                    <div className="bg-gray-900 rounded-xl p-12 text-center">
                        <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                        <p className="text-white text-lg mb-4">{currentMedia.url?.split("/").pop()}</p>
                        <a href={currentMedia.url_publica} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-[#5d4dff] text-white rounded-xl hover:bg-[#4a3aee] transition">
                            <Download className="w-5 h-5 mr-2" /> Descargar
                        </a>
                    </div>
                )}
            </div>
            {currentMedia.tipo === "video" && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 z-20">
                    <div className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer" onClick={handleSeek}>
                        <div className="h-full bg-[#5d4dff] rounded-full" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <button className="hover:bg-white/10 p-2 rounded-full" onClick={togglePlayPause}>
                                {isPlaying ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                                    : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
                            </button>
                            <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="hover:bg-white/10 p-2 rounded-full" onClick={toggleMute}>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={isMuted || volume === 0 ? "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" : "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"} /></svg>
                            </button>
                            <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-20 h-1 rounded-full appearance-none cursor-pointer"
                                style={{ background: `linear-gradient(to right, #5d4dff 0%, #5d4dff ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)` }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
