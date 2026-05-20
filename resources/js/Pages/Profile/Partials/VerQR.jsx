import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { QRCodeSVG } from 'qrcode.react';

export default function VerQR({ className = "", onCancel }) {
    const { props } = usePage();
    const user = props.auth.user;
    const persona = props.persona || {};

    return (
        <section className={`${className} w-full sm:flex-1 flex flex-col sm:flex-row items-center`}>
            
            <div className="flex flex-col items-center" style={{ height: "auto", margin: "0 auto", width: "100%" }}>
                            <QRCodeSVG 
                                size={300} 
                                value="QR validado por Chayanne" 
                            />
                        </div>

        </section>
    );
}
