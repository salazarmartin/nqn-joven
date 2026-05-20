import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";

export default function () {
    return (
        <GuestLayout>
            <Head title="Bienvenido"></Head>

            <div className="text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-8">

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center leading-tight">
                    
                </h1>

                <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                    <p className="text-sm sm:text-base md:text-lg text-center px-4">
                        
                    </p>
                    
                </div>

                <div className="mt-8 sm:mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                    <Link 
                        href={route('register')} 
                        className="w-full sm:w-auto text-white font-bold rounded-3xl py-3 px-8 sm:px-12 md:px-16 text-center hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base" style={{background:"#5d4dff"}}
                    >
                        Crear una cuenta
                    </Link>

                    <Link 
                        href={route('login')} 
                        className="w-full sm:w-auto text-white font-bold rounded-3xl py-3 px-8 sm:px-12 md:px-16 text-center hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base" style={{background:"#5d4dff"}}
                    >
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
