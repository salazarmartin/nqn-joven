import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, Link } from "@inertiajs/react";
import { ArrowLeft, Upload } from "lucide-react";

export default function PublicacionForm({ noticia, regiones, categorias }) {
    const isEditing = !!noticia;

    const { data, setData, post, put, processing, errors } = useForm({
        titulo:       noticia?.titulo       ?? "",
        contenido:    noticia?.contenido    ?? "",
        resumen:      noticia?.resumen      ?? "",
        link_externo: noticia?.link_externo ?? "",
        publicado:    noticia?.publicado    ?? true,
        destacado:    noticia?.destacado    ?? false,
        region_id:    noticia?.region_id    ?? "",
        categoria_id: noticia?.categoria_id ?? "",
        imagen:       noticia?.imagen     ?? "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.noticias.update", noticia.id));
        } else {
            post(route("admin.noticias.store"));
        }
    };

    const toggleCategoria = (id) => {
        const current = data.categorias ?? [];
        setData(
            "categorias",
            current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
        );
    };

    return (
        <AdminLayout title={isEditing ? "Editar novedad" : "Nueva novedad"}>
            <div className="mb-5">
                <Link
                    href={route("admin.noticias.index")}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a noticias
                </Link>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna principal */}
                    <div className="lg:col-span-2 space-y-5">
                        <Card title="Contenido de la novedad">
                            <Field label="Título *" error={errors.titulo}>
                                <input
                                    type="text"
                                    value={data.titulo}
                                    onChange={(e) => setData("titulo", e.target.value)}
                                    className={input(errors.titulo)}
                                    placeholder="Título de la novedad"
                                />
                            </Field>

                            <Field label="Resumen" error={errors.resumen}>
                                <textarea
                                    value={data.resumen}
                                    onChange={(e) => setData("resumen", e.target.value)}
                                    rows={2}
                                    className={input(errors.resumen)}
                                    placeholder="Breve descripción que aparece en listados (máx. 500 caracteres)"
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">{data.resumen.length}/500</p>
                            </Field>

                            <Field label="Contenido *" error={errors.contenido}>
                                <textarea
                                    value={data.contenido}
                                    onChange={(e) => setData("contenido", e.target.value)}
                                    rows={10}
                                    className={input(errors.contenido)}
                                    placeholder="Escribí el contenido completo de la novedad..."
                                />
                            </Field>

                            <Field label="Link externo (opcional)" error={errors.link_externo}>
                                <input
                                    type="url"
                                    value={data.link_externo}
                                    onChange={(e) => setData("link_externo", e.target.value)}
                                    className={input(errors.link_externo)}
                                    placeholder="https://..."
                                />
                            </Field>
                        </Card>

                        <Card title="Imagen de portada">
                            <Field label="Imagen" error={errors.imagen}>
                                {isEditing && noticia.imagen && (
                                    <img
                                        src={`/storage/${noticia.imagen}`}
                                        alt="Imagen actual"
                                        className="w-full h-48 object-cover rounded-lg mb-3"
                                    />
                                )}
                                <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#23025d] transition-colors">
                                    <Upload className="w-8 h-8 text-gray-300" />
                                    <span className="text-sm text-gray-500">
                                        {data.imagen ? data.imagen.name : "Hacer clic para subir imagen (max 3MB)"}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={(e) => setData("imagen", e.target.files[0])}
                                    />
                                </label>
                            </Field>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        <Card title="Publicación">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.publicado}
                                    onChange={(e) => setData("publicado", e.target.checked)}
                                    className="w-4 h-4 accent-[#23025d]"
                                />
                                <span className="text-sm text-gray-700">Publicar (visible en la app)</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.destacado}
                                    onChange={(e) => setData("destacado", e.target.checked)}
                                    className="w-4 h-4 accent-yellow-500"
                                />
                                <span className="text-sm text-gray-700">Destacar novedad</span>
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
                            {processing ? "Guardando..." : isEditing ? "Guardar cambios" : "Publicar novedad"}
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
