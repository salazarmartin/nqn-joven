import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function LinkForm({ link, regiones, categorias }) {
    const isEditing = !!link;

    const { data, setData, post, put, processing, errors } = useForm({
        titulo:       link?.titulo       ?? "",
        descripcion:  link?.descripcion  ?? "",
        url:          link?.url          ?? "",
        icono:        link?.icono        ?? "",
        activo:       link?.activo       ?? true,
        destacado:    link?.destacado    ?? false,
        orden:        link?.orden        ?? 0,
        region_id:    link?.region_id    ?? "",
        categoria_id: link?.categoria_id ?? "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.links.update", link.id));
        } else {
            post(route("admin.links.store"));
        }
    };

    return (
        <AdminLayout title={isEditing ? "Editar link" : "Nuevo link"}>
            <div className="mb-5">
                <Link
                    href={route("admin.links.index")}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a links
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna principal */}
                    <div className="lg:col-span-2 space-y-5">
                        <Card title="Información del link">
                            <Field label="Título *" error={errors.titulo}>
                                <input
                                    type="text"
                                    value={data.titulo}
                                    onChange={(e) => setData("titulo", e.target.value)}
                                    className={input(errors.titulo)}
                                    placeholder="Nombre del recurso"
                                />
                            </Field>

                            <Field label="Descripción" error={errors.descripcion}>
                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) => setData("descripcion", e.target.value)}
                                    rows={3}
                                    className={input(errors.descripcion)}
                                    placeholder="Breve descripción del contenido..."
                                />
                            </Field>

                            <Field label="URL *" error={errors.url}>
                                <input
                                    type="url"
                                    value={data.url}
                                    onChange={(e) => setData("url", e.target.value)}
                                    className={input(errors.url)}
                                    placeholder="https://..."
                                />
                            </Field>

                            <Field label="Ícono (nombre de ícono o emoji)" error={errors.icono}>
                                <input
                                    type="text"
                                    value={data.icono}
                                    onChange={(e) => setData("icono", e.target.value)}
                                    className={input(errors.icono)}
                                    placeholder="Ej: 📚 o book"
                                />
                            </Field>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        <Card title="Configuración">
                            <Field label="Orden de aparición" error={errors.orden}>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.orden}
                                    onChange={(e) => setData("orden", Number(e.target.value))}
                                    className={input(errors.orden)}
                                />
                            </Field>

                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.activo}
                                    onChange={(e) => setData("activo", e.target.checked)}
                                    className="w-4 h-4 accent-[#23025d]"
                                />
                                <span className="text-sm text-gray-700">Link activo (visible)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.destacado}
                                    onChange={(e) => setData("destacado", e.target.checked)}
                                    className="w-4 h-4 accent-yellow-500"
                                />
                                <span className="text-sm text-gray-700">Destacar en inicio</span>
                            </label>
                        </Card>

                        <Card title="Categorización">
                            <Field label="Región" error={errors.region_id}>
                                <select
                                    value={data.region_id}
                                    onChange={(e) => setData("region_id", e.target.value)}
                                    className={input(errors.region_id)}
                                >
                                    <option value="">Todas las regiones</option>
                                    {regiones.map((r) => (
                                        <option key={r.id} value={r.id}>{r.nombre}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Categoría" error={errors.categoria_id}>
                                <select
                                    value={data.categoria_id}
                                    onChange={(e) => setData("categoria_id", e.target.value)}
                                    className={input(errors.categoria_id)}
                                >
                                    <option value="">Sin categoría</option>
                                    {categorias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                            </Field>
                        </Card>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#23025d] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#3a0499] transition-colors disabled:opacity-60"
                        >
                            {processing ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear link"}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

const input = (error) =>
    `w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#23025d]/30 ${
        error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`;

function Card({ title, children }) {
    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-3">{title}</h3>
            {children}
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
