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

import UpdatePasswordForm from "./Partials/UpdatePasswordForm";

import AgregarResidencia from "./Partials/AgregarResidencia";
import EditarPerfilPersona from "./Partials/EditarPerfilPersona";
import VerQR from "./Partials/VerQR";
import EditarPerfilInstitucion from "./Partials/EditarPerfilInstitucion";
import ActualizarFotoPerfil from "./Partials/ActualizarFotoPerfil";

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

export default function Edit({ auth, residencias = [] }) {
    const { props } = usePage();
    const { regiones } = props;
    const { estudios } = props;
    const { persona } = props;
    const { region } = props;
    const { estudio } = props;

    const esInstitucion = auth.user?.tipo_usuario === "institucion";
    const esJoven = auth.user?.tipo_usuario === "persona";
    const [seccionAbierta, setSeccionAbierta] = useState(null);

    const toggleSeccion = (seccion) => {
        setSeccionAbierta(seccionAbierta === seccion ? null : seccion);
    };

    

    
    return (
        <AuthenticatedLayout
            user={auth.user}
            noDecorations
        >
            <Head title="Editar Perfil" />

                    <div className="bg-white py-4 dark:bg-gray-800 border border-gray-200 dark:border-gray-700  flex flex-col sm:flex-row items-center gap-4 transition-colors"  
                        style={{margin: "-25px", 
                        background:
                                "linear-gradient(90deg, #5d4dff 10%,  #0a0236 100%, rgba(237, 221, 83, 1) 90%)"
                        }}>
                        <ActualizarFotoPerfil
                            currentPhoto={auth.user.profile_photo_url}
                        />
                        <div className="w-full sm:flex-1 flex flex-col sm:flex-row items-center ">
                            {esJoven? (
                            <h3 className="text-xl sm:text-2xl font-bold text-white dark:text-white">
                                {auth.user.nombre} {auth.user.persona.apellido}
                            </h3>
                            ):(
                            <h3 className="text-xl sm:text-2xl font-bold text-white dark:text-white">
                                {auth.user.nombre} 
                            </h3>
                            )}
                            {esInstitucion ? (
                                <>
                                    <p className="text-white dark:text-gray-400 font-medium">
                                        {props.institucion?.tipo_institucion ||
                                            "Institución"}
                                    </p>
                                    <p className="text-white dark:text-gray-400 text-sm mt-1">
                                        {auth.user.email}
                                    </p>
                                </>
                            ) : (
                                <p className="text-white dark:text-gray-300">
                                    {auth.user.email}
                                </p>
                            )}
                            <div className="my-2 max-w-max rounded-full" style={{
                                    background:
                                    "#2BEAFF",  
                                    width:
                                    "80px"
                                }}>
                                    <p className="ml-1 mr-1 text-sm xs:text-2xs font-bold" style={{
                                        color:
                                        "#322B94",
                                    }}> 
                                        &#9679; {auth.user.estado}
                                    </p>
                            </div>
                            
                        </div>
                    </div>

            <div className="py-4 mt-7 mb-14">
                <div className="mx-auto max-w-4xl space-y-4 px-4 sm:px-6 lg:px-8">
                    

                    <div className="grid grid-cols-1 gap-4">


                        <div className="border border-gray-200 dark:text-white dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-colors">
                            <p className="p-2 font-bold ">
                                <b>Mis datos</b>
                            </p>

                            

                            <div className="p-2 grid grid-cols-2 gap-4 ">

                                <div className="text-sm xs:text-2xs ">
                                    <p>
                                        <b>Edad:</b> <CalculoEdad fechaNacimiento={persona.fecha_nac} />
                                    </p>
                                </div>
                                    
                                <div className="text-sm xs:text-2xs ">
                                    <p>
                                        <b>DNI:</b> {auth.user.persona.dni}
                                    </p>
                                </div>
                                
                                <div className="text-sm xs:text-2xs ">
                                    <p>
                                        <b>Provincia:</b> {auth.user.provincia}
                                    </p>
                                </div>

                                <div className="text-sm xs:text-2xs ">
                                    <p>   
                                        <b>Región:</b> {region.nombre}
                                    </p>
                                </div>

                                <div className="text-sm xs:text-2xs ">
                                    <p>
                                        <b>Estudios:</b> {auth.user.persona.estudio?.nombre}
                                    </p>
                                </div>

                                <div className="text-sm xs:text-2xs ">
                                    <p>
                                        <b>Trabaja/emprende:</b> {auth.user.persona.trabaja_emprende}
                                    </p>
                                </div>
                            </div> 
                            
                        </div>
                        
                        {esJoven && (
                                                <VerQR
                                                                
                                                                onCancel={() => setSeccionAbierta(null)}
                                                            />
                        
                        )}

                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-colors">
                            <Link
                                href={route("profile.editpersona")}
                                method="get"
                                as="button"
                                className="px-5 flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold text-gray-800 dark:text-white"
                            >
                                <User size={18} />
                                Editar mi Perfil
                            </Link>
                        </div>
                        
                        
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-colors">
                            <Link
                                href={route("profile.cambiarcontrasena")}
                                method="get"
                                as="button"
                                className="px-5 flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold text-gray-800 dark:text-white"
                            >
                                <Lock size={18} />
                                Cambiar contraseña
                            </Link>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-colors">
                            <Link
                                href={route("actividad.index")}
                                method="get"
                                as="button"
                                className="px-5 flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold text-gray-800 dark:text-white"
                            >
                                <Eye size={18} />
                                Mi Actividad
                            </Link>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-colors">
                            <Link
                                href={route('favoritos.index')}
                                method="get"
                                as="button"
                                className="px-5 flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold text-gray-800 dark:text-white"
                            >
                                <Bookmark size={18} />
                                Mis Guardados
                            </Link>
                        </div>



                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-colors">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="px-5 flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-bold transition-colors text-red-900 dark:text-red-400"
                            >
                                <LogOut size={18} />
                                Cerrar Sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
