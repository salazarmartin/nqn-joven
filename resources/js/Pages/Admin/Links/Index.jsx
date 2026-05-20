import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, ExternalLink, CheckCircle, XCircle } from "lucide-react";

export default function LinksIndex({ links }) {
    const handleDelete = (id) => {
        if (!confirm("¿Eliminar este link?")) return;
        router.delete(route("admin.links.destroy", id));
    };

    return (
        <AdminLayout title="Links de interés">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Links de interés</h2>
                    <p className="text-sm text-gray-500">Recursos y sitios útiles para los jóvenes</p>
                </div>
                <Link
                    href={route("admin.links.create")}
                    className="flex items-center gap-2 bg-[#23025d] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a0499] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo link
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {links.data.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <ExternalLink className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No hay links cargados todavía.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium">Link</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">URL</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Orden</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Estado</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {links.data.map((lk) => (
                                <tr key={lk.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-800 line-clamp-1">{lk.titulo}</p>
                                        {lk.descripcion && (
                                            <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">{lk.descripcion}</p>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 hidden md:table-cell">
                                        <a
                                            href={lk.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline flex items-center gap-1 text-xs"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            <span className="truncate max-w-[200px]">{lk.url}</span>
                                        </a>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500 hidden lg:table-cell">{lk.orden}</td>
                                    <td className="px-5 py-4 hidden lg:table-cell">
                                        {lk.activo ? (
                                            <span className="flex items-center gap-1 text-green-600 text-xs">
                                                <CheckCircle className="w-3.5 h-3.5" /> Activo
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-400 text-xs">
                                                <XCircle className="w-3.5 h-3.5" /> Inactivo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route("admin.links.edit", lk.id)}
                                                className="p-1.5 text-gray-400 hover:text-[#23025d] hover:bg-purple-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(lk.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination links={links.links} />
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
