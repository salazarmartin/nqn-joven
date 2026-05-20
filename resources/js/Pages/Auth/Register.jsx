import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import RoundedButton from "@/Components/RoundedButton";
import RoundedInputText from "@/Components/RoundedInputText";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { useValidation } from "@/utils/validaciones";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
        tipo_usuario: "persona",
    });

    const [nosepuedeconesemail, setNosepuede] = useState(null);

    const [isInstitution, setIsInstitution] = useState(false); // estado para saber si es institucion o no

    /* validaciones basicas en la vista, en conjunto con @/utils/validaciones */
    const { validateField } = useValidation();
    const [clientErrors, setClientErrors] = useState({});

    const isFormValid =
        data.email.trim() !== "" &&
        data.password.trim() !== "" &&
        data.password_confirmation.trim() !== "";

    
    
 const handleEmailChange = async (e) => {
        const value = e.target.value;
        setData("email", value);
            
            try {
                
                const url = `/registereduser/chequearemail/`+value;
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
                console.log(data);
                console.log("er:"+clientErrors.email);
                if (clientErrors.email && value.trim() !== "") {
                        setClientErrors((prev) => ({
                            ...prev,
                            email: null,
                        }));
                        console.log("entro"); 
                    }
                if(data.sepuede==false){
                    
                    setNosepuede(true);
                }else{
                    
                    setNosepuede(false);
                }

            } catch (error) {
                
                console.error("Error al procesar la solicitud");
            } finally {
                
            }
            
        console.log("var:"+nosepuedeconesemail);
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

    const handlePasswordConfirmationChange = (e) => {
        const value = e.target.value;
        setData("password_confirmation", value);

        if (clientErrors.password_confirmation && value.trim() !== "") {
            setClientErrors((prev) => ({
                ...prev,
                password_confirmation: null,
            }));
        }
    };

    const handleInstitutionChange = (e) => {
        const checked = e.target.checked;
        setIsInstitution(checked);
        setData("tipo_usuario", checked ? "institucion" : "persona");
    };

    // errores de registro en el servidor
    const hasServerError =
        (nosepuedeconesemail && errors.email) || errors.password || errors.password_confirmation;

    const submit = (e) => {
        e.preventDefault();

        // se validan todos los campos antes de enviar
        const emailError = validateField("email", data.email);
        const passwordError = validateField("password", data.password);
        const passwordConfirmationError = validateField(
            "confirmPassword",
            data.password_confirmation,
            data.password
        );

        if (emailError || passwordError || passwordConfirmationError) {
            setClientErrors({
                email: emailError,
                password: passwordError,
                password_confirmation: passwordConfirmationError,
            });
            return;
        }

        setClientErrors({});

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };
console.log("anteul-"+nosepuedeconesemail);
    return (
        <GuestLayout>
            <Head title="Register" />

            <form
                onSubmit={submit}
                noValidate
                className="w-full max-w-sm sm:max-w-md p-4 sm:p-8"
            >
                <div className="mt-4">
                    <InputLabel style={{color:"black"}} htmlFor="email" value="Correo electronico" />

                    <RoundedInputText
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full pl-5 pr-10"
                        placeholder="Ingresá tu correo electrónico"
                        autoComplete="username"
                        onChange={handleEmailChange}
                    />
                </div>

                <div className="mt-4">
                    <InputLabel style={{color:"black"}} htmlFor="password" value="Contraseña" />

                    <RoundedInputText
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full pl-5 pr-10"
                        placeholder="Ingresá tu contraseña"
                        autoComplete="new-password"
                        onChange={handlePasswordChange}
                    />
                </div>

                <div className="mt-4">
                    <InputLabel style={{color:"black"}} 
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                    />

                    <RoundedInputText
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full pl-5 pr-10"
                        placeholder="Confirmar contraseña"
                        autoComplete="new-password"
                        onChange={handlePasswordConfirmationChange}
                    />
                </div>

                <div className="mt-4 flex gap-3 items-center">
                    
                </div>

                {/* errores */}
                {(clientErrors.email ||
                    clientErrors.password ||
                    clientErrors.password_confirmation) && (
                    <div className="mt-6 flex justify-center">
                        <InputError
                            message={
                                clientErrors.email ||
                                clientErrors.password ||
                                clientErrors.password_confirmation
                            }
                            className="text-center font-semibold "
                        />
                    </div>
                )}
{console.log('-'+nosepuedeconesemail)}
                {
                nosepuedeconesemail &&
                    !clientErrors.email &&
                    !clientErrors.password &&
                    !clientErrors.password_confirmation && (
                        <div className="mt-6 flex justify-center">
                            <InputError
                                message={
                                    "El email ingresado ya se encontraba registrado en el sistema."
                                }
                                className="text-center font-semibold "
                            />
                        </div>
                    )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <Link
                        href={route("login")}
                        className="text-sm font-bold text-gray-600 hover:text-black focus:outline-none text-center"
                    >
                        ¿Ya estas registrado?
                    </Link>

                    <RoundedButton
                        className="w-full sm:w-auto justify-center"
                        disabled={processing || !isFormValid}
                    >
                        Registrarse
                    </RoundedButton>
                </div>
            </form>
        </GuestLayout>
    );
}
