import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";

import ActualizarIntereses from "./ActualizarIntereses";

export default function EditarPerfilPersona({ className = "", onCancel }) {
    const { props } = usePage();
    const auth = props.auth;
    const user = props.auth.user;

    const provincias = props.provincias;

    const [ciudades, setCiudades] = useState([]);
    
    const estudios = props.estudios;
    const persona = props.persona || {};

    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            nombre: user.nombre || "",
            apellido: persona.apellido || "",
            ciudad: user.ciudad || "",
            provincia: user.provincia || "",
            ciudad_id: user.ciudad_id || "",
            provincia_id: user.provincia_id || "",
            telefono: user.telefono || "",
            trabaja_emprende: persona.trabaja_emprende || "",
            estudio_id: persona.estudio_id || "",
            region_id: persona.region_id || "",
            biografia: persona.biografia || "",
        });

    if(user.ciudad_id != ""){
         useEffect(() => {
            const fetchRegion = async () => {
            try {
                const url = `/profile/buscarregion/${user.ciudad_id}`;
                const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                    ).content,
                },
                });

                const data = await response.json();
                
                if(data.region_id)
                    setData("region_id", data.region_id);
                else
                    setData("region_id", null);

                if(data.region_nombre)
                    document.getElementById('region_nombre').value = data.region_nombre;
                else
                    document.getElementById('region_nombre').value = "";
                
            } catch (error) {
                console.error("Error al procesar la solicitud", error);
            }
            };
            fetchRegion();
        }, []); // solo una vez al montar
    }

    if(user.provincia_id != ""){
         useEffect(() => {
            const fetchCiudad = async () => {
            try {
                const url = `/profile/buscarciudades/${user.provincia_id}`;
                const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                    ).content,
                },
                });

                const data = await response.json();
                
                setCiudades(data.ciudades);
                
            } catch (error) {
                console.error("Error al procesar la solicitud", error);
            }
            };
            fetchCiudad();
        }, []);// solo una vez al montar
    }

    const submit = (e) => {
        e.preventDefault();
         const toastId = toast.loading("Actualizando perfil...");

        patch(route("profile.persona.update"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success("Perfil actualizado correctamente.");
            },
            onError: () => {
                toast.dismiss(toastId);
                toast.error("Hubo un error al actualizar tu perfil.");
            },
            onFinish: () => toast.dismiss(toastId),
        });
    };

    
    const handleProvinciaChange = async (e) => {
        const value = e.target.value;
        setData("provincia_id", value);
            
            try {
                
                const url = `/profile/buscarciudades/`+value;
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
                    
                setCiudades(data.ciudades);
                document.getElementById('region_nombre').value = "";
                
            } catch (error) {
                console.error("Error al procesar la solicitud");
            } finally {
            }
    };

    const handleCiudadChange = async (e) => {
        const value = e.target.value;
        setData("ciudad_id", value);
            
            try {
                
                const url = `/profile/buscarregion/`+value;
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
                    
                if(data.region_id)
                    setData("region_id", data.region_id);
                else
                    setData("region_id", null);

                if(data.region_nombre)
                    document.getElementById('region_nombre').value = data.region_nombre;
                else
                    document.getElementById('region_nombre').value = "";
                
            } catch (error) {
                console.error("Error al procesar la solicitud");
            } finally {
            }
    };

    const handleDataChange = (field, value) => {
        setData(field, value);
    };

    const handleCancel = () => {
        setData({
            nombre:           user.nombre || "",
            apellido:         persona.apellido || "",
            ciudad:           user.ciudad || "",
            provincia:        user.provincia || "",
            telefono:         user.telefono || "",
            trabaja_emprende: persona.trabaja_emprende || "",
            estudio_id:       persona.estudio_id || "",
            region_id:        persona.region_id || "",
            biografia:        persona.biografia || "",
        });
        if (onCancel) onCancel();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Editar mis Datos" />

            <div className="max-w-2xl mx-auto px-4 pb-10 relative z-10">
                <div className="mb-4">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Editar mis Datos
                    </h1>
                </div>

        <section className={`${className} w-full`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3 mb-5">
                Información personal
            </h2>

            <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre *" />
                        <TextInput
                            id="nombre"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.nombre}
                            onChange={(e) => setData("nombre", e.target.value)}
                            required
                        />
                        <InputError message={errors.nombre} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="apellido" value="Apellido *" />
                        <TextInput
                            id="apellido"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.apellido}
                            onChange={(e) =>
                                setData("apellido", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.apellido}
                            className="mt-2"
                        />
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                        <InputLabel htmlFor="provincia" value="Provincia *" />
                        <SelectInput
                            options={provincias}
                            value={data.provincia_id}
                            onChange={handleProvinciaChange}
                        />
                        <InputError
                            message={errors.provincia_id}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="ciudad" value="Ciudad *" />
                        <SelectInput
                            options={ciudades}
                            value={data.ciudad_id}
                            onChange={handleCiudadChange}
                        />
                        <InputError message={errors.ciudad_id} className="mt-2" />
                    </div>

                    
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div>
                        <InputLabel htmlFor="region_nombre" value="Región *" />
                        <TextInput
                            id="region_nombre"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.region_nombre}
                            disabled
                        />
                        
                        <input
                            id="region_id"
                            name="region_id"
                            type="hidden"
                            value="">
                        </input>
                        <InputError message={errors.region_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="telefono" value="Teléfono *" />
                        <TextInput
                            id="telefono"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.telefono}
                            onChange={(e) =>
                                setData("telefono", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.telefono}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="trabaja_emprende" value="Trabaja/Emprende *" />
                        <select
                            value={data.trabaja_emprende}
                            onChange={(e) => handleDataChange("trabaja_emprende", e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                        >
                            <option value="" disabled>Seleccione...</option>
                            <option value="No" {...data.trabaja_emprende=="No"? 'selected' : ''}>No</option>
                            <option value="Trabaja" {...data.trabaja_emprende=="Trabaja"? 'selected' : ''}>Trabaja</option>
                            <option value="Emprende" {...data.trabaja_emprende=="Emprende"? 'selected' : ''}>Emprende</option>
                            <option value="Ambos" {...data.trabaja_emprende=="Ambos"? 'selected' : ''}>Ambos</option>
                        </select>
                        <InputError message={errors.trabaja_emprende} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="estudio_id" value="Estudios *" />
                        <SelectInput
                            options={estudios}
                            value={data.estudio_id}
                            onChange={(e) => setData("estudio_id", e.target.value)}
                        />
                        <InputError message={errors.estudio_id} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="biografia" value="Biografía" />
                    <textarea
                        id="biografia"
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm resize-vertical"
                        value={data.biografia}
                        onChange={(e) => setData("biografia", e.target.value)}
                        rows="4"
                        maxLength="500"
                        placeholder="Contanos un poco sobre vos..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        {data.biografia?.length || 0}/500 caracteres
                    </p>
                    <InputError message={errors.biografia} className="mt-2" />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <PrimaryButton
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto"
                    >
                        Guardar
                    </PrimaryButton>

                    <SecondaryButton
                        type="button"
                        onClick={handleCancel}
                        className="w-full sm:w-auto"
                    >
                        Cancelar
                    </SecondaryButton>

                    <div className="flex-1 sm:flex-none">
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600">
                                Guardado correctamente.
                            </p>
                        </Transition>
                    </div>

                </div>
            </form>
            <ActualizarIntereses
                currentInterests={props.currentInterests || []}
                className="mx-auto w-full sm:max-w-2xl"
                onCancel={() => setSeccionAbierta(null)}
            />
            </div>
        </section>
    </div>
</AuthenticatedLayout>
    );
}
