import { useState } from "react"

export default function TrainerForm({ handleAddTrainer, data, methodType, openForm }){

    const [newTrainer, setNewTrainer] = useState({
        id: data.id || '',
        nombre: data.nombre || '',
        apellidos: data.apellidos || '',
        telefono: data.telefono ||  '',
        medallas: data.medallas || ''
    });

    const [errors, setErrors] = useState({});

    // Validación de campos
    const validateInputs = () => {
        const newErrors = {};
        if (!newTrainer.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        if (!newTrainer.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios';
        if (!newTrainer.telefono.trim() || !/^\d+$/.test(newTrainer.telefono)) newErrors.telefono = 'Obligatorio y debe ser numérico';
        if (newTrainer.medallas === '' || isNaN(newTrainer.medallas)) newErrors.medallas = 'Deben ser un número';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
    };


    const handleInputs = (e) => {
        const { name, value } = e.target;
        setNewTrainer((prevTrainer) => ({
            ...prevTrainer,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateInputs()) {
            // Si la validación pasa, llama a la función handleAddTrainer con los datos del nuevo entrenador
            await handleAddTrainer(newTrainer, methodType);
            // Limpia los campos después de enviar
            setNewTrainer({
                id: '',
                nombre: '',
                apellidos: '',
                telefono: '',
                medallas: ''
            });
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setNewTrainer({
            id: '',
            nombre: '',
            apellidos: '',
            telefono: '',
            medallas: ''
        });
        openForm(false);
    }

    const inputStyle = {
        backgroundColor: 'rgba(128, 128, 128, 0.158)',
        borderRadius: '0.3em',
        padding: '0.8em 1em',
        color: 'black',
        fontWeight: '400',
        letterSpacing: '0.02em',
        outline: 'none'
    }

    const btnStyle = {
        marginTop: '1.5em',
        padding:'0.6em 0',
        width: '300px',
        borderRadius: '0.5em',
        fontSize: '1.1em',
        color: 'white'
    }

    return (
        <form
            className=" w-full py-5 px-5 rounded-md flex flex-col mb-1 shadow-md"
        >
            <ul
                className="w-full flex justify-between items-start"
            >
                <li
                    className="flex flex-col"
                >
                    <label htmlFor="nombre">
                        Nombre:
                    </label>
                    <input
                        style={inputStyle}
                        type="text"
                        placeholder="Agregue el nombre"
                        value={newTrainer.nombre}
                        name="nombre"
                        id="nombre"
                        onChange={handleInputs}
                    />
                    {errors.nombre && <span style={{ color: 'red' }}>{errors.nombre}</span>}
                </li>
                <li
                    className="flex flex-col"
                >
                    <label htmlFor="apellidos">
                        Apellidos:
                    </label>
                    <input
                        style={inputStyle}
                        type="text"
                        placeholder="Agregue los apellidos"
                        value={newTrainer.apellidos}
                        name="apellidos"
                        id="apellidos"
                        onChange={handleInputs}
                    />
                    {errors.apellidos && <span style={{ color: 'red' }}>{errors.apellidos}</span>}
                </li>
                <li
                    className="flex flex-col"
                >
                    <label htmlFor="telefono">
                        Telefono:
                    </label>
                    <input
                        style={inputStyle}
                        type="text"
                        placeholder="Agregue el telefono"
                        value={newTrainer.telefono}
                        name="telefono"
                        id="telefono"
                        onChange={handleInputs}
                    />
                    {errors.telefono && <span style={{ color: 'red' }}>{errors.telefono}</span>}
                </li>
                <li
                    className="flex flex-col"
                >
                    <label htmlFor="medallas">
                        Medallas:
                    </label>
                    <input
                        style={inputStyle}
                        type="number"
                        placeholder="Numero de medallas"
                        value={newTrainer.medallas}
                        name="medallas"
                        id="medallas"
                        onChange={handleInputs}
                    />
                    {errors.telefono && <span style={{ color: 'red' }}>{errors.telefono}</span>}
                </li>
            </ul>
            <div
                className="w-full py-3 flex justify-around items-center"
            >
                <button style={{...btnStyle, backgroundColor: 'rgba(0, 128, 0, 0.617)'}} onClick={handleSubmit}>Enviar</button>
                <button style={{...btnStyle, backgroundColor: 'rgba(255, 0, 0, 0.617)'}} onClick={handleCancel}>Cancelar</button>
            </div>
        </form>
    )
}