/**
 * @module PokeApi
 *
 * This file contains all the required controllers for the PokeApi module...
 */
import { getPokemons, getPokemonPDF } from '../services/pokemonServices.js';

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

/**
 * @method GET
 *
 * This controller helps me to handle the process of recive info of a pokemon from the client, and
 * use the service "getPokemoPDF" to create a pdf with the name, image and abilities of a specific
 * pokemon...
 *
 * @param req.body
 * @returns pdfBuffer
 */
const getPokemonPDFController = async (req, res) => {
    try {
        const { pokemon_data } = req.body;

        if(!pokemon_data){
            res.status(400).json({
                error: 'Missing pokemon data in the request'
            });
        }

        // generate the PDF buffer using the pokemon data...
        const pdfBuffer = await getPokemonPDF(pokemon_data);

        // if PDF generationg failed, send an error response...
        if(!pdfBuffer){
            res.status(500).json({
                error: 'Failed to generate PDF'
            });
        }

        //Set the content type to PDF and send the file buffer
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export { getPokemonsController, getPokemonPDFController };