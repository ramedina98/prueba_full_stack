/**
 * @module PokeApi
 * @module pokemonTrainers
 *
 * In this file we can find all the needed routes for both modules, poke api and pokemon trainers...
 */
import express from 'express';
import { getPokemonsController, getPokemonPDFController } from '../controllers/pokemonControllers.js';
import {
    getTrainersController,
    csvTrainersFileController,
    createTrainerController,
    updateTrainersController,
    deleteTrainersController
} from '../controllers/pokemonTrainersControllers.js';

const router = express.Router();

/**
 * @module PokeApi
 */
// route to get the list of pokemons with optional pagination and search...
router.get('/', getPokemonsController);
// route to generate a PDF of pokemon details
router.post('/pdf', getPokemonPDFController);

/**
 * @module pokemonTrainers
 */
// route to get the list of trainers...
router.get('/trainers/', getTrainersController);
// route to create a csv file with all the trainers stored...
router.get('/csv-trainers/', csvTrainersFileController);
// route to create a new record...
router.post('/new-trainers/', createTrainerController);
// route to update a record or several of them...
router.put('/update-trainers/', updateTrainersController);
// route to delete a record or several of them...
router.delete('/delete-trainers/', deleteTrainersController);

export default router;