import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {Bell, QrCode, User, Home, Search, MapPin, Plus, X } from "lucide-react";
import BarraBusqueda from "@/Components/BarraBusqueda/BarraBusqueda";
import VerQR from "@/Pages/Profile/Partials/VerQR";

function SearchModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex flex-col">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal content - ahora usa flex-col y permite scroll */}
            <div className="relative w-full max-w-lg mx-auto mt-4 px-4 flex flex-col max-h-[90vh]">
                {/* Header fijo */}
                <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Buscar
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X
                                size={20}
                                className="text-gray-500 dark:text-gray-400"
                            />
                        </button>
                    </div>
                </div>

                {/* Contenedor de búsqueda - permite que el dropdown se expanda */}
                <div className="bg-white dark:bg-gray-800 flex-1 overflow-visible">
                    <div className="p-4 pb-2">
                        <BarraBusqueda variant="global" autoFocus={true} />
                    </div>

                    <div className="px-4 pb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Buscá instituciones o noticias de tu interés.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QRModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex flex-col">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal content */}
            <div className="relative w-full max-w-lg mx-auto mt-4 px-4 flex flex-col max-h-[90vh]">
                {/* Header fijo */}
                <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X
                                size={20}
                                className="text-gray-500 dark:text-gray-400"
                            />
                        </button>
                    </div>
                </div>

                {/* Contenedor de búsqueda - permite que el dropdown se expanda */}
                <div className="bg-white dark:bg-gray-800 flex-1 overflow-visible">
                    <div className="pt-12 pb-12">
                        <VerQR
                            className="max-w-xl"
                            
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function MobileBottomNav({ onToggleSidebar }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isInstitucion = user?.tipo_usuario === "institucion";
    const esJoven = user?.tipo_usuario === "persona";
    const [searchOpen, setSearchOpen] = useState(false);
    const [QROpen, setQROpen] = useState(false);

    const navItems = [
        {
            href: "/inicio",
            icon: Home,
            label: "Inicio",
            active: route().current("inicio"),
        },
        {
            href: "/mapa",
            icon: MapPin,
            label: "Ubicaciones",
            active: route().current("ubicaciones.*"),
        },
        {
            href: "/notificaciones/explorar/noticias/todas/todas",
            icon: Search,
            label: "Explorar",
            active: route().current("notificaciones/explorar.*"),
        },
        {
            href: "/notificaciones",
            icon: Bell,
            label: "Perfil",
            active: route().current("notificaciones/todas"),
        },
        {
            href: "/profile",
            icon: User,
            label: "Perfil",
            active: route().current("profile.*"),
        },
    ];

    return (
        <>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom" style={{background:"#5d4dff"}}>
                <div className="flex items-center justify-around h-16 px-2 relative">
                    {/* Home */}
                    <Link
                        href={navItems[0].href}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                            navItems[0].active
                                ? "text-white"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        <Home
                            size={24}
                            color={navItems[2].active ?"white" : "#cccccc"}
                            strokeWidth={navItems[0].active ? 2.5 : 2}
                            fill={navItems[0].active ? "currentColor" : "none"}
                        />
                    </Link>

                    {/* Explorar */}    
                    <a
                        href="/notificaciones/explorar/noticias/todas/todas"
                        className="flex items-center justify-center p-1"
                    >
                        <Search
                            size={24}
                            color={navItems[2].active ?"white" : "#cccccc"}
                            strokeWidth={navItems[2].active ? 2.5 : 2}
                            fill={navItems[2].active ? "white" : "none"}
                        />
                        
                    </a>


                    
                    
                        <button
                            onClick={() => setQROpen(true)}
                            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                        >
                            <QrCode
                            size={24}
                            strokeWidth={2}
                            fill={"none"}
                        />
                        </button>
                    

                    {/* Espaciador  */}
                    {<div className="w-14" />}

                    {/* Notificaciones */}
                    <a
                        href="/notificaciones/todas"
                        className="flex items-center justify-center p-1"
                    >
                        <Bell
                            size={24}
                            color={navItems[3].active ?"white" : "#cccccc"}
                            strokeWidth={navItems[3].active ? 2.5 : 2}
                            fill={navItems[3].active ? "white" : "none"}
                        />
                    </a>

                    {/* perfil */}
                    <a
                        href="/profile"
                        className="flex items-center justify-center p-1"
                    >
                        <User
                            size={24}
                            color={navItems[4].active ?"white" : "#cccccc"}
                            strokeWidth={navItems[4].active ? 2.5 : 2}
                            fill={navItems[4].active ? "white" : "none"}
                        />
                        
                    </a>
                </div>
            </nav>

            {/* Modal de búsqueda */}
            <SearchModal
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
            />

            {/* Modal de búsqueda */}
            <QRModal
                isOpen={QROpen}
                onClose={() => setQROpen(false)}
            />
        </>
    );
}
