/**
 * @module PokeApi
 * @module pokemonTrainers
 *
 * In this file we can find all the needed routes for both modules, poke api and pokemon trainers...
 */
import express from 'express';
import { getPokemonsController, getPokemonPDFController } from '../controllers/pokemonControllers.js';

const router = express.Router();

/**
 * @module PokeApi
 */
// route to get the list of pokemons with optional pagination and search...
router.get('/', getPokemonsController);
// route to generate a PDF of pokemon details
router.get('/pdf', getPokemonPDFController);

/**
 * @module pokemonTrainers
 */

export default router;