import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function EventoForm({ evento, regiones, categorias }) {
    const isEditing = !!evento;

    const { data, setData, post, processing, errors } = useForm({
        _method:                  isEditing ? "put" : "post",
        titulo:                   evento?.titulo       ?? "",
        descripcion:              evento?.descripcion  ?? "",
        lugar:                    evento?.lugar        ?? "",
        fecha:                    evento?.fecha        ?? "",
        hora:                     evento?.hora         ?? "",
        modalidad:                evento?.modalidad    ?? "presencial",
        link_externo:             evento?.link_externo ?? "",
        publicado:                evento?.publicado    ?? false,
        destacado:                evento?.destacado    ?? false,
        region_id:                evento?.region_id    ?? "",
        categoria_id:             evento?.categoria_id ?? "",
        imagen:                   null,
        remove_imagen:            false,
        inscripcion_habilitada:   evento?.inscripcion_habilitada   ?? false,
        cupos:                    evento?.cupos                    ?? "",
        fecha_inicio_inscripcion: evento?.fecha_inicio_inscripcion ? evento.fecha_inicio_inscripcion.substring(0, 16) : "",
        fecha_fin_inscripcion:    evento?.fecha_fin_inscripcion    ? evento.fecha_fin_inscripcion.substring(0, 16)    : "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            post(route("admin.eventos.update", evento.id));
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
                                {isEditing && evento.imagen && !data.remove_imagen && (
                                    <div className="relative mb-3">
                                        <img
                                            src={`/storage/${evento.imagen}`}
                                            alt="Imagen actual"
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setData("remove_imagen", true)}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition-colors"
                                            title="Quitar imagen"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {data.remove_imagen && (
                                    <div className="flex items-center gap-2 mb-3 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                        La imagen será eliminada al guardar.
                                        <button type="button" onClick={() => setData("remove_imagen", false)} className="ml-auto underline">
                                            Deshacer
                                        </button>
                                    </div>
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
                                        onChange={(e) => { setData("imagen", e.target.files[0]); setData("remove_imagen", false); }}
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

                        <Card title="Inscripción">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.inscripcion_habilitada}
                                    onChange={(e) => setData("inscripcion_habilitada", e.target.checked)}
                                    className="w-4 h-4 accent-[#5d4dff]"
                                />
                                <span className="text-sm text-gray-700 font-medium">Habilitar inscripción por la app</span>
                            </label>

                            {data.inscripcion_habilitada && (
                                <div className="space-y-3 mt-2">
                                    <Field label="Cupos disponibles" error={errors.cupos}>
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.cupos}
                                            onChange={(e) => setData("cupos", e.target.value)}
                                            className={input(errors.cupos)}
                                            placeholder="Dejar vacío para sin límite"
                                        />
                                    </Field>
                                    <Field label="Inicio de inscripción" error={errors.fecha_inicio_inscripcion}>
                                        <input
                                            type="datetime-local"
                                            value={data.fecha_inicio_inscripcion}
                                            onChange={(e) => setData("fecha_inicio_inscripcion", e.target.value)}
                                            className={input(errors.fecha_inicio_inscripcion)}
                                        />
                                    </Field>
                                    <Field label="Cierre de inscripción" error={errors.fecha_fin_inscripcion}>
                                        <input
                                            type="datetime-local"
                                            value={data.fecha_fin_inscripcion}
                                            onChange={(e) => setData("fecha_fin_inscripcion", e.target.value)}
                                            className={input(errors.fecha_fin_inscripcion)}
                                        />
                                    </Field>
                                </div>
                            )}
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
