import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Star, StarOff, Trash2, Search, Newspaper, Plus, Pencil } from "lucide-react";

export default function PublicacionesIndex({ noticias, filtros }) {
    const { data, setData, get } = useForm({
        buscar:    filtros?.buscar    ?? "",
        publicado: filtros?.publicado ?? "",
        tipo:      filtros?.tipo      ?? "",
    });

    const handleFiltrar = (e) => {
        e.preventDefault();
        get(route("admin.noticias.index"), { preserveState: true });
    };

    const handleTogglePublicado = (id) => {
        router.patch(route("admin.noticias.toggle-publicado", id));
    };

    const handleToggleDestacado = (id) => {
        router.patch(route("admin.noticias.toggle-destacado", id));
    };

    const handleDelete = (id) => {
        if (!confirm("¿Eliminar esta publicación? Esta acción no se puede deshacer.")) return;
        router.delete(route("admin.noticias.destroy", id));
    };

    const esNovedad = (pub) => !pub.perf_institucion_id && pub.admin_id;

    return (
        <AdminLayout title="Publicaciones y Novedades">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Publicaciones y Novedades</h2>
                    <p className="text-sm text-gray-500">Creá novedades oficiales y moderá las publicaciones de instituciones</p>
                </div>
                <Link
                    href={route("admin.noticias.create")}
                    className="flex items-center gap-2 bg-[#23025d] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a0499] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nueva novedad
                </Link>
            </div>

            {/* Filtros */}
            <form onSubmit={handleFiltrar} className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por título o contenido..."
                        value={data.buscar}
                        onChange={(e) => setData("buscar", e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#23025d]/30"
                    />
                </div>
                <select
                    value={data.tipo}
                    onChange={(e) => setData("tipo", e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#23025d]/30"
                >
                    <option value="">Todos los tipos</option>
                    <option value="novedad">Solo novedades (admin)</option>
                    <option value="institucion">Solo instituciones</option>
                </select>
                <select
                    value={data.publicado}
                    onChange={(e) => setData("publicado", e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#23025d]/30"
                >
                    <option value="">Todos los estados</option>
                    <option value="1">Publicados</option>
                    <option value="0">Borradores</option>
                </select>
                <button
                    type="submit"
                    className="bg-[#23025d] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a0499] transition-colors"
                >
                    Filtrar
                </button>
            </form>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {noticias.data.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No se encontraron noticias.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium">Noticia</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Autor</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Stats</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Estado</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {noticias.data.map((pub) => {
                                const novedad = esNovedad(pub);
                                return (
                                    <tr key={pub.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 max-w-xs">
                                            <div className="flex items-start gap-2">
                                                {novedad && (
                                                    <span className="flex-shrink-0 px-1.5 py-0.5 bg-[#23025d] text-white text-xs rounded font-medium">
                                                        Novedad
                                                    </span>
                                                )}
                                                {pub.destacado && (
                                                    <span className="flex-shrink-0 px-1.5 py-0.5 bg-yellow-400 text-white text-xs rounded font-medium">
                                                        Destacada
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-medium text-gray-800 line-clamp-1 mt-1">{pub.titulo || "(Sin título)"}</p>
                                            <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">{pub.resumen || pub.contenido}</p>
                                            <p className="text-gray-300 text-xs mt-1">{pub.created_at?.slice(0, 10)}</p>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            {novedad ? (
                                                <span className="text-[#23025d] text-xs font-medium">Admin</span>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    {pub.institucion?.user?.profile_photo_url && (
                                                        <img
                                                            src={pub.institucion.user.profile_photo_url}
                                                            alt=""
                                                            className="w-7 h-7 rounded-full object-cover"
                                                        />
                                                    )}
                                                    <span className="text-gray-600 text-xs line-clamp-1">
                                                        {pub.institucion?.user?.nombre ?? "—"}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 text-xs hidden lg:table-cell">
                                            <span>{pub.likes_count} likes</span>
                                            <span className="mx-1">·</span>
                                            <span>{pub.comentarios_count} comentarios</span>
                                        </td>
                                        <td className="px-5 py-4 hidden lg:table-cell">
                                            {pub.publicado ? (
                                                <span className="flex items-center gap-1 text-green-600 text-xs">
                                                    <Eye className="w-3.5 h-3.5" /> Publicado
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-gray-400 text-xs">
                                                    <EyeOff className="w-3.5 h-3.5" /> Borrador
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={route("admin.noticias.edit", pub.id)}
                                                    className="p-1.5 text-gray-400 hover:text-[#23025d] hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleTogglePublicado(pub.id)}
                                                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title={pub.publicado ? "Despublicar" : "Publicar"}
                                                >
                                                    {pub.publicado ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleToggleDestacado(pub.id)}
                                                    className="p-1.5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                                                    title={pub.destacado ? "Quitar destacado" : "Destacar"}
                                                >
                                                    {pub.destacado ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pub.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination links={noticias.links} />
        </AdminLayout>
    );
}

function Pagination({ links }) {
    if (links.length <= 3) return null;
    return (
        <div className="flex gap-1 mt-5 justify-end">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url ?? "#"}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                        link.active
                            ? "bg-[#23025d] text-white border-[#23025d]"
                            : link.url
                            ? "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            : "bg-white text-gray-300 border-gray-100 cursor-default"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
