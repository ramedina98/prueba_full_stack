/**
 * @module PokeApi
 *
 * This file contains all the required controllers for the PokeApi module...
 */
import axios from 'axios';
import { generatePDF } from '../utils/pdfGenerator.js';
import { getPokemons } from '../services/pokemonServices.js';

const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/';

/**
 * @method GET
 *
 * This controller helps me to handle the endpoint '/' which return a list of pokemons...
 * @params req.query { limit, page, search }
 * @returns res.json();
 */
const getPokemonsController = async (req, res) => {
    // deconstructing the req-query...
    const { limit, page, search } = req.query;

    // introduce the data into a new object...
    let paramsObject = {
        limit,
        page,
        search
    }

    try {
        // start the service...
        const pokemons = await getPokemons(paramsObject);

        res.status(200).json({
            pokemons
        });
    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error.message}`
        });
    }
}

// generate PDF of pokemon information...
const getPokemonPDF = async (req, res) => {
    const { name } = req.query;

    if(!name){
        res.status(400).json({
            error: 'Pokemon name is required for PDF generation'
        });
    }

    try {
        // fetch datailed data for the given pokemon name...
        const response = await axios.get(`${POKEMON_URL}/${name}`);
        const pokemon = response.data;

        // generate PDF and send it to the client...
        const pdfBuffer = await generatePDF(pokemon);
        res.setHeader('Content-Disposition', `attachment; filename=${name}.pdf`);
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({
            error: 'Error generating PDF'
        });
    }
}

export { getPokemonsController, getPokemonPDF };