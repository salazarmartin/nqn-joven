import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import toast from "react-hot-toast";
import { useFlash } from "@/hooks/useFlash";
import { Heart, MessageCircle, Eye, Plus, Pencil, Trash2, Newspaper } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingSpinner from "@/Components/LoadingSpinner";

export default function MisPublicaciones({ auth, noticias }) {
    useFlash();

    const nextPageUrl = noticias?.links?.find((link) => link.label === "&raquo;")?.url;
    const { loaderRef, isLoading } = useInfiniteScroll({ nextPageUrl });

    const handleDelete = (noticiaId) => {
        toast(
            (t) => (
                <div className="flex flex-col gap-3">
                    <p className="font-semibold text-gray-800">¿Eliminar esta noticia?</p>
                    <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                const loadingToast = toast.loading("Eliminando...");
                                router.delete(`/noticias/${noticiaId}`, {
                                    preserveScroll: true,
                                    onSuccess: () => { toast.dismiss(loadingToast); toast.success("Noticia eliminada"); },
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
            <Head title="Mis noticias" />

            <div className="max-w-2xl mx-auto px-4 py-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mis noticias</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {noticias.data.length > 0 ? `${noticias.total} publicacion${noticias.total !== 1 ? "es" : ""}` : "Sin publicaciones"}
                        </p>
                    </div>
                    <Link
                        href="/noticias/create"
                        className="flex items-center gap-1.5 bg-[#5d4dff] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#4a3aee] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva
                    </Link>
                </div>

                {/* Lista */}
                {noticias.data.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                        <img src="/images/iconos/muticia celeste.png" alt="" aria-hidden="true" className="w-16 h-16 object-contain mx-auto mb-3 opacity-60" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">No publicaste nada todavía</p>
                        <p className="text-sm text-gray-400">Compartí novedades con la comunidad</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {noticias.data.map((noticia) => (
                            <NoticiaCard key={noticia.id} noticia={noticia} onDelete={handleDelete} />
                        ))}

                        {nextPageUrl && (
                            <div ref={loaderRef}>
                                {isLoading && <LoadingSpinner />}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function NoticiaCard({ noticia, onDelete }) {
    const fecha = noticia.created_at
        ? new Date(noticia.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" })
        : "";

    const imagen = noticia.media?.[0]?.url_publica || (noticia.imagen ? `/storage/${noticia.imagen}` : null);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-sm transition-shadow">
            <div className="flex gap-3 p-4">

                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#5d4dff] to-[#0a0236] flex items-center justify-center">
                    {imagen ? (
                        <img src={imagen} alt={noticia.titulo} className="w-full h-full object-cover" />
                    ) : (
                        <Newspaper className="w-7 h-7 text-white/50" strokeWidth={1.5} />
                    )}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-2 leading-snug">
                                {noticia.titulo}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{fecha}</p>
                        </div>

                        {/* Badge estado */}
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                            noticia.publicado
                                ? "bg-[#c4ff00] text-[#0a0236]"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}>
                            {noticia.publicado ? "Publicado" : "Borrador"}
                        </span>
                    </div>

                    {/* Stats + acciones */}
                    <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5" />
                                {noticia.likes_count ?? 0}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {noticia.comentarios_count ?? 0}
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {noticia.count_visualizaciones ?? 0}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Link
                                href={`/noticias/${noticia.id}`}
                                className="p-1.5 text-gray-400 hover:text-[#5d4dff] hover:bg-purple-50 rounded-lg transition-colors"
                                title="Ver"
                            >
                                <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                                href={`/noticias/${noticia.id}/edit`}
                                className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Editar"
                            >
                                <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => onDelete(noticia.id)}
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
