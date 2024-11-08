import { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard";

export default function PokemonDisplay({ handleSearch, limit, page}){
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemons = async () => {
            const url = `http://localhost:3001/api/pokemon/?limit=${limit}&page=${page}&search=${handleSearch}`;

            try {
                setLoading(true); // start the loading...
                const response = await axios.get(url);
                setPokemons(response.data.pokemons);
                setLoading(false);
            } catch (error) {
                setError("Error al cargar los pokemons"); // Maneja el error
                setLoading(false);
            }
        }

        fetchPokemons();
    }, [limit, page, handleSearch]);


    const handlePdfMaker = async (pokemon) => {
        const pokemon_data = {
            image: pokemon.images.dream_world,
            name: pokemon.name,
            abilities: pokemon.abilities
        }

        try {
            // Hacer una petición GET y enviar los datos del pokemon
            const response = await axios.post('http://localhost:3001/api/pokemon/pdf', {
                pokemon_data
            }, {
                responseType: 'arraybuffer'  // Especificamos que esperamos un buffer binario como respuesta
            });

            // Crear un Blob a partir de la respuesta binaria
            const blob = new Blob([response.data], { type: 'application/pdf' });

            // Crear un enlace para descargar el PDF
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${pokemon.name}_pokemon.pdf`;
            link.click();

        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div
            className="w-full py-4 flex flex-wrap gap-3 justify-start items-start"
        >
            {pokemons.map((pokemon, index) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} number={index} pdfMaker={handlePdfMaker}/>
            ))}
        </div>
    );
}