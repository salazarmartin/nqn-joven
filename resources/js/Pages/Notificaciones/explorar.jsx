import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import LoadingSpinner from "@/Components/LoadingSpinner";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Newspaper, Calendar, ExternalLink, MapPin, Clock, Search } from "lucide-react";

const TIPOS = [
    { id: "todos",    label: "Todos",    icon: Search },
    { id: "noticias", label: "Noticias", icon: Newspaper },
    { id: "eventos",  label: "Eventos",  icon: Calendar },
    { id: "links",    label: "Links",    icon: ExternalLink },
];

function formatFecha(fechaStr) {
    if (!fechaStr) return "";
    return new Date(String(fechaStr).replace(" ", "T"))
        .toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

export default function Explorar({ auth }) {
    const { props } = usePage();
    const regiones   = props.regiones   || [];
    const categorias = props.categorias || [];
    const catelegida = props.categoriaelegida || 0;

    const [tipo,     setTipo]     = useState("todos");
    const [regionId, setRegionId] = useState("todas");
    const [catId,    setCatId]    = useState(catelegida ? String(catelegida) : "todas");
    const [loading,  setLoading]  = useState(false);

    const [noticiasData, setNoticiasData] = useState(props.noticias || []);
    const [eventosData,  setEventosData]  = useState(props.eventos  || []);
    const [linksData,    setLinksData]    = useState(props.links     || []);

    const buscar = async (newTipo, newRegion, newCat) => {
        const t = newTipo   ?? tipo;
        const r = newRegion ?? regionId;
        const c = newCat    ?? catId;
        setLoading(true);
        try {
            const tipos = t === "todos" ? ["noticias", "eventos", "links"] : [t];
            for (const tipo of tipos) {
                const url = `/notificaciones/buscarnoticias/${tipo}/${c}/${r}`;
                const res = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content,
                    },
                });
                const data = await res.json();
                if (tipo === "noticias") setNoticiasData(data.noticias || []);
                if (tipo === "eventos")  setEventosData(data.eventos   || []);
                if (tipo === "links")    setLinksData(data.links       || []);
            }
        } catch {
            toast.error("Error al buscar");
        } finally {
            setLoading(false);
        }
    };

    const handleTipo = (id) => {
        setTipo(id);
        buscar(id, regionId, catId);
    };

    const handleRegion = (id) => {
        setRegionId(id);
        buscar(tipo, id, catId);
    };

    const handleCat = (id) => {
        setCatId(id);
        buscar(tipo, regionId, id);
    };

    const todosMezclados = [...noticiasData, ...eventosData, ...linksData]
        .sort((a, b) => new Date(b.created_at || b.fecha || 0) - new Date(a.created_at || a.fecha || 0))
        .map(item => ({
            ...item,
            _tipo: noticiasData.includes(item) ? "noticia" : eventosData.includes(item) ? "evento" : "link"
        }));

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Explorar" />

            {/* Barra de filtros sticky — fuera del flujo del contenido */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700 px-4 py-3 -mx-4 sm:-mx-6">
                <div className="max-w-2xl mx-auto space-y-2.5">

                    {/* Título + selector de tipo */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 mr-1">
                            <Search className="w-4 h-4 text-[#5d4dff]" />
                            <span className="text-sm font-bold text-gray-900 dark:text-white">Explorar</span>
                        </div>
                        <div className="flex gap-1 flex-1">
                            {TIPOS.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => handleTipo(id)}
                                    disabled={loading}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-1 justify-center ${
                                        tipo === id
                                            ? "bg-[#5d4dff] text-white"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Regiones */}
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                        <span className="flex-shrink-0 text-xs text-gray-400 self-center">Región:</span>
                        <Pill label="Todas" active={regionId === "todas"} onClick={() => handleRegion("todas")} color="cyan" />
                        {regiones.map(r => (
                            <Pill key={r.id} label={r.nombre} active={regionId === String(r.id)} onClick={() => handleRegion(String(r.id))} color="cyan" />
                        ))}
                    </div>

                    {/* Categorías */}
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                        <span className="flex-shrink-0 text-xs text-gray-400 self-center">Categoría:</span>
                        <Pill label="Todas" active={catId === "todas"} onClick={() => handleCat("todas")} color="green" />
                        {categorias.map(c => (
                            <Pill key={c.id} label={c.nombre} active={catId === String(c.id)} onClick={() => handleCat(String(c.id))} color="green" />
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 pb-10 pt-4 relative z-10">

                {/* Resultados */}
                {loading ? (
                    <div className="flex justify-center py-12"><LoadingSpinner /></div>
                ) : (tipo === "todos" ? todosMezclados.length === 0 : (tipo === "noticias" ? noticiasData : tipo === "eventos" ? eventosData : linksData).length === 0) ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-10 text-center">
                        <img src="/images/iconos/huella naranja.png" alt="" aria-hidden="true" className="w-16 h-16 object-contain mx-auto mb-3 opacity-50" />
                        <p className="text-gray-500 font-medium mb-1">No se encontraron resultados</p>
                        <p className="text-gray-400 text-sm">Probá con otros filtros</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {tipo === "todos" && todosMezclados.map(item =>
                            item._tipo === "noticia" ? <NoticiaCard key={`n-${item.id}`} item={item} /> :
                            item._tipo === "evento"  ? <EventoCard  key={`e-${item.id}`} item={item} /> :
                                                       <LinkCard    key={`l-${item.id}`} item={item} />
                        )}
                        {tipo === "noticias" && noticiasData.map(n => <NoticiaCard key={n.id} item={n} />)}
                        {tipo === "eventos"  && eventosData.map(e  => <EventoCard  key={e.id} item={e} />)}
                        {tipo === "links"    && linksData.map(l    => <LinkCard    key={l.id} item={l} />)}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

/* --- Pills de filtro --- */
function Pill({ label, active, onClick, color = "purple" }) {
    var col = "";
    if(color === "green"){
        col = "bg-[#c4ff00] text-[#0a0236] font-bold";
    }else{
        if(color === "cyan"){
            col = "bg-[#00d9fa] text-[#0a0236] font-bold";
        }else{
            col = "bg-[#5d4dff] text-white font-bold";
        }
    }
    const activeClass = col;
    return (
        <button
            onClick={onClick}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                active ? activeClass : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
        >
            {label}
        </button>
    );
}

/* --- Cards de resultados --- */
function NoticiaCard({ item }) {
    const imagen = item.imagen ? `/storage/${item.imagen}` : null;
    return (
        <Link href={`/noticias/${item.id}`}>
            <div className="flex gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#5d4dff] to-[#0a0236] flex items-center justify-center">
                    {imagen
                        ? <img src={imagen} alt={item.titulo} className="w-full h-full object-cover" />
                        : <Newspaper className="w-6 h-6 text-white/40" strokeWidth={1.5} />
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 dark:text-white line-clamp-2 leading-snug">{item.titulo}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.resumen || item.contenido}</p>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {item.categoria?.nombre && <Badge label={item.categoria.nombre} color="green" />}
                        {item.region?.nombre    && <Badge label={item.region.nombre}    color="cyan"  />}
                        <span className="text-xs text-gray-400 ml-auto">{formatFecha(item.created_at)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function EventoCard({ item }) {
    const imagen = item.imagen ? `/storage/${item.imagen}` : null;
    return (
        <Link href={`/eventos/${item.id}`}>
            <div className="flex gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
                    {imagen
                        ? <img src={imagen} alt={item.titulo} className="w-full h-full object-cover" />
                        : <Calendar className="w-6 h-6 text-white/40" strokeWidth={1.5} />
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 dark:text-white line-clamp-1 leading-snug">{item.titulo}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                        {item.fecha && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatFecha(item.fecha)}</span>}
                        {item.hora  && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{String(item.hora).substring(0,5)}hs</span>}
                        {item.lugar && <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{item.lugar}</span></span>}
                    </div>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {item.categoria?.nombre && <Badge label={item.categoria.nombre} color="green" />}
                        {item.region?.nombre    && <Badge label={item.region.nombre}    color="cyan"  />}
                    </div>
                </div>
            </div>
        </Link>
    );
}

function LinkCard({ item }) {
    return (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
            <div className="flex gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white/40" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 dark:text-white line-clamp-1">{item.titulo}</p>
                    {item.descripcion && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.descripcion}</p>}
                    <p className="text-xs text-[#5d4dff] mt-0.5 truncate">{item.url}</p>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {item.categoria?.nombre && <Badge label={item.categoria.nombre} color="green" />}
                        {item.region?.nombre    && <Badge label={item.region.nombre}    color="cyan"  />}
                    </div>
                </div>
            </div>
        </a>
    );
}

function Badge({ label, color }) {
    const cls = color === "green"
        ? "bg-[#c4ff00] text-[#0a0236]"
        : "bg-[#00d9fa] text-[#0a0236]";
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
    );
}
