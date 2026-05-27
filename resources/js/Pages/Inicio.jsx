import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Link as IconLink, ExternalLink, Calendar, MapPin, Newspaper } from "lucide-react";
import {Copy } from "lucide-react";
import PublicacionCard from "@/Components/Publicacion/PublicacionCard";
import AccesosDirectos from "@/Components/AccesosDirectos";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoadingSpinner from "@/Components/LoadingSpinner";
import { useState, useMemo } from "react";

// Paleta NQN Joven — fondo + color de texto
const CATEGORIA_PALETA = [
    { bg: "#5d4dff", text: "#ffffff", dark: true },
    { bg: "#c4ff00", text: "#0a0236", dark: false },
    { bg: "#ff90eb", text: "#0a0236", dark: false },
    { bg: "#00d9fa", text: "#0a0236", dark: false },
    { bg: "#ff5b24", text: "#ffffff", dark: true },
    { bg: "#0a0236", text: "#c4ff00", dark: true },
];

// Iconos por ID de categoría (manual de marca)
const CATEGORIA_ICONOS = {
    1: "/images/categoria/educacion.png",
    2: "/images/categoria/trabajo.png",
    3: "/images/categoria/cultura.png",
    4: "/images/categoria/deportes.png",
    5: "/images/categoria/participacion_ciudadana.png",
    6: "/images/categoria/Salud-bienestar.png",
    7: "/images/categoria/inclusion-financiera.png",
    8: "/images/categoria/identidad-y-derechos.png",
};

function CategoriaCard({ categoria, index }) {
    const { bg, text, dark } = CATEGORIA_PALETA[index % CATEGORIA_PALETA.length];
    const icono = CATEGORIA_ICONOS[categoria.id];
    // Fondo oscuro → ícono blanco; fondo claro → ícono negro
    const iconStyle = dark
        ? { filter: "brightness(0) invert(1)", opacity: 0.45 }
        : { filter: "brightness(0)", opacity: 0.20 };
    return (
        <Link
            href={`/notificaciones/explorar/noticias/${categoria.id}/todas`}
            className="relative rounded-2xl overflow-hidden h-24 flex flex-col justify-end p-3 active:scale-95 transition-transform"
            style={{ backgroundColor: bg }}
        >
            {/* Ícono de categoría como fondo */}
            {icono ? (
                <img
                    src={icono}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-contain scale-90 pointer-events-none select-none"
                    style={iconStyle}
                />
            ) : (
                <span
                    className="absolute top-1 right-2 text-4xl font-black opacity-10 leading-none select-none"
                    style={{ color: text }}
                >
                    {categoria.nombre.charAt(0).toUpperCase()}
                </span>
            )}

            {/* Nombre de la categoría */}
            <span className="relative z-10 font-bold text-sm leading-tight" style={{ color: text }}>
                {categoria.nombre}
            </span>
        </Link>
    );
}

const TIPO_CONFIG = {
    noticia: { label: "Noticia",  bg: "bg-[#23025d]",   gradient: "from-[#23025d] to-[#5d4dff]", icon: Newspaper,    nqnIcon: "/images/iconos/muticia celeste.png" },
    evento:  { label: "Evento",   bg: "bg-emerald-600", gradient: "from-emerald-800 to-emerald-500", icon: Calendar, nqnIcon: "/images/iconos/sol verde.png" },
    link:    { label: "Link",     bg: "bg-blue-500",    gradient: "from-blue-800 to-blue-500",    icon: ExternalLink, nqnIcon: "/images/iconos/lanin celeste.png" },
};

