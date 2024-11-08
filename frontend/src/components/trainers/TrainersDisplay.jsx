import { useState, useEffect } from "react";
import axios from "axios";
import TrainersCell from "./TrainersCell";

export default function TrainersDisplay({ handleSearch, flag, setFlag, data, setData, openForm, methodType}){
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrainers = async () => {
            const url = `http://localhost:3001/api/pokemon/trainers/?search=${handleSearch}`;

            try {
                setLoading(true); // start the loading...
                const response = await axios.get(url);
                setTrainers(response.data.trainers);
                setLoading(false);
            } catch (error) {
                setError("Error al cargar los entrenadores pokemon"); // Maneja el error
                setLoading(false);
            }
        }

        fetchTrainers();
    }, [handleSearch, flag]);

    const deleteATrainer = async (id) => {
        const url = 'http://localhost:3001/api/pokemon/delete-trainers/';
        let trainers_ids = [];

        trainers_ids.push(id);
        try {
            await axios.delete(url, {
                data: { trainers_ids }
            });

            setFlag(prevFlag => prevFlag + 1);

            console.log("Entrenador eliminado exitosamente");
        } catch (error) {
            console.error("Error al eliminar el entrenador:", error.message);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleButtonClick = async (btnType, id, data) => {
        switch(btnType){
            case 'update':
                setData(data);
                openForm(true);
                methodType('update');
            break;
            case 'delete':
                await deleteATrainer(id);
            break;
            default:
            break;
        }
    }

    return (
        <div
            className="w-full flex flex-col justify-start items-start"
        >
            <div className="celdas-trainers">
                <ul>
                    <li className="text-pokebolRed font-bold tracking-wider text-lg">Nombre</li>
                    <li className="text-pokebolRed font-bold tracking-wider text-lg">Apellidos</li>
                    <li className="text-pokebolRed font-bold tracking-wider text-lg">Telefono</li>
                    <li className="text-pokebolRed font-bold tracking-wider text-lg">Medallas</li>
                    <li className="text-pokebolRed font-bold tracking-wider text-lg">Actualizar - Borrar</li>
                </ul>
            </div>
            {trainers.map((trainer, index) => (
                <TrainersCell key={index} trainer={trainer} onClick={handleButtonClick}/>
            ))}
        </div>
    )
}