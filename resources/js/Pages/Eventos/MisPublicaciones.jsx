import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import toast from "react-hot-toast";
import { useFlash } from "@/hooks/useFlash";
import { Heart, MessageCircle, Trash2, Edit, Eye, Plus } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingSpinner from "@/Components/LoadingSpinner";

export default function MisPublicaciones({ auth, noticias }) {
    useFlash();

    const nextPageUrl = noticias?.links?.find(
        (link) => link.label === "&raquo;"
    )?.url;
    const { loaderRef, isLoading } = useInfiniteScroll({ nextPageUrl });

    const handleDelete = (noticiaId) => {
        toast(
            (t) => (
                <div className="flex flex-col space-y-3">
                    <p className="font-medium">¿Eliminar esta noticia?</p>
                    <p className="text-sm text-gray-600">
                        Esta acción no se puede deshacer
                    </p>
                    <div className="flex space-x-2 justify-end">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);

                                const loadingToast = toast.loading(
                                    "Eliminando noticia..."
                                );

                                router.delete(
                                    `/noticias/${noticiaId}`,
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            toast.dismiss(loadingToast);
                                            toast.success(
                                                "noticia eliminada correctamente"
                                            );
                                        },
                                        onError: () => {
                                            toast.dismiss(loadingToast);
                                            toast.error(
                                                "No se pudo eliminar la noticia"
                                            );
                                        },
                                    }
                                );
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
                style: {
                    background: "#fff",
                    color: "#000",
                    maxWidth: "400px",
                },
            }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user} >
            <Head title="Mis noticias" />

            <div className="py-6 sm:py-8 lg:py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Mis noticias
                            </h1>
                            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                Administra todas tus noticias
                            </p>
                        </div>
                        <Link href="/noticias/create">
                            <span className="inline-flex items-center gap-1 bg-edu-dark rounded-lg text-white hover:bg-gray-800 py-3 px-4">
                                <Plus className="w-4 h-4" />
                                <p>Nueva noticia</p>
                            </span>
                        </Link>
                    </div>

                    {/* Lista de noticias */}
                    {noticias.data.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden sm:rounded-2xl p-8 sm:p-12 text-center transition-colors">
                            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-4">
                                No has creado ninguna noticia todavía
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl transition-colors">
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {noticias.data.map((noticia) => (
                                        <div
                                            key={noticia.id}
                                            className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {/* Mobile Layout */}
                                            <div className="block sm:hidden">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1 min-w-0 pr-2">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                                                            {noticia.titulo}
                                                        </h3>

                                                        {/* Estado de noticia */}
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                noticia.publicado
                                                                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                                    : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                                            }`}
                                                        >
                                                            {noticia.publicado
                                                                ? "Publicado"
                                                                : "Borrador"}
                                                        </span>
                                                    </div>

                                                    {/* Acciones Mobile */}
                                                    <div className="flex items-center space-x-1 flex-shrink-0">
                                                        <Link
                                                            href={`/noticias/${noticia.id}`}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Ver"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            href={`/noticias/${noticia.id}/edit`}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    noticia.id
                                                                )
                                                            }
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                                                    {noticia.contenido}
                                                </p>

                                                {/* Estadísticas Mobile */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center space-x-1">
                                                            <Heart className="w-3.5 h-3.5" />
                                                            <span>
                                                                {
                                                                    noticia.likes_count
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <MessageCircle className="w-3.5 h-3.5" />
                                                            <span>
                                                                {
                                                                    noticia.comentarios_count
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Eye className="w-3.5 h-3.5" />
                                                            <span>
                                                                {
                                                                    noticia.count_visualizaciones
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(
                                                            noticia.created_at
                                                        ).toLocaleDateString(
                                                            "es-AR",
                                                            {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "2-digit",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Desktop Layout */}
                                            <div className="hidden sm:block">
                                                <div className="flex items-start space-x-4">
                                                    {/* Contenido */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                                    {
                                                                        noticia.titulo
                                                                    }
                                                                </h3>
                                                                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                                                    {
                                                                        noticia.contenido
                                                                    }
                                                                </p>

                                                                {/* Estadísticas */}
                                                                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                                                                    <div className="flex items-center space-x-1">
                                                                        <Heart className="w-4 h-4" />
                                                                        <span>
                                                                            {
                                                                                noticia.likes_count
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-1">
                                                                        <MessageCircle className="w-4 h-4" />
                                                                        <span>
                                                                            {
                                                                                noticia.comentarios_count
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-1">
                                                                        <Eye className="w-4 h-4" />
                                                                        <span>
                                                                            {
                                                                                noticia.count_visualizaciones
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-gray-400">
                                                                        •
                                                                    </span>
                                                                    <span>
                                                                        {new Date(
                                                                            noticia.created_at
                                                                        ).toLocaleDateString(
                                                                            "es-AR"
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Acciones Desktop */}
                                                            <div className="flex items-center space-x-2 ml-4">
                                                                <Link
                                                                    href={`/noticias/${noticia.id}`}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Ver noticia"
                                                                >
                                                                    <Eye className="w-5 h-5" />
                                                                </Link>
                                                                <Link
                                                                    href={`/noticias/${noticia.id}/edit`}
                                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                    title="Editar noticia"
                                                                >
                                                                    <Edit className="w-5 h-5" />
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            noticia.id
                                                                        )
                                                                    }
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Eliminar noticia"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Estado de noticia Desktop */}
                                                        <div className="mt-3">
                                                            <span
                                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                                    noticia.publicado
                                                                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                                                }`}
                                                            >
                                                                {noticia.publicado
                                                                    ? "Publicado"
                                                                    : "Borrador"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Loader para scroll infinito */}
                            {nextPageUrl && (
                                <div ref={loaderRef}>
                                    {isLoading && <LoadingSpinner />}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
