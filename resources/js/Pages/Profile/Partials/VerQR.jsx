import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { QRCodeSVG } from 'qrcode.react';


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


export default function VerQR({ size = "", onCancel }) {
    const { props } = usePage();
    const user = props.auth.user;
    const persona = props.persona || {};

    return (
        <div className="grid grid-cols-2 gap-2 h-full flex items-center justify-end p-2 rounded-2xl group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition" 
                                                            style={{
                                                                background:
                                                                    "linear-gradient(90deg, #5d4dff 0%,  #0a0236 100%, rgba(237, 221, 83, 1) 100%)",  
                                                            }}>
                                                                <div style={{flex:"1",aspectRatio: "1/1",display: "flex",flexDirection: "column"}}>
                                                                    <div style={{alignSelf: "flex-start",}}>
                                                                        <p className="text-sm xs:text-2xl text-gray-300">
                                                                            MI CREDENCIAL
                                        
                                                                        </p>
                                                                    </div>
                                                                    <div style={{alignSelf: "flex-start", margin: "auto 0"}}>
                                                                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                                                                            {user.nombre} {user.persona.apellido}
                                                                        </h3>
                                                                        <p className="text-sm xs:text-2xl text-white">
                                                                            DNI {user.persona.dni} - <CalculoEdad fechaNacimiento={user.persona.fecha_nac} />
                                                                        </p>
                                        
                                        
                                                                        <div className="ml-1 my-2 max-w-max rounded-full" style={{
                                                                            background:
                                                                            "#2BEAFF",  
                                                                            width:
                                                                            "80px"
                                                                        }}>
                                                                            <p className="ml-1 mr-1 text-sm xs:text-2xs font-bold" style={{
                                                                                color:
                                                                                "#322B94",
                                                                            }}> 
                                                                                &#9679; {user.estado}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="rounded-xl grid place-items-center" style={{
                                                                    border:
                                                                    "1px solid gray",  
                                                                    background:
                                                                    "white",  
                                                                    flex:"1",
                                                                    aspectRatio: "1/1",
                                                                    marginLeft:
                                                                    "-7px"
                                                                }}>
                                                                    
                                                                    <QRCodeSVG 
                                                                        size="95%"
                                                                        value={persona.dni}
                                                                    />
                                                                    
                                                                </div>
                                                            </div>
        
    );
}
