import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function PersonaFormFields({
    handleCiudadChange,
    handleProvinciaChange,
    provincias,
    ciudades,
    estudios,
    data,
    errors,
    clientErrors,
    onDataChange,
    onFieldValidation,
    clearFieldError,
}) {
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <InputLabel className="block font-medium mb-1 dark:text-gray-300">
                    Nombre *
                </InputLabel>
                <TextInput
                    type="text"
                    value={data.nombre}
                    onChange={(e) => {
                        onDataChange("nombre", e.target.value);
                        clearFieldError("nombre");
                    }}
                    onBlur={(e) => onFieldValidation("nombre", e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                />
                {(clientErrors.nombre || errors.nombre) && (
                    <InputError
                        message={clientErrors.nombre || errors.nombre}
                        className="mt-1"
                    />
                )}
            </div>

            <div>
                <InputLabel className="block font-medium mb-1 dark:text-gray-300">
                    Apellido *
                </InputLabel>
                <TextInput
                    type="text"
                    value={data.apellido}
                    onChange={(e) => {
                        onDataChange("apellido", e.target.value);
                        clearFieldError("apellido");
                    }}
                    onBlur={(e) =>
                        onFieldValidation("apellido", e.target.value)
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                />
                {(clientErrors.apellido || errors.apellido) && (
                    <InputError
                        message={clientErrors.apellido || errors.apellido}
                        className="mt-1"
                    />
                )}
            </div>

            <div>
                <InputLabel className="block font-medium mb-1 dark:text-gray-300">
                    Teléfono *
                </InputLabel>
                <TextInput
                    type="text"
                    value={data.telefono}
                    onChange={(e) => {
                        onDataChange("telefono", e.target.value);
                        clearFieldError("telefono");
                    }}
                    onBlur={(e) =>
                        onFieldValidation("telefono", e.target.value)
                    }
                    placeholder="Ej: 299 123 4567"
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                />
                {(clientErrors.telefono || errors.telefono) && (
                    <InputError
                        message={clientErrors.telefono || errors.telefono}
                        className="mt-1"
                    />
                )}
            </div>

            <div>
                <InputLabel className="block font-medium mb-1 dark:text-gray-300">
                    Provincia *
                </InputLabel>
                <SelectInput
                    options={provincias}
                    value={data.provincia_id}
                    onChange={handleProvinciaChange}
                />
                {(clientErrors.provincia_id || errors.provincia_id) && (
                    <InputError
                        message={clientErrors.provincia_id || errors.provincia_id}
                        className="mt-1"
                    />
                )}
            </div>
            
            <div>
                <InputLabel className="block font-medium mb-1 dark:text-gray-300">
                    Ciudad *
                </InputLabel>
                <SelectInput
                    options={ciudades}
                    value={data.ciudad_id}
                    onChange={handleCiudadChange}
                />
                {(clientErrors.ciudad_id || errors.ciudad_id) && (
                    <InputError
                        message={clientErrors.ciudad_id || errors.ciudad_id}
                        className="mt-1"
                    />
                )}
            </div>

            <div className="max-w-full">
                <InputLabel className="block font-medium mb-1 dark:text-gray-300">
                    Región *
                </InputLabel>
                <TextInput
                                            id="region_nombre"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value=""
                                            disabled
                                        />
                                        
                                        <input
                                            id="region_id"
                                            name="region_id"
                                            type="hidden"
                                            value="">
                                        </input>
                
                {(clientErrors.region_id || errors.region_id) && (
                    <InputError
                        message={clientErrors.region_id || errors.region_id}
                        className="mt-1"
                    />
                )}
            </div>

            <div>
                <InputLabel className="block font-medium mb-1 dark:text-gray-300">
                    Fecha de nacimiento *
                </InputLabel>
                <TextInput
                    type="date"
                    value={data.fecha_nac}
                    onChange={(e) => {
                        onDataChange("fecha_nac", e.target.value);
                        clearFieldError("fecha_nac");
                    }}
                    onBlur={(e) =>
                        onFieldValidation("fecha_nac", e.target.value)
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                />
                {(clientErrors.fecha_nac || errors.fecha_nac) && (
                    <InputError
                        message={clientErrors.fecha_nac || errors.fecha_nac}
                        className="mt-1"
                    />
                )}
            </div>

            <div>
                <InputLabel className="block font-medium mb-1 dark:text-gray-300">
                    DNI *
                </InputLabel>
                <TextInput
                    type="number"
                    value={data.dni}
                    onChange={(e) => {
                        onDataChange("dni", e.target.value);
                        clearFieldError("dni");
                    }}
                    onBlur={(e) => onFieldValidation("dni", e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                />
                {(clientErrors.dni || errors.dni) && (
                    <InputError
                        message={clientErrors.dni || errors.dni}
                        className="mt-1"
                    />
                )}
            </div>

            <div>
                <InputLabel className="block font-medium mb-1 dark:text-gray-300">
                    Username *
                </InputLabel>
                <TextInput
                    type="text"
                    value={data.username}
                    onChange={(e) => {
                        onDataChange("username", e.target.value);
                        clearFieldError("username");
                    }}
                    onBlur={(e) => onFieldValidation("username", e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                />
                {(clientErrors.username || errors.username) && (
                    <InputError
                        message={clientErrors.username || errors.username}
                        className="mt-1"
                    />
                )}
            </div>

            <div>
                <InputLabel className="block font-medium mb-1 dark:text-gray-300">
                    Trabaja/Emprende *
                </InputLabel>
                <select
                    value={data.trabaja_emprende}
                    onChange={(e) => {
                        onDataChange("trabaja_emprende", e.target.value);
                        clearFieldError("trabaja_emprende");
                    }}
                    onBlur={(e) =>
                        onFieldValidation("trabaja_emprende", e.target.value)
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                >
                    <option value="">Seleccione...</option>
                    <option value="No">No</option>
                    <option value="Trabaja">Trabaja</option>
                    <option value="Emprende">Emprende</option>
                    <option value="Ambos">Ambos</option>
                </select>
                {(clientErrors.trabaja_emprende || errors.trabaja_emprende) && (
                    <InputError
                        message={clientErrors.trabaja_emprende || errors.trabaja_emprende}
                        className="mt-1"
                    />
                )}
            </div>
            
            <div className="max-w-full">
                <InputLabel className="block font-medium mb-1 dark:text-gray-300">
                    Estudios *
                </InputLabel>
                <SelectInput
                    options={estudios}
                    value={data.estudio_id}
                    onChange={(e) => onDataChange("estudio_id", e.target.value)}
                    onBlur={(e) => onFieldValidation("estudio_id", e.target.value)}
                />
                
                {(clientErrors.estudio_id || errors.estudio_id) && (
                    <InputError
                        message={clientErrors.estudio_id || errors.estudio_id}
                        className="mt-1"
                    />
                )}
            </div>

        </div>
    );
}
