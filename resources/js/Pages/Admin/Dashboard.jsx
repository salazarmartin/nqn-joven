import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";
import { CalendarDays, Link2, Newspaper, Users, UserCheck, Building2, Clock } from "lucide-react";

function StatCard({ icon: Icon, label, value, color, href }) {
    return (
        <Link href={href} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
        </Link>
    );
}

export default function Dashboard({ stats }) {
    return (
        <AdminLayout title="Dashboard">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bienvenido al panel</h2>
                <p className="text-gray-500 mt-1 text-sm">Resumen general de la plataforma NQN Joven.</p>
            </div>

            {/* Usuarios */}
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Usuarios</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Users}     label="Total usuarios"       value={stats.usuarios}      color="bg-[#23025d]" href={route("admin.usuarios.index")} />
                <StatCard icon={UserCheck} label="Personas"             value={stats.personas}      color="bg-purple-500" href={route("admin.usuarios.index") + "?tipo=persona"} />
                <StatCard icon={Building2} label="Instituciones"        value={stats.instituciones} color="bg-blue-500"   href={route("admin.usuarios.index") + "?tipo=institucion"} />
                <StatCard icon={Clock}     label="Pend. aprobación"     value={stats.pendientes}    color="bg-orange-500" href={route("admin.usuarios.index") + "?estado=pendiente_aprobacion"} />
            </div>

            {/* Contenido */}
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contenido</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard icon={Newspaper}  label="Noticias"   value={stats.noticias} color="bg-blue-500"   href={route("admin.noticias.index")} />
                <StatCard icon={CalendarDays} label="Eventos"        value={stats.eventos}       color="bg-emerald-500" href={route("admin.eventos.index")} />
                <StatCard icon={Link2}      label="Links de interés" value={stats.links}         color="bg-orange-500" href={route("admin.links.index")} />
            </div>

            {/* Acciones rápidas */}
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Acciones rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickAction icon={Clock}      title="Aprobar instituciones"   desc={`${stats.pendientes} pendiente(s)`}  href={route("admin.usuarios.index") + "?estado=pendiente_aprobacion"} color="bg-orange-500" />
                <QuickAction icon={Newspaper}  title="Moderar noticias"   desc="Revisar contenido"                   href={route("admin.noticias.index")} color="bg-blue-500" />
                <QuickAction icon={CalendarDays} title="Nuevo evento"          desc="Agregar al calendario"               href={route("admin.eventos.create")} color="bg-emerald-500" />
                <QuickAction icon={Link2}      title="Nuevo link"              desc="Agregar recurso útil"                href={route("admin.links.create")} color="bg-orange-400" />
            </div>
        </AdminLayout>
    );
}

function QuickAction({ title, desc, href, color, icon: Icon }) {
    return (
        <Link
            href={href}
            className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow flex items-start gap-3"
        >
            <div className={`${color} w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
            </div>
        </Link>
    );
}
