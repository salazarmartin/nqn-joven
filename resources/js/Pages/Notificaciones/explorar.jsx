import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import LoadingSpinner from "@/Components/LoadingSpinner";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
    BookOpen,
} from "lucide-react";

export function DateDisplay({fechaEntrada}) {
  
    const fecha = new Date(fechaEntrada.replace(" ", "T"));

    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();

    return dia+'/'+mes+'/'+año;
}

export default function Explorar({ auth}) {
    const { props } = usePage();
    const { regiones } = props;
    const { categorias } = props;
    const { noticias } = props;
    const { categoriaelegida } = props;
    
    const catelegida = categoriaelegida || "";

    const regionesData = regiones || [];
    const categoriasData = categorias || [];
     
    const [sebuscaron, setSeBuscaron] = useState("noticias");

    const [noticiasData, setDatosnoticias] = useState(noticias);
    const [eventosData, setDatosEventos] = useState([]);
    const [linksData, setDatosLinks] = useState([]);

    const [loading, setLoading] = useState(false);
    
    
    const handlebusqueda = async (event) => {
        setLoading(true);

        try {

            const boton = event.currentTarget;
            
            if (boton.classList.contains("buscar")) {
                const todosbuscar = document.querySelectorAll("button.buscar");
                todosbuscar.forEach(el => {
                    el.classList.remove("seleccionado");
                    el.classList.remove("bg-blue-900");
                    el.classList.remove("text-white");
                    el.classList.add("text-blue-800"); 
                    el.classList.add("bg-gray-200");  
                });
                
            } else {
                if (boton.classList.contains("categoria")) {
                    const todoscategoria = document.querySelectorAll("button.categoria");
                    todoscategoria.forEach(el => {
                        el.classList.remove("seleccionado");
                        el.classList.remove("bg-blue-900");
                        el.classList.remove("text-white");
                        el.classList.add("text-blue-800"); 
                        el.classList.add("bg-gray-200");  
                    });
                }else{
                    if (boton.classList.contains("region")) {
                        const todosregion = document.querySelectorAll("button.region");
                        todosregion.forEach(el => {
                            el.classList.remove("seleccionado");
                            el.classList.remove("bg-blue-900");
                            el.classList.remove("text-white");
                            el.classList.add("text-blue-800"); 
                            el.classList.add("bg-gray-200");  
                        });
                    }
                }
            }
            boton.classList.remove("bg-gray-200");  
            boton.classList.add("seleccionado"); 
            boton.classList.add("text-white"); 
            boton.classList.add("bg-blue-900");
            
            const buscar = document.querySelectorAll("button.buscar.seleccionado");            
            const categoria = document.querySelectorAll("button.categoria.seleccionado");            
            const region = document.querySelectorAll("button.region.seleccionado");            
            
            const url = `/notificaciones/buscarnoticias/`+buscar[0].id+`/`+categoria[0].id+`/`+region[0].id;
            const response = await fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                }
            );


            const data = await response.json();
            setSeBuscaron(buscar[0].id);

            if(buscar[0].id == "noticias"){
                setDatosnoticias(data.noticias);
            }else{
                if(buscar[0].id == "eventos"){
                    setDatosEventos(data.eventos);
                }else{
                    setDatosLinks(data.links);
                }
            }

        } catch (error) {
            toast.error("Error al procesar la solicitud");
            console.error("Error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            
        >
            <Head title="Editar Perfil" />
                        <div style={{margin:"-12px"}}>
                            
                        </div>
                        <div className="">

                            <div className="grid grid-cols-3 gap-0">
                                <button id="noticias" className="buscar seleccionado text-md text-white bg-blue-900 xs:text-xs border border-blue-800 dark:border-gray-600 flex flex-col items-center"
                                    onClick={handlebusqueda} disabled={loading}>
                                    <p className="ml-1 mr-1 text-md xs:text-xs font-bold "> 
                                        Noticias
                                    </p>
                                </button>
                                <button id="eventos" className="buscar text-blue-800 bg-gray-200 text-md xs:text-xs border border-blue-800 dark:border-gray-600 flex flex-col items-center"
                                    onClick={handlebusqueda} disabled={loading}>
                                    <p className="ml-1 mr-1 text-md xs:text-xs font-bold "> 
                                        Eventos
                                    </p>
                                </button>
                                <button id="links" className="buscar text-blue-800 bg-gray-200 text-md xs:text-xs border border-blue-800 dark:border-gray-600 flex flex-col items-center"
                                    onClick={handlebusqueda} disabled={loading}>
                                    <p className="ml-1 mr-1 text-md xs:text-xs font-bold"> 
                                        Links
                                    </p>
                                </button>
                            </div>

                            
                            <div class="my-2 flex overflow-x-auto flex-nowrap gap-2">
                                <span style={{paddingtop:"2px"}} className="text-sm font-bold text-black dark:text-white">Regiones:</span>
                                <button id="todas" className="region seleccionado text-white bg-blue-900 flex-none mb-2 rounded-lg border border-blue-800 dark:border-gray-600 " 
                                    onClick={handlebusqueda} disabled={loading}>
                                    <p className="ml-1 mr-1 text-sm xs:text-sm font-bold "> Todas</p>
                                </button>
                                {regionesData.length === 0 ? (
                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8 text-center">
                                            <p className="text-gray-600 dark:text-gray-400">
                                                No hay regiones cargadas
                                            </p>
                                        </div>
                                    ) : (
                                        regionesData.map((region) => (
                                            
                                            <button id={region.id} className="region text-blue-800 bg-gray-200 flex-none mb-2 rounded-lg border border-blue-800 dark:border-gray-600 " 
                                                onClick={handlebusqueda} disabled={loading}>
                                                <p className="ml-1 mr-1 text-sm xs:text-sm font-bold"> 
                                                            {region.nombre}
                                                        </p>
                                            </button>
                                        ))
                                    )}
                                
                            </div>

                            <div class="my-2 flex overflow-x-auto flex-nowrap gap-2">
                                <span style={{paddingtop:"2px"}} className="text-sm font-bold text-black dark:text-white">Categorías:</span>
                                <button id="todas" className={catelegida==0? 'text-white bg-blue-900 categoria seleccionado flex-none mb-2 rounded-lg border border-blue-800 dark:border-gray-600':'text-blue-800 bg-gray-200 categoria seleccionado flex-none mb-2 rounded-lg border border-blue-800 dark:border-gray-600'}
                                    onClick={handlebusqueda} disabled={loading}>
                                    <p className="ml-1 mr-1 text-sm xs:text-sm font-bold"> Todas</p>
                                </button>
                                {categoriasData.length === 0 ? (
                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8 text-center">
                                            <p className="text-gray-600 dark:text-gray-400">
                                                No hay categorías cargadas
                                            </p>
                                        </div>
                                    ) : (
                                        categoriasData.map((categoria) => (

                                            <button id={categoria.id} className={catelegida==categoria.id? 'text-white bg-blue-900 categoria seleccionado flex-none mb-2 rounded-lg border border-blue-800 dark:border-gray-600':'text-blue-800 bg-gray-200 categoria seleccionado flex-none mb-2 rounded-lg border border-blue-800 dark:border-gray-600'}
                                                onClick={handlebusqueda} disabled={loading}>
                                                <p className="ml-1 mr-1 text-sm xs:text-sm font-bold"> 
                                                            {categoria.nombre}
                                                        </p>
                                            </button>
                                        ))
                                    )}
                                
                            </div>
                        </div>
                        
                        <div >{loading && <LoadingSpinner />}</div>                        
                        
                        {!loading && sebuscaron == "noticias" &&
                            <div className="mt-6 mb-4">
                                    {noticiasData.length === 0 ? (
                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8 text-center">
                                            <p className="text-gray-600 dark:text-gray-200">
                                                No se encontraron noticias
                                            </p>
                                        </div>
                                    ) : (
                                        noticiasData.map((noticia) => (

                                            <div className="h-40 bg-blue-500 mb-2 rounded-lg bg-gradient-to-b from-[#5d4dff] to-[#e2e2e2]
  dark:from-[#5d4dff] dark:to-[#374151]" >
                                                <div className="h-16  flex items-center grid place-items-center">
                                                    <img
                                                        src="/svg/header/map.svg"
                                                        alt="NQN Jóven"
                                                        className="h-6 w-auto"
                                                    />
                                                </div>
                                                <div class="mr-1 flex justify-end">
                                                            <p className="text-white text-xs xs:text-2xs font-bold"> 
                                                                <DateDisplay fechaEntrada={noticia.created_at} />
                                                            </p>
                                                        </div>
                                                <Link href={`/noticias/${noticia.id}`} ><div className="ml-2 h-20">
                                                    
                                                    <h3 className="mb-2 text-xs xs:text-2xl font-bold text-black dark:text-white">
                                                        <b>{(noticia.titulo.length>56)? noticia.titulo.substring(0, 56) + "..." : noticia.titulo}</b>
                                                    </h3>
                                                    <p className="mb-1 text-xs xs:text-2xl font-bold text-gray dark:text-white">
                                                        {(noticia.contenido.length>68)? noticia.contenido.substring(0, 68) + "..." : noticia.contenido}
                                                    </p>
                                                    
                                                    <div class="flex overflow-x-auto flex-nowrap gap-1">
                                                        <div className="my-2 max-w-fit rounded-full" style={{
                                                            background:
                                                            "#c4ff00",  
                                                            
                                                        }}>
                                                            <p className="ml-1 mr-1 text-xs xs:text-2xs font-bold text-black"> 
                                                                {noticia.categoria.nombre}
                                                            </p>
                                                        </div>

                                                        <div className="my-2 max-w-fit rounded-full" style={{
                                                            background:
                                                            "#00d9fa",  
                                                            
                                                        }}>
                                                            <p className="ml-1 mr-1 text-xs xs:text-2xs font-bold text-black"> 
                                                                {noticia.region.nombre}
                                                            </p>
                                                        </div>
                                                        
                                                    </div>    
                                                </div></Link>
                                            </div>
                                        ))
                                    )}
                            </div>
                        }


                        {!loading && sebuscaron == "eventos" &&
                            <div className="mt-6 mb-4">
                                    {eventosData.length === 0 ? (
                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8 text-center">
                                            <p className="text-gray-600 dark:text-gray-200">
                                                No se encontraron eventos
                                            </p>
                                        </div>
                                    ) : (
                                        eventosData.map((evento) => (

                                            <div className="h-40 bg-blue-500 mb-2 rounded-lg bg-gradient-to-b from-[#5d4dff] to-[#e2e2e2]
  dark:from-[#5d4dff] dark:to-[#374151]">
                                                <div className="h-16  flex items-center grid place-items-center">
                                                    <img
                                                        src="/svg/header/map.svg"
                                                        alt="NQN Jóven"
                                                        className="h-6 w-auto"
                                                    />
                                                </div>
                                                <div class="mr-1 flex justify-end">
                                                            <p className="text-white mb-1 text-xs xs:text-2xs font-bold"> 
                                                                <DateDisplay  fechaEntrada={evento.fecha} />  - {evento.hora} hs - {evento.lugar}
                                                            </p>
                                                        </div>
                                                <Link href={`/eventos/${evento.id}`} ><div className="ml-2 h-20">
                                                    
                                                    <h3 className="mb-2 text-xs xs:text-2xl font-bold text-black dark:text-white">
                                                        <b>{(evento.titulo.length>56)? evento.titulo.substring(0, 56) + "..." : evento.titulo}</b>
                                                    </h3>
                                                    <p className="mb-1 text-xs xs:text-2xl font-bold text-gray dark:text-white">
                                                        {(evento.descripcion.length>68)? evento.descripcion.substring(0, 68) + "..." : evento.contenido}
                                                    </p>
                                                    
                                                    <div class="flex overflow-x-auto flex-nowrap gap-1">
                                                        <div className="my-2 max-w-fit rounded-full" style={{
                                                            background:
                                                            "#c4ff00",  
                                                            
                                                        }}>
                                                            <p className="ml-1 mr-1 text-xs xs:text-2xs font-bold text-black"> 
                                                                {evento.categoria.nombre}
                                                            </p>
                                                        </div>

                                                        <div className="my-2 max-w-fit rounded-full" style={{
                                                            background:
                                                            "#00d9fa",  
                                                            
                                                        }}>
                                                            <p className="ml-1 mr-1 text-xs xs:text-2xs font-bold text-black"> 
                                                                {evento.region.nombre}
                                                            </p>
                                                        </div>
                                                        
                                                    </div>    
                                                </div></Link>
                                            </div>
                                        ))
                                    )}
                            </div>
                        }


                        {!loading && sebuscaron == "links" &&
                            <div className="mt-6 mb-4">
                                    {linksData.length === 0 ? (
                                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8 text-center">
                                            <p className="text-gray-600 dark:text-gray-200">
                                                No se encontraron links
                                            </p>
                                        </div>
                                    ) : (
                                        linksData.map((link) => (

                                            <div className="h-40 bg-blue-500 mb-2 rounded-lg bg-gradient-to-b from-[#5d4dff] to-[#e2e2e2]
  dark:from-[#5d4dff] dark:to-[#374151]" >
                                                <div className="h-16  flex items-center grid place-items-center">
                                                    <img
                                                        src="/svg/header/map.svg"
                                                        alt="NQN Jóven"
                                                        className="h-6 w-auto"
                                                    />
                                                </div>
                                                <div class="mr-1 flex justify-end">
                                                            <p className="text-white text-xs xs:text-2xs font-bold"> 
                                                                <DateDisplay  fechaEntrada={link.created_at} />
                                                            </p>
                                                        </div>
                                                <Link href={`/links/${link.id}`} ><div className="ml-2 h-20">
                                                    
                                                    <h3 className="mb-2 text-xs xs:text-2xl font-bold text-black dark:text-white">
                                                        <b>{(link.titulo.length>56)? link.titulo.substring(0, 56) + "..." : link.titulo}</b>
                                                    </h3>
                                                    <a href={link.url} className="mb-1 text-xs xs:text-2xl font-bold text-gray dark:text-white">
                                                        {(link.url.length>68)? link.url.substring(0, 68) + "..." : link.url}
                                                    </a>
                                                    
                                                    <div class="flex overflow-x-auto flex-nowrap gap-1">
                                                        <div className="my-2 max-w-fit rounded-full" style={{
                                                            background:
                                                            "#c4ff00",  
                                                            
                                                        }}>
                                                            <p className="ml-1 mr-1 text-xs xs:text-2xs font-bold text-black"> 
                                                                {link.categoria.nombre}
                                                            </p>
                                                        </div>

                                                        <div className="my-2 max-w-fit rounded-full" style={{
                                                            background:
                                                            "#00d9fa",  
                                                            
                                                        }}>
                                                            <p className="ml-1 mr-1 text-xs xs:text-2xs font-bold text-black"> 
                                                                {link.region.nombre}
                                                            </p>
                                                        </div>
                                                        
                                                    </div>    
                                                </div></Link>
                                            </div>
                                        ))
                                    )}
                            </div>
                        }
        </AuthenticatedLayout>
    );
}
