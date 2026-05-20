import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function EventoForm({ evento, regiones, categorias }) {
    const isEditing = !!evento;

    const { data, setData, post, put, processing, errors } = useForm({
        titulo:       evento?.titulo       ?? "",
        descripcion:  evento?.descripcion  ?? "",
        lugar:        evento?.lugar        ?? "",
        fecha:        evento?.fecha        ?? "",
        hora:         evento?.hora         ?? "",
        modalidad:    evento?.modalidad    ?? "presencial",
        link_externo: evento?.link_externo ?? "",
        publicado:    evento?.publicado    ?? false,
        destacado:    evento?.destacado    ?? false,
        region_id:    evento?.region_id    ?? "",
        categoria_id: evento?.categoria_id ?? "",
        imagen:       evento?.imagen     ?? "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.eventos.update", evento.id));
        } else {
            post(route("admin.eventos.store"));
        }
    };

    return (
        <AdminLayout title={isEditing ? "Editar evento" : "Nuevo evento"}>
            <div className="mb-5">
                <Link
                    href={route("admin.eventos.index")}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a eventos
                </Link>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna principal */}
                    <div className="lg:col-span-2 space-y-5">
                        <Card title="Información básica">
                            <Field label="Título *" error={errors.titulo}>
                                <input
                                    type="text"
                                    value={data.titulo}
                                    onChange={(e) => setData("titulo", e.target.value)}
                                    className={input(errors.titulo)}
                                    placeholder="Nombre del evento"
                                />
                            </Field>

                            <Field label="Descripción" error={errors.descripcion}>
                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) => setData("descripcion", e.target.value)}
                                    rows={4}
                                    className={input(errors.descripcion)}
                                    placeholder="Descripción detallada del evento..."
                                />
                            </Field>

                            <Field label="Lugar *" error={errors.lugar}>
                                <input
                                    type="text"
                                    value={data.lugar}
                                    onChange={(e) => setData("lugar", e.target.value)}
                                    className={input(errors.lugar)}
                                    placeholder="Ciudad, dirección o plataforma virtual"
                                />
                            </Field>

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Fecha *" error={errors.fecha}>
                                    <input
                                        type="date"
                                        value={data.fecha}
                                        onChange={(e) => setData("fecha", e.target.value)}
                                        className={input(errors.fecha)}
                                    />
                                </Field>
                                <Field label="Hora *" error={errors.hora}>
                                    <input
                                        type="time"
                                        value={data.hora}
                                        onChange={(e) => setData("hora", e.target.value)}
                                        className={input(errors.hora)}
                                    />
                                </Field>
                            </div>

                            <Field label="Link externo" error={errors.link_externo}>
                                <input
                                    type="url"
                                    value={data.link_externo}
                                    onChange={(e) => setData("link_externo", e.target.value)}
                                    className={input(errors.link_externo)}
                                    placeholder="https://..."
                                />
                            </Field>
                        </Card>

                        <Card title="Imagen del evento">
                            <Field label="Imagen" error={errors.imagen}>
                                {isEditing && evento.imagen && (
                                    <img
                                        src={`/storage/${evento.imagen}`}
                                        alt="Imagen actual"
                                        className="w-full h-40 object-cover rounded-lg mb-3"
                                    />
                                )}
                                <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#23025d] transition-colors">
                                    <Upload className="w-8 h-8 text-gray-300" />
                                    <span className="text-sm text-gray-500">
                                        {data.imagen ? data.imagen.name : "Hacer clic para subir imagen (max 2MB)"}
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
                            <Field label="Modalidad *" error={errors.modalidad}>
                                <select
                                    value={data.modalidad}
                                    onChange={(e) => setData("modalidad", e.target.value)}
                                    className={input(errors.modalidad)}
                                >
                                    <option value="presencial">Presencial</option>
                                    <option value="virtual">Virtual</option>
                                    <option value="hibrida">Híbrida</option>
                                </select>
                            </Field>

                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.publicado}
                                    onChange={(e) => setData("publicado", e.target.checked)}
                                    className="w-4 h-4 accent-[#23025d]"
                                />
                                <span className="text-sm text-gray-700">Publicar evento</span>
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
                            {processing ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear evento"}
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
