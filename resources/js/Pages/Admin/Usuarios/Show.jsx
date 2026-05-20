import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { ArrowLeft, BadgeCheck, Ban, Trash2, ShieldCheck, Mail, Phone, MapPin, Calendar, Globe, Building2 } from "lucide-react";

const ESTADO_OPTIONS = [
    { value: "activo",               label: "Activo" },
    { value: "inactivo",             label: "Inactivo" },
    { value: "pendiente_verif",      label: "Pendiente verificación email" },
    { value: "pendiente_datos",      label: "Pendiente completar datos" },
    { value: "pendiente_aprobacion", label: "Pendiente aprobación" },
];

const ESTADO_COLOR = {
    activo:               "text-green-600 bg-green-50 border-green-200",
    inactivo:             "text-red-600 bg-red-50 border-red-200",
    pendiente_verif:      "text-yellow-600 bg-yellow-50 border-yellow-200",
    pendiente_datos:      "text-blue-600 bg-blue-50 border-blue-200",
    pendiente_aprobacion: "text-orange-600 bg-orange-50 border-orange-200",
};

export default function UsuarioShow({ usuario }) {
    const { data, setData, patch, processing } = useForm({
        estado: usuario.estado,
    });

    const handleEstado = (e) => {
        e.preventDefault();
        patch(route("admin.usuarios.estado", usuario.id));
    };

    const handleVerificar = () => {
        if (!confirm("¿Verificar esta institución y activar la cuenta?")) return;
        router.patch(route("admin.usuarios.verificar", usuario.id));
    };

    const handleEliminar = () => {
        if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
        router.delete(route("admin.usuarios.destroy", usuario.id));
    };

    const perfil = usuario.tipo_usuario === "persona" ? usuario.persona : usuario.institucion;

    return (
        <AdminLayout title="Detalle de usuario">
            <div className="mb-5">
                <Link
                    href={route("admin.usuarios.index")}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a usuarios
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna principal */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Cabecera del usuario */}
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex items-start gap-5">
                        <img
                            src={usuario.profile_photo_url ?? "/storage/profile-photos/default-avatar.webp"}
                            alt=""
                            className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xl font-bold text-gray-800">{usuario.nombre ?? "Sin nombre"}</h2>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${ESTADO_COLOR[usuario.estado] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                    {ESTADO_OPTIONS.find(o => o.value === usuario.estado)?.label ?? usuario.estado}
                                </span>
                                {usuario.tipo_usuario === "institucion" && usuario.institucion?.verificado && (
                                    <span className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                                        <BadgeCheck className="w-4 h-4" /> Verificada
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 text-sm mt-1 capitalize">{usuario.tipo_usuario}</p>

                            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{usuario.email}</span>
                                {usuario.telefono && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{usuario.telefono}</span>}
                                {(usuario.ciudad || usuario.provincia) && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        {[usuario.ciudad, usuario.provincia].filter(Boolean).join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Datos del perfil */}
                    {perfil && (
                        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3 mb-4">
                                {usuario.tipo_usuario === "persona" ? "Perfil personal" : "Perfil de institución"}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                {usuario.tipo_usuario === "persona" ? (
                                    <>
                                        {perfil.apellido && <InfoRow label="Apellido" value={perfil.apellido} />}
                                        {perfil.fecha_nac && <InfoRow label="Fecha de nac." value={perfil.fecha_nac} icon={Calendar} />}
                                        {perfil.dni && <InfoRow label="DNI" value={perfil.dni} />}
                                        {perfil.region && <InfoRow label="Región" value={perfil.region.nombre} icon={MapPin} />}
                                        {perfil.biografia && (
                                            <div className="sm:col-span-2">
                                                <p className="text-xs text-gray-400 mb-1">Biografía</p>
                                                <p className="text-gray-600">{perfil.biografia}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {perfil.razon_social && <InfoRow label="Razón social" value={perfil.razon_social} icon={Building2} />}
                                        {perfil.tipo_institucion && <InfoRow label="Tipo" value={perfil.tipo_institucion} />}
                                        {perfil.direccion && <InfoRow label="Dirección" value={perfil.direccion} icon={MapPin} />}
                                        {perfil.email_contacto && <InfoRow label="Email de contacto" value={perfil.email_contacto} icon={Mail} />}
                                        {perfil.url_sitio_web && <InfoRow label="Sitio web" value={perfil.url_sitio_web} icon={Globe} link />}
                                        {perfil.region && <InfoRow label="Región" value={perfil.region.nombre} icon={MapPin} />}
                                        {perfil.ano_fundacion && <InfoRow label="Año fundación" value={perfil.ano_fundacion} />}
                                        {perfil.descripcion && (
                                            <div className="sm:col-span-2">
                                                <p className="text-xs text-gray-400 mb-1">Descripción</p>
                                                <p className="text-gray-600">{perfil.descripcion}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Panel de acciones */}
                <div className="space-y-5">
                    {/* Cambiar estado */}
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                        <h3 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3 mb-4">
                            Cambiar estado
                        </h3>
                        <form onSubmit={handleEstado} className="space-y-3">
                            <select
                                value={data.estado}
                                onChange={(e) => setData("estado", e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#23025d]/30"
                            >
                                {ESTADO_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={processing || data.estado === usuario.estado}
                                className="w-full bg-[#23025d] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#3a0499] transition-colors disabled:opacity-50"
                            >
                                Guardar estado
                            </button>
                        </form>
                    </div>

                    {/* Verificar institución */}
                    {usuario.tipo_usuario === "institucion" && !usuario.institucion?.verificado && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                            <h3 className="font-semibold text-orange-700 text-sm mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Verificación pendiente
                            </h3>
                            <p className="text-orange-600 text-xs mb-3">
                                Esta institución está esperando aprobación manual.
                            </p>
                            <button
                                onClick={handleVerificar}
                                className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <BadgeCheck className="w-4 h-4" />
                                Aprobar institución
                            </button>
                        </div>
                    )}

                    {/* Zona peligrosa */}
                    <div className="bg-white border border-red-100 rounded-xl p-5">
                        <h3 className="font-semibold text-red-600 text-sm mb-3">Zona peligrosa</h3>
                        <button
                            onClick={handleEliminar}
                            className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Eliminar usuario
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function InfoRow({ label, value, icon: Icon, link }) {
    return (
        <div>
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            {link ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm flex items-center gap-1">
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span className="truncate">{value}</span>
                </a>
            ) : (
                <p className="text-gray-700 text-sm flex items-center gap-1">
                    {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
                    {value}
                </p>
            )}
        </div>
    );
}
