import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, Link } from "@inertiajs/react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function CreateAdmin() {
    const { data, setData, post, processing, errors } = useForm({
        nombre:                "",
        email:                 "",
        password:              "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.usuarios.store-admin"));
    };

    return (
        <AdminLayout title="Nuevo administrador">
            <div className="mb-5">
                <Link
                    href={route("admin.usuarios.index")}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a usuarios
                </Link>
            </div>

            <div className="max-w-lg">
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                        <ShieldCheck className="w-5 h-5 text-[#23025d]" />
                        <h2 className="font-semibold text-gray-800">Nuevo administrador</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Field label="Nombre *" error={errors.nombre}>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData("nombre", e.target.value)}
                                className={input(errors.nombre)}
                                placeholder="Nombre completo"
                                autoFocus
                            />
                        </Field>

                        <Field label="Email *" error={errors.email}>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className={input(errors.email)}
                                placeholder="admin@ejemplo.com"
                            />
                        </Field>

                        <Field label="Contraseña *" error={errors.password}>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className={input(errors.password)}
                                placeholder="Mínimo 8 caracteres"
                            />
                        </Field>

                        <Field label="Confirmar contraseña *" error={errors.password_confirmation}>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                className={input(errors.password_confirmation)}
                                placeholder="Repetí la contraseña"
                            />
                        </Field>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#23025d] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#3a0499] transition-colors disabled:opacity-60"
                            >
                                {processing ? "Creando..." : "Crear administrador"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

const input = (error) =>
    `w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#23025d]/30 ${
        error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`;

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
