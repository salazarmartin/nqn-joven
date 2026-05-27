import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useRef } from "react";
import { toast } from "react-hot-toast";

export default function UpdatePasswordForm({ className = "", onCancel }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const { props } = usePage();
    const auth = props.auth;

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();
        const toastId = toast.loading("Actualizando contraseña...");

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success("Contraseña actualizada correctamente.");
            },
            onError: () => {
                toast.dismiss(toastId);
                toast.error("Hubo un error al actualizar la contraseña.");
            },
            onFinish: () => toast.dismiss(toastId),
        });
    };

    const handleCancel = () => {
        reset();
        if (onCancel) onCancel();
    };

    return (
                <AuthenticatedLayout user={auth.user}>
                    <Head title="Editar mis Datos" />
        
                    <div className="max-w-2xl mx-auto px-4 pb-10 relative z-10">
                        <div className="mb-4">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                Cambiar contraseña
                            </h1>
                        </div>

        <section className={`${className} w-full`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3 mb-5">Actualizar contraseña</h2>

            <form onSubmit={updatePassword} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="current_password" value="Contraseña actual" />
                        <TextInput id="current_password" ref={currentPasswordInput} value={data.current_password} onChange={(e) => setData("current_password", e.target.value)} type="password" className="mt-1 block w-full" autoComplete="current-password" />
                        <InputError message={errors.current_password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Nueva contraseña" />
                        <TextInput id="password" ref={passwordInput} value={data.password} onChange={(e) => setData("password", e.target.value)} type="password" className="mt-1 block w-full" autoComplete="new-password" />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" />
                    <TextInput id="password_confirmation" value={data.password_confirmation} onChange={(e) => setData("password_confirmation", e.target.value)} type="password" className="mt-1 block w-full" autoComplete="new-password" />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <PrimaryButton type="submit" disabled={processing} className="w-full sm:w-auto">Guardar</PrimaryButton>
                    <SecondaryButton type="button" onClick={handleCancel} className="w-full sm:w-auto">Cancelar</SecondaryButton>

                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                        <p className="text-sm text-gray-600">Actualizada.</p>
                    </Transition>
                </div>
            </form>
            </div>
        </section>

        </div>
        </AuthenticatedLayout>
    );
}