/**
 * @module PokemonTrainers
 *
 * This file contains all the required controllers to handle the operation of the CRUD
 * of the pokemon trainers module...
 */
import {
    getTrainers,
    createTrainer,
    updateTrainers
} from "../services/pokemonTrainersServices.js";

/**
 * @method GET
 *
 * Controller to handle the process of retrieve register from the trainers collection, in the
 * mongodb database... the data is obtained sorted and if necessary you can search for the trainer
 * by name...
 *
 * @param req.query { search }
 * @returns res.json()
 */
const getTrainersController = async (req, res) => {
    const { search } = req.query;

    try {
        const trainers = await getTrainers(search);

        // return the data...
        res.status(200).json({
            trainers
        });
    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error.message}`
        });
    }
}

/**
 * @method POST
 *
 * Controller to handle the process of create new registers o register.
 *
 * @param {trainers[]} req.body
 * @returns {res.json()}
 */
const createTrainerController = async (req, res) => {
    // deconstruting req.body object...
    const { trainers } = req.body;

    try {
        const response = await createTrainer(trainers);

        res.status(200).json({
            message: `${response.length} entrenadores han sido guardados con exito.`,
            trainers: response
        });

    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error.message}`
        });
    }
}

/**
 * @method PUT
 *
 * This controller helps me to handle the process of update a trainer record o several of them
 * at the same time.
 *
 * @param req.body
 * @returns updateResults
 */
const updateTrainersController = async (req, res) => {
    // deconstruting the req.body to retrieve the object array trainers...
    const { trainers } = req.body;

    try {
        // update the data...
        const response = await updateTrainers(trainers);

        // check if there was any updated...
        if(response.length === 0){
            res.status(404).json({
                message: 'Trainers or trainer not found.'
            });
        }

        // everything went well...
        res.status(200).json({
            message: `${response.length} trainers updated successfully`,
            response
        });

    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error.message}`
        });
    }
}

export { getTrainersController, createTrainerController, updateTrainersController };