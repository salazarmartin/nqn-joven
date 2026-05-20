import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { Search, Users, UserCheck, Building2, Clock, Ban, Eye } from "lucide-react";

const ESTADO_BADGE = {
    activo:               "bg-green-100 text-green-700",
    inactivo:             "bg-red-100 text-red-700",
    pendiente_verif:      "bg-yellow-100 text-yellow-700",
    pendiente_datos:      "bg-blue-100 text-blue-700",
    pendiente_aprobacion: "bg-orange-100 text-orange-700",
};

const ESTADO_LABEL = {
    activo:               "Activo",
    inactivo:             "Inactivo",
    pendiente_verif:      "Verif. email",
    pendiente_datos:      "Pend. datos",
    pendiente_aprobacion: "Pend. aprob.",
};

const TIPO_BADGE = {
    persona:     "bg-purple-100 text-purple-700",
    institucion: "bg-blue-100 text-blue-700",
    admin:       "bg-gray-200 text-gray-700",
};

export default function UsuariosIndex({ usuarios, filtros, totales }) {
    const { data, setData, get } = useForm({
        buscar: filtros?.buscar ?? "",
        tipo:   filtros?.tipo   ?? "",
        estado: filtros?.estado ?? "",
    });

    const handleFiltrar = (e) => {
        e.preventDefault();
        get(route("admin.usuarios.index"), { preserveState: true });
    };

    const handleFiltroRapido = (key, value) => {
        router.get(route("admin.usuarios.index"), { ...filtros, [key]: value }, { preserveState: true });
    };

    return (
        <AdminLayout title="Usuarios">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Usuarios</h2>
                <p className="text-sm text-gray-500">Gestioná todos los usuarios de la plataforma</p>
            </div>

            {/* Tarjetas resumen */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                <SummaryCard
                    icon={Users}
                    label="Total"
                    value={totales.total}
                    color="bg-[#23025d]"
                    onClick={() => handleFiltroRapido("tipo", "")}
                    active={!filtros?.tipo}
                />
                <SummaryCard
                    icon={UserCheck}
                    label="Personas"
                    value={totales.personas}
                    color="bg-purple-500"
                    onClick={() => handleFiltroRapido("tipo", "persona")}
                    active={filtros?.tipo === "persona"}
                />
                <SummaryCard
                    icon={Building2}
                    label="Instituciones"
                    value={totales.instituciones}
                    color="bg-blue-500"
                    onClick={() => handleFiltroRapido("tipo", "institucion")}
                    active={filtros?.tipo === "institucion"}
                />
                <SummaryCard
                    icon={Clock}
                    label="Pend. aprobación"
                    value={totales.pendientes}
                    color="bg-orange-500"
                    onClick={() => handleFiltroRapido("estado", "pendiente_aprobacion")}
                    active={filtros?.estado === "pendiente_aprobacion"}
                />
                <SummaryCard
                    icon={Ban}
                    label="Inactivos"
                    value={totales.inactivos}
                    color="bg-red-500"
                    onClick={() => handleFiltroRapido("estado", "inactivo")}
                    active={filtros?.estado === "inactivo"}
                />
            </div>

            {/* Filtros */}
            <form onSubmit={handleFiltrar} className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
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
                    <option value="persona">Persona</option>
                    <option value="institucion">Institución</option>
                    <option value="admin">Admin</option>
                </select>
                <select
                    value={data.estado}
                    onChange={(e) => setData("estado", e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#23025d]/30"
                >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="pendiente_verif">Pend. verificación email</option>
                    <option value="pendiente_datos">Pend. datos</option>
                    <option value="pendiente_aprobacion">Pend. aprobación</option>
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
                {usuarios.data.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No se encontraron usuarios.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium">Usuario</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden sm:table-cell">Tipo</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Ubicación</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Estado</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {usuarios.data.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={u.profile_photo_url ?? "/storage/profile-photos/default-avatar.webp"}
                                                alt=""
                                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-800 truncate">{u.nombre ?? "—"}</p>
                                                <p className="text-gray-400 text-xs truncate">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 hidden sm:table-cell">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${TIPO_BADGE[u.tipo_usuario] ?? "bg-gray-100 text-gray-600"}`}>
                                            {u.tipo_usuario}
                                        </span>
                                        {u.tipo_usuario === "institucion" && u.institucion?.verificado && (
                                            <span className="ml-1 text-xs text-blue-500" title="Verificada">✓</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-500 text-xs hidden md:table-cell">
                                        {[u.ciudad, u.provincia].filter(Boolean).join(", ") || "—"}
                                    </td>
                                    <td className="px-5 py-3.5 hidden lg:table-cell">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_BADGE[u.estado] ?? "bg-gray-100 text-gray-600"}`}>
                                            {ESTADO_LABEL[u.estado] ?? u.estado}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <Link
                                            href={route("admin.usuarios.show", u.id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#23025d] bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination links={usuarios.links} />
        </AdminLayout>
    );
}

function SummaryCard({ icon: Icon, label, value, color, onClick, active }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                active
                    ? "border-[#23025d] bg-[#23025d]/5 shadow-sm"
                    : "border-gray-100 bg-white hover:shadow-sm"
            }`}
        >
            <div className={`${color} w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
                <p className="text-lg font-bold text-gray-800 leading-tight">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </button>
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
