import { useEffect, useState } from "react";
import UpperBar from "../components/UpperBar";
import PokemonDisplay from "../components/pokemons/PokemonDisplay";
import TrainersDisplay from "../components/trainers/TrainersDisplay";
import TrainerForm from "../components/trainers/TrainerForm";
import axios from "axios";

export default function PokédexContainer({ changeState }){
    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(15);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(0);
    const [addNewTrainer, setAddNewTrainer] = useState(false);
    const [flag, setFlag] = useState(0);
    const [data, setData] = useState({});
    const [methodType, setMethodType] = useState('');

    const handleSearchInput = (e) => {
        const strSearch = e.target.value;
        setSearch(strSearch.trim());
        console.log(search)
    }

    const handleLimitInput = (e) => {
        const limit = parseInt(e.target.value, 10);
        if(limit > 0){
            setLimit(limit);
            setPage(1);
            setPagination(0);
        }
    }


    const trainers = async (trainers, method) => {
        const url = `http://localhost:3001/api/pokemon/${method === 'create' ? 'new' : 'update'}-trainers/`;

        let trainers_data = [];

        if(method === 'update'){
            trainers_data.push({
                _id: trainers.id,
                nombre: trainers.nombre,
                apellidos: trainers.apellidos,
                telefono: trainers.telefonos,
                medallas: trainers.medallas
            });
        } else if(methodType === 'create'){
            trainers_data.push(trainers);
        }

        try {
            let response = '';
            if(method === 'create'){
                response = await axios.post(url, {trainers: trainers_data});
            } else if('update'){
                response = await axios.put(url, {trainers: trainers_data});
            }

            // Si la respuesta es exitosa, realiza las acciones necesarias
            if (response.status === 200 || response.status === 201) {
                setAddNewTrainer(prevState => !prevState); // Toggling el estado
                setFlag(prevFlag => prevFlag + 1); // Incrementando el flag para re-render
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error.message);
        }
    }

    const handlePrintCsvFileOfTrainers = async () => {
        try {
            // Realiza la solicitud GET al servidor para obtener el archivo CSV
            const response = await axios.get('http://localhost:3001/api/pokemon/csv-trainers/', {
                responseType: 'blob' // Configura para recibir el archivo como blob
            });

            // Crea un objeto URL para el blob recibido
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);

            // Crea un enlace de descarga y click
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'trainers.csv'); // Nombre del archivo descargado
            document.body.appendChild(link);
            link.click();

            // Limpia el enlace y el objeto URL
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el archivo CSV:", error.message);
        }
    }

    const handleButtonClick = async (buttonType) => {
        switch(buttonType){
            case 'previus':
                if(page > 1){
                    setPagination(prevPagination => prevPagination - limit);
                    setPage(prevPag => prevPag - 1);
                }
            break;
            case'next':
                setPagination(prevPagination => prevPagination + limit);
                setPage(prevPag => prevPag + 1);
            break;
            case 'add':
                setAddNewTrainer(!addNewTrainer);
                setData({});
                setMethodType('create');
            break;
            case 'print':
                await handlePrintCsvFileOfTrainers();
            break;
            default:
                console.log('Tipo desconocido');
            break;
        }
    }

    return (
        <div
            className="bg-white rounded-md flex flex-col justify-start items-center"
            style={{
                width: '1150px',
                minHeight: '61vh',
            }}
        >
            {addNewTrainer ? (
                <TrainerForm handleAddTrainer={trainers} data={data} methodType={methodType} openForm={setAddNewTrainer}/>
            ) : (
                <></>
            )}
            <UpperBar changeState={changeState} onChange={handleSearchInput} onClick={handleButtonClick} value={limit} limitChange={handleLimitInput} page={page} />
            {changeState ?
                (
                    <PokemonDisplay handleSearch={search} limit={limit} page={pagination}/>
                )
                :
                (
                    <TrainersDisplay handleSearch={search} flagProp={flag} flag={flag} setFlag={setFlag} data={data} setData={setData} openForm={setAddNewTrainer} methodType={setMethodType} />
                )
            }
        </div>
    )
}