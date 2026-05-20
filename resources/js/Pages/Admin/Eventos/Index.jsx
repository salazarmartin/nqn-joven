import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, Eye, EyeOff, MapPin, Calendar } from "lucide-react";


export function DateDisplay({fechaEntrada}) {
  
    const fecha = new Date(fechaEntrada.replace(" ", "T"));

    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();

    return dia+'/'+mes+'/'+año;
}

export default function EventosIndex({ eventos }) {
    const handleDelete = (id) => {
        if (!confirm("¿Eliminar este evento?")) return;
        router.delete(route("admin.eventos.destroy", id));
    };

    const modalidadBadge = {
        presencial: "bg-green-100 text-green-700",
        virtual: "bg-blue-100 text-blue-700",
        hibrida: "bg-purple-100 text-purple-700",
    };

    return (
        <AdminLayout title="Eventos">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Eventos</h2>
                    <p className="text-sm text-gray-500">Gestioná los eventos provinciales</p>
                </div>
                <Link
                    href={route("admin.eventos.create")}
                    className="flex items-center gap-2 bg-[#23025d] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a0499] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo evento
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {eventos.data.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No hay eventos cargados todavía.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium">Evento</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Fecha</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Modalidad</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Estado</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {eventos.data.map((ev) => (
                                <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-800 line-clamp-1">{ev.titulo}</p>
                                        <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3" /> {ev.lugar}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4 text-gray-600 hidden md:table-cell whitespace-nowrap">
                                        <DateDisplay fechaEntrada={ev.fecha}/> - {ev.hora} hs
                                    </td>
                                    <td className="px-5 py-4 hidden lg:table-cell">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${modalidadBadge[ev.modalidad]}`}>
                                            {ev.modalidad}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 hidden lg:table-cell">
                                        {ev.publicado ? (
                                            <span className="flex items-center gap-1 text-green-600 text-xs"><Eye className="w-3.5 h-3.5" /> Publicado</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-400 text-xs"><EyeOff className="w-3.5 h-3.5" /> Borrador</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route("admin.eventos.edit", ev.id)}
                                                className="p-1.5 text-gray-400 hover:text-[#23025d] hover:bg-purple-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(ev.id)}
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

            <Pagination links={eventos.links} />
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
