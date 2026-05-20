import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    User,
    Bookmark,
    QrCode,
    Lock,
    MessageCircle,
    Heart,
    FileText,
    Home,
    Eye,
    LogOut,
    ThumbsUp,
    Building2,
    BookOpen,
} from "lucide-react";




export function CalculoEdad({ fechaNacimiento }) {
  const calcularEdad = (fecha) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    // Si el cumpleaños aún no ocurrió este año, restamos 1
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  };

  const [edad] = useState(calcularEdad(fechaNacimiento));

  return <span>{edad} años</span>;
}

export default function Edit({ auth, notificaciones = [] }) {
    const notificacionesData = notificaciones?.data || [];

    const esInstitucion = auth.user?.tipo_usuario === "institucion";
    const esJoven = auth.user?.tipo_usuario === "persona";
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            
        >
            <Head title="Editar Perfil" />
                    

                        <div className="mt-5">
                            <h3 className="mb-2 text-xl sm:text-2xl font-bold text-black dark:text-white">
                                Notificaciones
                            </h3>
                            <div class="flex overflow-x-auto flex-nowrap gap-4">

                                {notificacionesData.length === 0 ? (
                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8 text-center">
                                            <p className="text-gray-600 dark:text-gray-400">
                                                No tienes notificaciones 
                                            </p>
                                        </div>
                                    ) : (
                                        notificacionesData.map((notificacion) => (

                                            <div className="flex-none w-64 h-40 bg-blue-500 mb-2 rounded-lg" style={{
                                                background: 
                                                "linear-gradient(to bottom, #dfdfdf 50%, #eeeeee 50%)"
                                            }}>
                                                <div className="h-20  flex items-center grid place-items-center">
                                                    <img
                                                        src="/svg/header/map.svg"
                                                        alt="NQN Jóven"
                                                        className="h-4 w-auto"
                                                    />
                                                </div>
                                                <div className="ml-2 h-20">
                                                    <h3 className="mb-2 text-sm xs:text-2xl font-bold text-black dark:text-white">
                                                        <b>{notificacion.titulo.substring(0, 28) + "..."}</b>
                                                    </h3>
                                                    <p className="mb-2 text-xs xs:text-2xl font-bold text-gray dark:text-white">
                                                        {notificacion.contenido.substring(0, 38) + "..."}
                                                    </p>
                                                    
                                                    <div className="my-2 max-w-fit rounded-full" style={{
                                                        background:
                                                        "#4c81b3",  
                                                        width:
                                                        "70px"
                                                    }}>
                                                        <p className="ml-1 mr-1 text-xs xs:text-2xs font-bold text-white"> 
                                                            {notificacion.categorias}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                
                            </div>
                        </div>


            <div className="py-4 mt-7 mb-8">
                <div className="mx-auto max-w-4xl space-y-4 px-4 sm:px-6 lg:px-8">
                    

                    <div className="grid grid-cols-1 gap-4">



                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
