import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import toast from "react-hot-toast";
import { useFlash } from "@/hooks/useFlash";
import { Heart, MessageCircle, Eye, Plus, Pencil, Trash2, Calendar, MapPin, Monitor, Users, Layers } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingSpinner from "@/Components/LoadingSpinner";

const MODALIDAD = {
    presencial: { label: "Presencial", bg: "bg-[#c4ff00]", text: "text-[#0a0236]", icon: Users },
    virtual:    { label: "Virtual",    bg: "bg-[#00d9fa]", text: "text-[#0a0236]", icon: Monitor },
    hibrida:    { label: "Híbrida",    bg: "bg-[#ff90eb]", text: "text-[#0a0236]", icon: Layers },
};

function formatFecha(fechaStr) {
    if (!fechaStr) return "";
    const fecha = new Date(String(fechaStr).replace(" ", "T"));
    return fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

export default function MisPublicaciones({ auth, noticias }) {
    useFlash();

    const nextPageUrl = noticias?.links?.find((link) => link.label === "&raquo;")?.url;
    const { loaderRef, isLoading } = useInfiniteScroll({ nextPageUrl });

    const handleDelete = (id) => {
        toast(
            (t) => (
                <div className="flex flex-col gap-3">
                    <p className="font-semibold text-gray-800">¿Eliminar este evento?</p>
                    <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                const loadingToast = toast.loading("Eliminando...");
                                router.delete(`/noticias/${id}`, {
                                    preserveScroll: true,
                                    onSuccess: () => { toast.dismiss(loadingToast); toast.success("Evento eliminado"); },
                                    onError: () => { toast.dismiss(loadingToast); toast.error("No se pudo eliminar"); },
                                });
                            }}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity, style: { background: "#fff", color: "#000", maxWidth: "340px" } }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Mis eventos" />

            <div className="max-w-2xl mx-auto px-4 py-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mis eventos</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {noticias?.data?.length > 0
                                ? `${noticias.total} evento${noticias.total !== 1 ? "s" : ""}`
                                : "Sin eventos"}
                        </p>
                    </div>
                    <Link
                        href="/noticias/create"
                        className="flex items-center gap-1.5 bg-[#5d4dff] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#4a3aee] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo
                    </Link>
                </div>

                {/* Lista */}
                {!noticias?.data?.length ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">No creaste ningún evento todavía</p>
                        <p className="text-sm text-gray-400">Compartí eventos con la comunidad</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {noticias.data.map((evento) => (
                            <EventoCard key={evento.id} evento={evento} onDelete={handleDelete} />
                        ))}
                        {nextPageUrl && (
                            <div ref={loaderRef}>{isLoading && <LoadingSpinner />}</div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function EventoCard({ evento, onDelete }) {
    const imagen = evento.imagen ? `/storage/${evento.imagen}` : null;
    const modalidad = MODALIDAD[evento.modalidad] || MODALIDAD.presencial;
    const ModalidadIcon = modalidad.icon;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-sm transition-shadow">
            <div className="flex gap-3 p-4">

                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#5d4dff] to-[#0a0236]">
                    {imagen ? (
                        <img src={imagen} alt={evento.titulo} className="w-full h-full object-cover" />
                    ) : (
                        <Calendar className="w-7 h-7 text-white/50" strokeWidth={1.5} />
                    )}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1 leading-snug">
                                {evento.titulo}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                                {evento.fecha && (
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatFecha(evento.fecha)}
                                    </span>
                                )}
                                {evento.lugar && (
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate max-w-[100px]">{evento.lugar}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Badge modalidad */}
                        <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${modalidad.bg} ${modalidad.text}`}>
                            <ModalidadIcon className="w-3 h-3" />
                            {modalidad.label}
                        </span>
                    </div>

                    {/* Stats + acciones */}
                    <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5" />
                                {evento.likes_count ?? 0}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {evento.comentarios_count ?? 0}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                evento.publicado ? "bg-[#c4ff00] text-[#0a0236]" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                            }`}>
                                {evento.publicado ? "Publicado" : "Borrador"}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Link
                                href={`/eventos/${evento.id}`}
                                className="p-1.5 text-gray-400 hover:text-[#5d4dff] hover:bg-purple-50 rounded-lg transition-colors"
                                title="Ver"
                            >
                                <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                                href={`/noticias/${evento.id}/edit`}
                                className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Editar"
                            >
                                <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => onDelete(evento.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
