import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";
import {
    LayoutDashboard,
    CalendarDays,
    Link2,
    Newspaper,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";

const navItems = [
    { label: "Dashboard",      href: "admin.dashboard",           icon: LayoutDashboard },
    { label: "Usuarios",       href: "admin.usuarios.index",      icon: Users },
    { label: "Noticias",  href: "admin.noticias.index", icon: Newspaper },
    { label: "Eventos",        href: "admin.eventos.index",       icon: CalendarDays },
    { label: "Links de interés", href: "admin.links.index",       icon: Link2 },
];

function NavLink({ item, current }) {
    const Icon = item.icon;
    const active = current.startsWith(route(item.href));

    return (
        <Link
            href={route(item.href)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
            {active && <ChevronRight className="w-4 h-4 ml-auto" />}
        </Link>
    );
}

export default function AdminLayout({ title, children }) {
    const { auth, flash } = usePage().props;
    const current = window.location.href;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        router.post(route("logout"));
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <Toaster position="top-right" />

            {/* Sidebar desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-[#23025d] shadow-xl">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                    <img src="/images/logo-nqnjoven.png" alt="NQN Joven" className="h-8 w-auto" />
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">NQN Joven</p>
                        <p className="text-white/50 text-xs">Panel Admin</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink key={item.href} item={item} current={current} />
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                            {auth?.user?.nombre?.[0]?.toUpperCase() ?? "A"}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{auth?.user?.nombre ?? "Admin"}</p>
                            <p className="text-white/50 text-xs truncate">{auth?.user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Sidebar mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-64 bg-[#23025d] flex flex-col z-50">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <img src="/images/logo-nqnjoven.png" alt="NQN Joven" className="h-8 w-auto" />
                                <p className="text-white font-bold text-sm">Panel Admin</p>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="text-white/70 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex-1 p-4 space-y-1">
                            {navItems.map((item) => (
                                <NavLink key={item.href} item={item} current={current} />
                            ))}
                        </nav>
                        <div className="p-4 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                Cerrar sesión
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden text-gray-500 hover:text-gray-700"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
                </header>

                {/* Flash messages */}
                {flash?.message && (
                    <div className="mx-6 mt-4 px-4 py-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
                        {flash.message}
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                        {flash.error}
                    </div>
                )}

                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