function DestacadoCard({ item }) {
    const config = TIPO_CONFIG[item.tipo] || TIPO_CONFIG.noticia;
    const Icon = config.icon;
    const href = item.tipo === "link"
        ? item.url
        : (item.tipo === "noticia" ? `/noticias/${item.id}` : `/eventos/${item.id}`);
    const isExternal = item.tipo === "link";

    const inner = (
        <div className="relative flex-none w-52 h-44 rounded-2xl overflow-hidden shadow-md">
            {/* Fondo: imagen o placeholder con diseño */}
            {item.imagen ? (
                <img
                    src={item.imagen}
                    alt={item.titulo}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`}>
                    {/* Ícono NQN como fondo relleno */}
                    <img
                        src={config.nqnIcon}
                        alt="" aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-contain scale-125 opacity-20"
                    />
                    {/* Círculos decorativos */}
                    <div className="absolute w-24 h-24 rounded-full bg-white/10 -top-4 -right-4" />
                    <div className="absolute w-16 h-16 rounded-full bg-white/10 -bottom-3 -left-3" />
                </div>
            )}

            {/* Overlay oscuro en la mitad inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Badge tipo — arriba izquierda */}
            <div className="absolute top-2.5 left-2.5">
                <span className={`${config.bg} text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1`}>
                    <Icon className="w-3 h-3" />
                    {config.label}
                </span>
            </div>

            {/* Contenido — abajo */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm leading-tight line-clamp-2">
                    {item.titulo}
                </p>
                {item.descripcion && (
                    <p className="text-white/70 text-xs mt-0.5 line-clamp-1">
                        {item.descripcion}
                    </p>
                )}
                <div className="flex gap-1 mt-1.5 flex-wrap">
                    {item.categoria_id && (
                        <span className="bg-[#c4ff00] text-black text-xs font-medium px-1.5 py-0.5 rounded-full">
                            {item.categoria_id}
                        </span>
                    )}
                    {item.region_id && (
                        <span className="bg-[#00d9fa] text-black text-xs font-medium px-1.5 py-0.5 rounded-full">
                            {item.region_id}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    if (isExternal) return <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>;
    return <Link href={href}>{inner}</Link>;
}

function FeedItem({ item }) {
    const config = TIPO_CONFIG[item.tipo] || TIPO_CONFIG.noticia;
    const Icon = config.icon;
    const isExternal = item.tipo === "link";
    const href = item.tipo === "noticia" ? `/noticias/${item.id}`
               : item.tipo === "evento"  ? `/eventos/${item.id}`
               : item.url;

    const content = (
        <div className="flex gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            {/* Imagen o placeholder */}
            <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden">
                {item.imagen ? (
                    <img src={item.imagen} alt={item.titulo} className="w-full h-full object-cover" />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${config.gradient} relative overflow-hidden`}>
                        <img src={config.nqnIcon} alt="" aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-contain scale-110 opacity-30" />
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`${config.bg} text-white text-xs font-medium px-2 py-0.5 rounded-full`}>
                        {config.label}
                    </span>
                    {item.fecha_fmt && (
                        <span className="text-xs text-gray-400">{item.fecha_fmt}</span>
                    )}
                </div>
                <p className="font-semibold text-sm text-gray-800 dark:text-white line-clamp-1">{item.titulo}</p>
                {item.descripcion && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{item.descripcion}</p>
                )}
                {item.extra && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {item.extra}
                    </p>
                )}
            </div>
        </div>
    );

    if (isExternal) {
        return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
    }
    return <Link href={href}>{content}</Link>;
}

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
    feed = [],
    institucionesVisitadas = [],
}) {
    const noticiasLinks = noticias?.links || [];
    const destacadosData = destacados || [];
    const feedData = feed || [];

    const nextPageUrl = noticiasLinks.find(
        (link) => link.label === "&raquo;"
    )?.url;

    const { loaderRef, isLoading } = useInfiniteScroll({ nextPageUrl });

    const [categoriaActiva, setCategoriaActiva] = useState(null);

    // Categorías únicas del feed para los pills
    const categoriasDelFeed = useMemo(() => {
        const map = new Map();
        feedData.forEach(item => {
            if (item.categoria_id && item.categoria_nombre) {
                map.set(item.categoria_id, item.categoria_nombre);
            }
        });
        return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
    }, [feedData]);

    // Feed filtrado por categoría activa
    const feedFiltrado = useMemo(() => {
        if (!categoriaActiva) return feedData;
        return feedData.filter(item => item.categoria_id === categoriaActiva);
    }, [feedData, categoriaActiva]);

    

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

            <div className="pb-4 mb-8 relative z-10">
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
                                border:"3px solid #c7c7c7",  background:"#0a0236",  
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
                        <div className="relative grid grid-cols-2 gap-4 h-full flex items-center justify-end p-4 rounded-2xl overflow-hidden transition" style={{
                            background: "linear-gradient(90deg, #5d4dff 0%, #0a0236 100%)",
                        }}>
                            {/* ── Fondo decorativo NQN ── */}
                            <img src="/images/iconos/Recurso amancay degrade 1.png" alt="" aria-hidden="true"
                                className="absolute -top-4 -right-4 w-28 h-28 object-contain opacity-[0.12] pointer-events-none select-none" />
                            <img src="/images/iconos/Recurso araucaria degrade 2.png" alt="" aria-hidden="true"
                                className="absolute -bottom-4 -left-4 w-24 h-24 object-contain opacity-[0.10] pointer-events-none select-none rotate-12" />
                            <img src="/images/iconos/sol verde.png" alt="" aria-hidden="true"
                                className="absolute top-2 left-1/2 w-10 h-10 object-contain opacity-[0.08] pointer-events-none select-none -translate-x-1/2" />
                            <img src="/images/iconos/huella celeste.png" alt="" aria-hidden="true"
                                className="absolute bottom-2 right-28 w-8 h-8 object-contain opacity-[0.08] pointer-events-none select-none" />

                            {/* Contenido — z-10 sobre las decoraciones */}
                            <div className="relative z-10">
                                <p className="text-sm text-gray-300">MI CREDENCIAL</p>
                                <h3 className="text-xl sm:text-2xl font-bold text-white">
                                    {auth.user.nombre} {auth.user.persona.apellido}
                                </h3>
                                <p className="text-sm text-white">
                                    DNI {auth.user.persona.dni} - <CalculoEdad fechaNacimiento={auth.user.persona.fecha_nac} />
                                </p>
                                <div className="my-2 max-w-max rounded-full px-2" style={{ background: "#2BEAFF" }}>
                                    <p className="text-sm font-bold" style={{ color: "#322B94" }}>
                                        &#9679; {auth.user.estado}
                                    </p>
                                </div>
                            </div>

                            {/* QR — z-10 */}
                            <div className="relative z-10 ml-auto rounded-xl grid place-items-center" style={{
                                border: "1px solid rgba(255,255,255,0.3)",
                                background: "white",
                                width: "120px",
                                height: "120px",
                            }}>
                                <img
                                    src="/svg/header/qr.png"
                                    alt="qr"
                                    className="object-cover"
                                    style={{
                                        width: "114px",
                                        height:"114px",
                                    }}
                                />
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <h3 className="mb-3 text-xl sm:text-2xl font-bold text-black dark:text-white">
                                Destacados
                            </h3>
                            <div className="flex overflow-x-auto flex-nowrap gap-3 pb-2 scrollbar-hide">
                                {destacadosData.length === 0 ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center w-full">
                                        <p className="text-gray-500 text-sm">No hay destacados cargados</p>
                                    </div>
                                ) : (
                                    destacadosData.map((d, i) => (
                                        <DestacadoCard key={i} item={d} />
                                    ))
                                )}
                            </div>
                        </div>


                        {/* Explorá por categoría */}
                        <div className="mt-6">
                            <h3 className="mb-3 text-xl sm:text-2xl font-bold text-black dark:text-white">
                                Explorá por categoría
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {categorias?.length === 0 ? (
                                    <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                                        <p className="text-gray-600 dark:text-gray-400">No hay categorías cargadas</p>
                                    </div>
                                ) : (
                                    categorias?.map((categoria, i) => (
                                        <CategoriaCard key={categoria.id} categoria={categoria} index={i} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Feed unificado */}
                        {feedData.length > 0 && (
                            <div className="mt-6 mb-8">
                                <h3 className="mb-3 text-xl font-bold text-black dark:text-white">
                                    Novedades
                                </h3>

                                {/* Pills de categorías */}
                                {categoriasDelFeed.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                                        <button
                                            onClick={() => setCategoriaActiva(null)}
                                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                                !categoriaActiva
                                                    ? "bg-[#5d4dff] text-white"
                                                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                            }`}
                                        >
                                            Todos
                                        </button>
                                        {categoriasDelFeed.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setCategoriaActiva(
                                                    categoriaActiva === cat.id ? null : cat.id
                                                )}
                                                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                                    categoriaActiva === cat.id
                                                        ? "bg-[#23025d] text-white"
                                                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                {cat.nombre}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Lista del feed */}
                                <div className="flex flex-col gap-3">
                                    {feedFiltrado.length === 0 ? (
                                        <p className="text-center text-sm text-gray-400 py-8">
                                            No hay contenido en esta categoría.
                                        </p>
                                    ) : (
                                        feedFiltrado.map(item => (
                                            <FeedItem key={`${item.tipo}-${item.id}`} item={item} />
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
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
