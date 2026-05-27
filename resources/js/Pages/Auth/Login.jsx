import InputError from "@/Components/InputError";
import RoundedButton from "@/Components/RoundedButton";
import RoundedInputText from "@/Components/RoundedInputText";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { useValidation } from "@/utils/validaciones";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // validaciones basicas en la vista, en conjunto con @/utils/validaciones
    const { validateField } = useValidation();
    const [clientErrors, setClientErrors] = useState({});

    const isFormValid = data.email.trim() !== "" && data.password.trim() !== "";

    const hasAuthError = errors.email || errors.password;

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setData("email", value);

        if (clientErrors.email && value.trim() !== "") {
            setClientErrors((prev) => ({
                ...prev,
                email: null,
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setData("password", value);

        if (clientErrors.password && value.trim() !== "") {
            setClientErrors((prev) => ({
                ...prev,
                password: null,
            }));
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // se validan todos los campos antes de enviar
        const emailError = validateField("email", data.email);
        const passwordError = validateField("password", data.password);

        if (emailError || passwordError) {
            setClientErrors({
                email: emailError,
                password: passwordError,
            });
            return;
        }

        setClientErrors({});

        post(route("login"), {
            onSuccess: () => {
                window.location.reload();
            },
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            <div className="w-full max-w-sm">
                {/* Card blanca */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden px-8 py-8 relative">

                    {/* ── Fondo decorativo con recursos NQN ── */}
                    {/* Amancay degradé — arriba derecha, grande */}
                    <img src="/images/iconos/Recurso amancay degrade 1.png" alt="" aria-hidden="true"
                        className="absolute -top-6 -right-6 w-36 h-36 object-contain opacity-[0.12] pointer-events-none select-none" />
                    {/* Araucaria degradé — abajo izquierda */}
                    <img src="/images/iconos/Recurso araucaria degrade 2.png" alt="" aria-hidden="true"
                        className="absolute -bottom-6 -left-6 w-32 h-32 object-contain opacity-[0.10] pointer-events-none select-none rotate-12" />
                    {/* Sol — arriba izquierda, chico */}
                    <img src="/images/iconos/sol verde.png" alt="" aria-hidden="true"
                        className="absolute top-4 left-4 w-12 h-12 object-contain opacity-[0.08] pointer-events-none select-none" />
                    {/* Huella — centro derecha */}
                    <img src="/images/iconos/huella celeste.png" alt="" aria-hidden="true"
                        className="absolute top-1/2 -right-3 w-14 h-14 object-contain opacity-[0.08] pointer-events-none select-none -translate-y-1/2" />
                    {/* Muticia — abajo derecha */}
                    <img src="/images/iconos/muticia rosa (2).png" alt="" aria-hidden="true"
                        className="absolute bottom-8 right-4 w-10 h-10 object-contain opacity-[0.08] pointer-events-none select-none" />
                    {/* Lanin — centro izquierda */}
                    <img src="/images/iconos/lanin celeste.png" alt="" aria-hidden="true"
                        className="absolute top-1/2 -left-3 w-12 h-12 object-contain opacity-[0.07] pointer-events-none select-none -translate-y-1/2 -rotate-12" />

                    {/* Logo */}
                    <div className="flex justify-center mb-5 relative z-10">
                        <img
                            src="/images/logo-navbar-nqnjoven.png"
                            alt="NQN Joven"
                            className="h-14 object-contain"
                        />
                    </div>

                    {/* Separador celeste */}
                    <div className="mx-auto mb-5 h-0.5 w-3/4 rounded-full relative z-10" style={{ background: "#00d9fa" }} />

                    <div className="relative z-10">
                        <h2 className="text-center text-xl font-bold mb-1" style={{ color: "#0a0236" }}>
                            ¡Bienvenido de nuevo!
                        </h2>
                        <p className="text-center text-sm mb-6" style={{ color: "#6b7280" }}>
                            Iniciá sesión para continuar
                        </p>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} noValidate>
                            {/* Email */}
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <img src="/svg/user-icon.svg" alt="Usuario" className="h-5 w-5 opacity-40" />
                                </div>
                                <RoundedInputText
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full pl-5 pr-10"
                                    placeholder="Correo electrónico"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={handleEmailChange}
                                />
                            </div>

                            {/* Password */}
                            <div className="mt-4 relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <img
                                        src={showPassword ? "/svg/eye-on.svg" : "/svg/eye-off.svg"}
                                        alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        className="h-5 w-5 opacity-40 cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={togglePasswordVisibility}
                                    />
                                </div>
                                <RoundedInputText
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full pl-5 pr-10"
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                    onChange={handlePasswordChange}
                                />
                            </div>

                            {/* Errores */}
                            {(clientErrors.email || clientErrors.password) && (
                                <div className="mt-4 flex justify-center">
                                    <InputError
                                        message={clientErrors.email || clientErrors.password}
                                        className="text-center font-semibold"
                                    />
                                </div>
                            )}
                            {hasAuthError && !clientErrors.email && !clientErrors.password && (
                                <div className="mt-4 flex justify-center">
                                    <InputError
                                        message="Credenciales incorrectas"
                                        className="text-center font-semibold"
                                    />
                                </div>
                            )}

                            {/* Botón principal */}
                            <div className="flex flex-col items-center mt-6">
                                <RoundedButton
                                    disabled={processing || !isFormValid}
                                    className="w-full justify-center px-0"
                                    style={{ background: "#5d4dff", color: "#ffffff" }}
                                >
                                    {processing ? "Ingresando..." : "Iniciar sesión"}
                                </RoundedButton>
                            </div>

                            {/* Links secundarios */}
                            <div className="mt-5 flex flex-col items-center gap-2">
                                <Link
                                    href={route("register")}
                                    className="text-sm font-semibold transition-colors" style={{ color: "#00a8c4" }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#007a90"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#00a8c4"}
                                >
                                    ¿No tenés cuenta?{" "}
                                    <span className="underline underline-offset-2">Registrate</span>
                                </Link>
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
