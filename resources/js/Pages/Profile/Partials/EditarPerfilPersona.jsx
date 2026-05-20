import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";

export default function EditarPerfilPersona({ className = "", onCancel }) {
    const { props } = usePage();
    const user = props.auth.user;
    const regiones = props.regiones;
    const estudios = props.estudios;
    const persona = props.persona || {};

    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            nombre: user.nombre || "",
            apellido: persona.apellido || "",
            ciudad: user.ciudad || "",
            provincia: user.provincia || "",
            telefono: user.telefono || "",
            trabaja_emprende: persona.trabaja_emprende || "",
            estudio_id: persona.estudio_id || "",
            region_id: persona.region_id || "",
            biografia: persona.biografia || "",
        });

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

    const handleDataChange = (field, value) => {
        setData(field, value);
    };

    const handleCancel = () => {
        setData({
            nombre: user.nombre || "",
            apellido: persona.apellido || "",
            biografia: persona.biografia || "",
        });
        if (onCancel) onCancel();
    };

    return (
        <section className={`${className} w-full`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Información personal
                </h2>
                
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
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
                        <InputLabel htmlFor="ciudad" value="Ciudad *" />
                        <TextInput
                            id="ciudad"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.ciudad}
                            onChange={(e) => setData("ciudad", e.target.value)}
                            required
                        />
                        <InputError message={errors.ciudad} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="provincia" value="Provincia *" />
                        <TextInput
                            id="provincia"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.provincia}
                            onChange={(e) =>
                                setData("provincia", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.provincia}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div>
                        <InputLabel htmlFor="region_id" value="Regiones *" />
                        <SelectInput
                            options={regiones}
                            value={data.region_id}
                            onChange={(e) => setData("region_id", e.target.value)}
                            onBlur={(e) => onFieldValidation("region_id", e.target.value)}
                        />
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
                            onChange={(e) => {
                                handleDataChange("trabaja_emprende", e.target.value);
                                
                            }}
                            onBlur={(e) =>
                                onFieldValidation("trabaja_emprende", e.target.value)
                            }
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
                                            onBlur={(e) => onFieldValidation("estudio_id", e.target.value)}
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
        </section>
    );
}
