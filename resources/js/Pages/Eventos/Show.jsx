import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Send, ArrowLeft, Calendar, MapPin, Clock,
    Monitor, Users, Layers, ExternalLink, CheckCircle, UserPlus,
} from "lucide-react";
import EventoActions from "@/Components/Publicacion/EventoActions";
import ComentarioItem from "@/Components/Publicacion/ComentarioItem";
import toast from "react-hot-toast";
import axios from "axios";

const MODALIDAD = {
    presencial: { label: "Presencial", bg: "bg-[#c4ff00]", text: "text-[#0a0236]", icon: Users },
    virtual:    { label: "Virtual",    bg: "bg-[#00d9fa]", text: "text-[#0a0236]", icon: Monitor },
    hibrida:    { label: "Híbrida",    bg: "bg-[#ff90eb]", text: "text-[#0a0236]", icon: Layers },
};

function formatFecha(fechaStr) {
    if (!fechaStr) return "";
    const fecha = new Date(String(fechaStr).replace(" ", "T"));
    return fecha.toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatHora(hora) {
    if (!hora) return "";
    return String(hora).substring(0, 5) + " hs";
}

export default function Show({ auth, adminevento, evento, userType, userIsInscrito, cuposDisponibles, inscripcionesCount }) {
    const [isLiked, setIsLiked] = useState(evento.user_has_liked);
    const [likesCount, setLikesCount] = useState(evento.likes_count);
    const [isFavorite, setIsFavorite] = useState(evento.is_favorite);
    const [comentarioText, setComentarioText] = useState("");
    const [comentarios, setComentarios] = useState(evento.comentarios || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [inscrito, setInscrito] = useState(userIsInscrito);
    const [cupos, setCupos] = useState(cuposDisponibles);
    const [inscribiendose, setInscribiendose] = useState(false);

    const imagenPortada = evento.imagen ? `/storage/${evento.imagen}` : null;
    const modalidadInfo = MODALIDAD[evento.modalidad] || MODALIDAD.presencial;
    const ModalidadIcon = modalidadInfo.icon;

    const canLike = true;
    const canFavorite = userType === "persona";
    const canComment = true;

    const handleLike = async () => {
        const prev = isLiked;
        const prevCount = likesCount;
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        try {
            await axios.post("/likes/toggle", { target_id: evento.id, target_tipo: "evento" });
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
            const res = await axios.post("/favoritos/toggle", { noticia_id: evento.id, tipo:"evento" });
            if (!res.data.success) setIsFavorite(prev);
        } catch { setIsFavorite(prev); }
    };

    const ahora = new Date();
    const inicioInscripcion = evento.fecha_inicio_inscripcion ? new Date(evento.fecha_inicio_inscripcion) : null;
    const finInscripcion = evento.fecha_fin_inscripcion ? new Date(evento.fecha_fin_inscripcion) : null;
    const inscripcionVigente = evento.inscripcion_habilitada
        && (!inicioInscripcion || ahora >= inicioInscripcion)
        && (!finInscripcion || ahora <= finInscripcion);
    const sinCupos = cupos !== null && cupos !== undefined && cupos <= 0;

    const handleInscribirse = async () => {
        if (inscribiendose) return;
        setInscribiendose(true);
        try {
            const res = await axios.post(`/eventos/${evento.id}/inscribirse`);
            if (res.data.success) {
                setInscrito(true);
                if (cupos !== null && cupos !== undefined) setCupos(c => Math.max(0, c - 1));
                toast.success("¡Inscripción exitosa! Te enviamos un email de confirmación.");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Error al inscribirse.");
        } finally {
            setInscribiendose(false);
        }
    };

    const handleComentarioSubmit = async (e) => {
        e.preventDefault();
        if (!comentarioText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        setErrorMessage("");
        const loadingToast = toast.loading("Publicando comentario...");
        try {
            const response = await axios.post("/comentarios", { noticia_id: evento.id, tipo: "evento", contenido: comentarioText });
            if (response.data.success) {
                toast.dismiss(loadingToast);
                toast.success("¡Comentario publicado!");
                setComentarioText("");
                setComentarios([response.data.comentario, ...comentarios]);
                router.reload({ only: ["evento"], preserveScroll: true });
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            if (error.response?.status === 422) {
                const data = error.response.data;
                if (data.blocked) {
                    setErrorMessage(data.message || "Comentario bloqueado por contenido inapropiado.");
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={evento.titulo} />

            <div className="max-w-2xl mx-auto px-4 pb-10 relative z-10">

                {/* Volver */}
                <button onClick={() => window.history.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#5d4dff] transition-colors mt-2 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                {/* Card principal */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">

                    {/* Imagen o placeholder */}
                    {imagenPortada ? (
                        <img src={imagenPortada} alt={evento.titulo} className="w-full h-56 object-cover" />
                    ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-[#5d4dff] to-[#0a0236] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute w-40 h-40 rounded-full bg-white/10 -top-10 -right-10" />
                            <div className="absolute w-24 h-24 rounded-full bg-white/10 -bottom-8 -left-8" />
                            <Calendar className="w-16 h-16 text-white/30" strokeWidth={1} />
                        </div>
                    )}

                    {/* Título y badge modalidad */}
                    <div className="px-5 pt-5 pb-3">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug flex-1">
                                {evento.titulo}
                            </h1>
                            <span className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${modalidadInfo.bg} ${modalidadInfo.text}`}>
                                <ModalidadIcon className="w-3.5 h-3.5" />
                                {modalidadInfo.label}
                            </span>
                        </div>

                        {/* Metadata del evento */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="w-7 h-7 rounded-lg bg-[#5d4dff]/10 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-4 h-4 text-[#5d4dff]" />
                                </div>
                                <span className="capitalize">{formatFecha(evento.fecha)}</span>
                            </div>
                            {evento.hora && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="w-7 h-7 rounded-lg bg-[#00d9fa]/10 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-4 h-4 text-[#00d9fa]" />
                                    </div>
                                    <span>{formatHora(evento.hora)}</span>
                                </div>
                            )}
                            {evento.lugar && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="w-7 h-7 rounded-lg bg-[#ff5b24]/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4 h-4 text-[#ff5b24]" />
                                    </div>
                                    <span>{evento.lugar}</span>
                                </div>
                            )}
                        </div>

                        {/* Descripción */}
                        {evento.descripcion && (
                            <div className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed whitespace-pre-wrap border-t border-gray-100 dark:border-gray-700 pt-4">
                                {evento.descripcion}
                            </div>
                        )}

                        {/* Link externo */}
                        {evento.link_externo && (
                            <a
                                href={evento.link_externo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#c4ff00] text-[#0a0236] rounded-xl text-sm font-bold hover:bg-[#b0e600] transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                ¡Inscribite aquí!
                            </a>
                        )}

                        {/* Inscripción por la app */}
                        {evento.inscripcion_habilitada && userType === "persona" && (
                            <div className="mt-4">
                                {inscrito ? (
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c4ff00]/20 text-[#0a0236] border border-[#c4ff00] rounded-xl text-sm font-bold">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        Ya estás inscripto
                                    </div>
                                ) : sinCupos ? (
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-bold cursor-not-allowed">
                                        <Users className="w-4 h-4" />
                                        Sin cupos disponibles
                                    </div>
                                ) : !inscripcionVigente ? (
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-bold cursor-not-allowed">
                                        <Calendar className="w-4 h-4" />
                                        Inscripción no disponible
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleInscribirse}
                                        disabled={inscribiendose}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5d4dff] text-white rounded-xl text-sm font-bold hover:bg-[#4a3aee] transition-colors disabled:opacity-60"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        {inscribiendose ? "Inscribiendo..." : "Inscribirme"}
                                    </button>
                                )}
                                {cupos !== null && cupos !== undefined && !inscrito && (
                                    <p className="text-xs text-gray-400 mt-1.5">
                                        {cupos} {cupos === 1 ? "cupo disponible" : "cupos disponibles"}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Autor */}
                        {adminevento && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <img
                                    src={adminevento.profile_photo_url}
                                    alt={adminevento.nombre}
                                    className="w-7 h-7 rounded-full object-cover"
                                    onError={(e) => { e.onerror = null; e.target.src = "/svg/header/perfil.svg"; }}
                                />
                                <span className="text-xs text-gray-400">
                                    Publicado por <span className="font-medium text-gray-600 dark:text-gray-300">{adminevento.nombre}</span>
                                </span>
                                <span className="ml-auto px-2 py-0.5 bg-[#5d4dff] text-white text-xs rounded-full font-medium">
                                    NQN Joven
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Acciones */}
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
                                    tipo="evento"
                                    comentario={comentario}
                                    userType={userType}
                                    currentUserId={userType === "persona" ? auth.user.persona?.id : auth.user.institucion?.id}
                                    eventoInstitucionId={evento.perf_institucion_id}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
