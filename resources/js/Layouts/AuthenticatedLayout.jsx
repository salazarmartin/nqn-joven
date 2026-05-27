import { useState, useEffect } from "react";
import Header from "@/Components/Header/Header";
import Sidebar from "@/Components/Sidebard/Sidebard";

import { Toaster } from "react-hot-toast";
import BackButton from "@/Components/BackButton";
import { usePage, router } from '@inertiajs/react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import MobileBottomNav from "@/Components/Header/MobileBottomNav";

export default function AuthenticatedLayout({
    header,
    children,
    noDecorations = false,
    maxWidth = "max-w-4xl"
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { auth, notificacionesIniciales = [], unreadCount, unreadMessagesCount } = usePage().props;
    const user = auth?.user;

    const [notificaciones, setNotificaciones] = useState(notificacionesIniciales || []);
    const [contadorRojo, setContadorRojo] = useState(unreadCount || 0);
    const pageProps = usePage().props;
    const userType = pageProps.userType;

    // Definimos Pusher/Echo y eventos globales
    useEffect(() => {
        if (!user) return;

        window.authUserId = user.id;

        if (!import.meta.env.VITE_PUSHER_APP_KEY) return;

        window.Pusher = Pusher;

        window.Echo = new Echo({
            broadcaster: "pusher",
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
        });

        const channel = window.Echo.private(`user.${user.id}`);
        channel.subscribed(() => console.log(`Suscripto a user.${user.id}`));
        channel.error(err => console.error('Error en canal user:', err));

        channel.listen(".MensajeEnviado", payload => {
            window.dispatchEvent(new CustomEvent("mensaje-nuevo-chatpage", {
                detail: payload
            }));
            window.dispatchEvent(new Event("mensaje-recibido"));
        });

        channel.listen(".MensajeLeido", e => {
            if (window.__setChatPageRerender) {
                window.__setChatPageRerender(Date.now());
            }
        });

        return () => {
            try {
                channel.stopListening(".MensajeEnviado");
                channel.unsubscribe && channel.unsubscribe();
            } catch (e) {}
        };
    }, [user]);

    // Actualiza el contador rojo del Header al recibir mensajes
    useEffect(() => {
        const handler = () => {
            router.reload({ only: ["unreadCount", "unreadMessagesCount"] });
        };
        window.addEventListener("mensaje-recibido", handler);
        return () => window.removeEventListener("mensaje-recibido", handler);
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col dark:bg-gray-900 transition-colors">

            {/* Decoraciones NQN — solo en los costados, sin invadir el contenido central */}
            {!noDecorations && (
                <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
                    {/* Costado izquierdo */}
                    <img src="/images/iconos/Recurso araucaria degrade 3.png"
                        className="absolute top-20 -left-16 w-56 h-56 object-contain opacity-25 rotate-12" />
                    <img src="/images/iconos/Recurso amancay degrade 2.png"
                        className="absolute top-1/2 -left-16 w-52 h-52 object-contain opacity-25 -rotate-6" />
                    <img src="/images/iconos/Recurso huella degrade 2.png"
                        className="absolute bottom-16 -left-14 w-48 h-48 object-contain opacity-20 rotate-6" />
                    {/* Costado derecho */}
                    <img src="/images/iconos/Recurso amancay degrade 4.png"
                        className="absolute top-20 -right-16 w-56 h-56 object-contain opacity-25 -rotate-12" />
                    <img src="/images/iconos/lanin verde.png"
                        className="absolute top-1/2 -right-14 w-48 h-48 object-contain opacity-20 rotate-6" />
                    <img src="/images/iconos/Recurso sol degrade 2.png"
                        className="absolute bottom-16 -right-16 w-52 h-52 object-contain opacity-20 -rotate-6" />
                </div>
            )}

            <Header
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                notificaciones={notificaciones}
            />

            {/* <BackButton /> */}

            {/* Contenedor principal con 3 columnas */}
            <div className="flex flex-1 bg-gray-50 dark:bg-gray-900">
                {/* Sidebar izquierdo */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    unreadCount={unreadCount}
                />

                {/* Contenido central */}
                <main className="flex-1 overflow-y-auto">
                    {header && (
                        <div>
                            <div className={`${maxWidth === "w-full" ? "w-full" : `mx-auto ${maxWidth} px-4 py-6 sm:px-6 lg:px-8`}`}>
                                {header}
                            </div>
                        </div>
                    )}
                    <div className={`${maxWidth === "w-full" ? "w-full h-full" : `mx-auto ${maxWidth} px-4 py-6 sm:px-6 lg:px-8`}`}>
                        {children}
                    </div>
                </main>

                
            </div>

            {/* Navegación móvil inferior */}
            <MobileBottomNav onToggleSidebar={() => setSidebarOpen(true)} />

            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                        borderRadius: "12px",
                        padding: "16px",
                        fontSize: "14px",
                    },
                }}
            />
        </div>
    );
}