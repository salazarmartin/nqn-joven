import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Link as IconLink } from "lucide-react";
import {Copy } from "lucide-react";
import PublicacionCard from "@/Components/Publicacion/PublicacionCard";
import AccesosDirectos from "@/Components/AccesosDirectos";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingSpinner from "@/Components/LoadingSpinner";
import { useState } from "react";

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

export default function Inicio({
    auth,
    regionNombre,
    noticias,
    userType,
    categorias,
    destacados,
    institucionesVisitadas = [],
}) {
    const noticiasData = noticias?.data || [];
    const noticiasLinks = noticias?.links || [];

    const categoriasData = categorias || [];
    const destacadosData = destacados || [];

    const nextPageUrl = noticiasLinks.find(
        (link) => link.label === "&raquo;"
    )?.url;

    const { loaderRef, isLoading } = useInfiniteScroll({ nextPageUrl });

    

    const handleLike = (noticiaId) => {
        router.post(
            "/likes/toggle",
            { target_id: noticiaId, target_tipo: "noticia" },
            { preserveScroll: true, preserveState: true }
        );
    };

    const handleFavorite = (noticiaId) => {
        router.post(
            "/favoritos/toggle",
            { noticia_id: noticiaId },
            { preserveScroll: true, preserveState: true }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            
            maxWidth="max-w-4xl"
        >
            <Head title="Inicio" />

            <div className="pb-4 mb-8">
                {userType === "persona" && (
                    <div>
                        <div className="mb-2 grid grid-cols-2 gap-4 h-full flex items-center justify-end">
                            <div>
                                <h3 className="text-2xl sm:text-2xl font-black dark:text-white">
                                    ¡Hola, {auth.user.nombre}!
                                </h3>
                                <p className="text-gray-500 font-bold dark:text-gray-200 text-sm mt-1">
                                    {auth.user.ciudad} - {auth.user.persona.region?.nombre}
                                </p>
                            </div>
                            <div className="ml-auto mb-2 rounded-full  grid place-items-center" style={{
                                border:"3px solid #c7c7c7",  background:"#35097c",  
                                width:"110px",height:"110px",
                            }}>
                                <img
                                    src={auth.user.profile_photo_url || "/svg/header/perfil.svg"}
                                    alt="img-perfil"
                                    className="rounded-full object-cover border-transparent hover:border-white transition-colors"
                                    style={{width:"106px",height:"104px"}}
                                />
                            </div>
                        </div>

                        {/* Credencial */}
                        <div className="grid grid-cols-2 gap-4 h-full flex items-center justify-end p-4 rounded-2xl group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition" style={{
                            background:
                                "linear-gradient(90deg, #5d4dff 0%,  #0a0236 100%, rgba(237, 221, 83, 1) 100%)",  
                        }}>
                            <div>
                                <p className="text-sm xs:text-2xl text-gray-300">
                                    MI CREDENCIAL

                                </p>
                                <h3 className="text-xl sm:text-2xl font-bold text-white">
                                    {auth.user.nombre} {auth.user.persona.apellido}
                                </h3>
                                <p className="text-sm xs:text-2xl text-white">
                                    DNI {auth.user.persona.dni} - <CalculoEdad fechaNacimiento={auth.user.persona.fecha_nac} />
                                </p>


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
                            <div className="ml-auto rounded-xl grid place-items-center" style={{
                                border:
                                "1px solid gray",  
                                background:
                                "white",  
                                width:
                                "100px",
                                height:
                                "100px",
                            }}>
                                <img
                                    src="/svg/header/qr.png"
                                    alt="qr"
                                    className="w-16 h-16 object-cover border-2 border-transparent hover:border-white transition-colors"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <h3 className="mb-2 text-xl sm:text-2xl font-bold text-black dark:text-white">
                                Destacados
                            </h3>
                            <div class="flex overflow-x-auto flex-nowrap gap-4">

                                {destacadosData.length === 0 ? (
                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8 text-center">
                                            <p className="text-gray-600 dark:text-gray-400">
                                                No hay destacados cargados
                                            </p>
                                        </div>
                                    ) : (

                                        destacadosData.map((destacado, i) => (

                                            <div key={i} className="flex-none w-64 h-40 bg-blue-500 mb-2 rounded-lg bg-[linear-gradient(to_bottom,#5d4dff_50%,#e2e2e2_50%)]
                                            dark:bg-[linear-gradient(to_bottom,#5d4dff_50%,#374151_50%)]" >
                                                <div className="h-20  flex items-center grid place-items-center bg-[radial-gradient(circle,#0a0236,#5d4dff)]">
                                                    {destacado.imagen ? (
                                                        <img
                                                            src={destacado.imagen}
                                                            alt={destacado.titulo}
                                                            className="w-auto h-16 object-cover"
                                                        />
                                                    ) : (
                                                        <IconLink
                                                            size={24}
                                                            color={"white"}
                                                            
                                                            
                                                        />
                                                    )}
                                                </div>
                                                <Link href={destacado.tipo=='noticia'? `/noticias/${destacado.id}` : `/eventos/${destacado.id}`} >
                                                <div className="mt-1 ml-2 h-20">
                                                    <h3 className="mb-2 text-xs xs:text-2xl  text-black dark:text-white">
                                                        <b>{(destacado.titulo.length>34)? destacado.titulo.substring(0, 34) + "..." : destacado.titulo}</b>
                                                    </h3>
                                                    <p className="mb-1 text-xs xs:text-2xl  text-gray dark:text-white">
                                                        {(destacado.descripcion.length>37)? destacado.descripcion.substring(0, 37) + "..." : destacado.descripcion}
                                                    </p>
                                                    
                                                    <div class="flex overflow-x-auto flex-nowrap gap-1">
                                                        
                                                        {destacado.categoria_id!=null && ( 
                                                        <div className="my-2 max-w-fit rounded-full" style={{
                                                            background:
                                                            "#c4ff00",  
                                                            
                                                        }}>
                                                            <p className="ml-1 mr-1 text-xs xs:text-2xs font-bold text-black"> 
                                                                {destacado.categoria_id} 
                                                            </p>
                                                        </div>
                                                        )}
                                                        
                                                        {destacado.region_id!=null && ( 
                                                        <div className="my-2 max-w-fit rounded-full" style={{
                                                            background:
                                                            "#00d9fa",  
                                                            
                                                        }}>
                                                            <p className="ml-1 mr-1 text-xs xs:text-2xs font-bold text-black"> 
                                                                {destacado.region_id}
                                                            </p>
                                                        </div>
                                                        )}
                                                    </div>  
                                                </div> 

                                                </Link>
                                            </div>
                                        ))
                                    )}
                                
                            </div>
                        </div>


                        <div className="mt-6 mb-8">
                            <h3 className="mb-2 text-xl sm:text-2xl font-bold text-black dark:text-white">
                                Explorá por categoría
                            </h3>

                            <div className="grid grid-cols-2 gap-3 flex items-center">

                                
                                    {categoriasData.length === 0 ? (
                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8 text-center">
                                            <p className="text-gray-600 dark:text-gray-400">
                                                No hay categorías cargadas
                                            </p>
                                        </div>
                                    ) : (
                                        categoriasData.map((categoria) => (
                                            <Link
                                                href={`/notificaciones/explorar/noticias/${categoria.id}/todas`}
                                                className="bg-[#e2e2e2] rounded-lg dark:bg-gray-700 dark:text-white grid place-items-center h-20">
                                            
                                                <Copy
                                                    size={24}
                                                    color={"white"}        
                                                />
                                                <p>
                                                    <b>{categoria.nombre}</b>
                                                </p>
                                            
                                            
                                            </Link>       
                                        ))
                                    )}
                                
                                
                            </div>
                        </div>
                    </div>
                )}

                {userType === "institucion" && (
                    <div className="flex items-center mb-6 justify-between gap-2">
                        <div className="w-full bg-gradient-to-r dark:from-edu-dark dark:to-edu-mid from-gray-300 to-gray-100 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-3xl p-5 shadow-md">
                            <Link
                                href="/noticias/create"
                                className="flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-lg font-bold">
                                        Compartí tus novedades
                                    </p>
                                    <p className="text-sm opacity-90">
                                        Publicá noticias, eventos o avisos
                                        importantes
                                    </p>
                                </div>

                                <div className="bg-edu-dark text-white dark:bg-white dark:text-black font-bold px-4 py-2 rounded-lg">
                                    Crear
                                </div>
                            </Link>
                        </div>
                    </div>
                )}

                

                {nextPageUrl && (
                    <div ref={loaderRef}>{isLoading && <LoadingSpinner />}</div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
