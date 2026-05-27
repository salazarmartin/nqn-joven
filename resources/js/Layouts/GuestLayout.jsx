export default function GuestLayout({ children }) {
    return (
        <div
            style={{
                backgroundImage: "url('/images/fondo.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
        >
            {/* Overlay suave con el azul de la app */}
            <div className="absolute inset-0" style={{ background: "rgba(0,217,250,0.45)" }} />

            <div className="relative z-10 w-full flex items-center justify-center px-4 py-8">
                {children}
            </div>
        </div>
    );
}
