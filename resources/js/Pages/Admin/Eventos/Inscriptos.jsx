import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Users, Download } from "lucide-react";

export default function Inscriptos({ evento, inscriptos, total }) {
    const exportarCSV = () => {
        const headers = ["Nombre", "Apellido", "DNI", "Email", "Provincia", "Fecha inscripción"];
        const rows = inscriptos.map((i) => [
            i.nombre ?? "",
            i.apellido ?? "",
            i.dni ?? "",
            i.email ?? "",
            i.provincia ?? "",
            i.created_at ?? "",
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `inscriptos-${evento.id}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AdminLayout title={`Inscriptos — ${evento.titulo}`}>
            <div className="mb-5 flex items-center justify-between">
                <Link
                    href={route("admin.eventos.index")}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a eventos
                </Link>
                {inscriptos.length > 0 && (
                    <button
                        onClick={exportarCSV}
                        className="flex items-center gap-2 bg-[#23025d] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a0499] transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Exportar CSV
                    </button>
                )}
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">{evento.titulo}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{total} inscripto{total !== 1 ? "s" : ""}</span>
                    {evento.cupos && (
                        <span className="text-gray-400">/ {evento.cupos} cupos</span>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {inscriptos.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Aún no hay inscriptos para este evento.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium">Nombre</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">DNI</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Email</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Provincia</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Inscripto el</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {inscriptos.map((ins) => (
                                <tr key={ins.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-gray-800">
                                            {ins.nombre} {ins.apellido}
                                        </p>
                                        <p className="text-xs text-gray-400 md:hidden">{ins.email}</p>
                                    </td>
                                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">
                                        {ins.dni ?? <span className="text-gray-300">—</span>}
                                    </td>
                                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{ins.email}</td>
                                    <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">
                                        {ins.provincia ?? <span className="text-gray-300">—</span>}
                                    </td>
                                    <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{ins.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
}
