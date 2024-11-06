/**
 * @module PokeApi
 *
 * This file contains all the necessary service to manage the operation
 * of the PokenApi module...
 */
import { generatePDF } from '../utils/pdfGenerator.js';
import axios from "axios";

/**
 * @method GET https://pokeapi.co/api/v2/pokemon/wartortle/
 *
 * This service helps me to sear for the required data, with paging and limiting to a
 * specific number of elements to return, it also allows the search by name, and arranges
 * the data in alphabetical order...
 *
 * @param param {page, limit}
 * @returns pokemon_data [object]
 */
const getPokemons = async (params) => {
    // check if the search parameter has any value or not, if so the url queries change...
    const url_poke = `https://pokeapi.co/api/v2/pokemon/?offset=${params.page}&limit=${params.limit}`;

    try {
        // fetch the data from the poke api...
        const response = await axios.get(url_poke);
        // extract the data...
        let pokemons = response.data.results;

        // sort the elemenst...
        pokemons = pokemons.map((poke) => {
            return {
                name: poke.name,
                url: poke.url
            };
        }).sort((a, b) => {
            // Sort alphabetically by name
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });

        /**
         * here we extract the following pokemon data: id, name, abilities, base_experience,
         * height, weight, moves, and photo...
         */
        let pokemnos_data = await Promise.all(pokemons.map(async (poke) => {
            try {
                // fetch the data of the pokemon...
                const pokemonResponse = await axios.get(poke.url);
                const pokemon = pokemonResponse.data;

                // create a new object with the needed information and return it...
                return {
                    id: pokemon.id,
                    name: pokemon.name,
                    base_experience: pokemon.base_experience,
                    species_name: pokemon.species.name,
                    images: {
                        front: pokemon.sprites.front_default,
                        back: pokemon.sprites.back_default,
                        dream_world: pokemon.sprites.other?.dream_world?.front_default || null
                    },
                    weight: pokemon.weight,
                    height: pokemon.height,
                    moves: pokemon.moves.slice(0, 5).map(move => move.move.name),
                    abilities: pokemon.abilities.map(ability => ability.ability.name)
                }
            } catch (error) {
                console.error(`Error al obtener datos para ${poke.name}:`, error.message);
                return null;
            }
        }));

        // if the client is searching, we filter here...
        if(params.search){
            pokemnos_data = pokemnos_data.filter(poke => poke.name.includes(params.search.toLowerCase()));
        }

        return pokemnos_data || [];
    } catch (error) {
        console.log(`Error: ${error}`);
        throw new Error(error);
    }
}

/**
 * @method GET
 *
 * This service helps me to handle the process of create a PDF with the info of a
 * specific Pokemon...
 *
 * @param { pokemon_data }
 * @returns pdfBuffer
 */
const getPokemonPDF = async (pokemon_data) => {

    // check if all the info was recive...
    if(!pokemon_data.image || !pokemon_data.name || pokemon_data.abilities.length === 0){
        throw new Error('Missing required Pokémon data: image, name, or abilities');
    }

    try {
        // generate the PDF from the pokemon_data...
        const pdfBuffer = await generatePDF(pokemon_data);

        if(!pdfBuffer){
            throw new Error('Failed to generate PDF');
        }

        return pdfBuffer;
    } catch (error) {
        console.error('Error generating PDF:', error.message);
        // Handle the error properly, e.g., by throwing an error or sending a custom response
        throw new Error('Failed to generate Pokémon PDF');
    }
}

export { getPokemons, getPokemonPDF };