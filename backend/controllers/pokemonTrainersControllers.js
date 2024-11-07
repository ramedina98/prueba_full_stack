/**
 * @module PokemonTrainers
 *
 * This file contains all the required controllers to handle the operation of the CRUD
 * of the pokemon trainers module...
 */
import {
    getTrainers,
    createTrainer,
    updateTrainers,
    deleteTrainers
} from "../services/pokemonTrainersServices.js";
import { stringify } from 'csv-stringify/sync';

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
 * @method GET
 *
 * This second GET controller helps me to retrieve all the trainers stored in the collection, and
 * create a csv file with write them in it...
 *
 * @returns {Buffer} csvBuffer...
 */
const csvTrainersFileController = async (_req, res) => {
    try {
        // 1. get all the trainers records...
        const trainers = await getTrainers();

        // 2. check if trainers has data to procces...
        if(!trainers || trainers.length === 0){
            throw new Error('No trainer data available to generate CSV.');
        }

        // 3. convert the data into CSV format...
        const csvData = trainers.map(trainer => ({
            nombre: trainer.nombre,
            apellidos: trainer.apellidos,
            telefono: trainer.telefono,
            medallas: trainer.medallas
        }));

        const csvBuffer = stringify(csvData, {
            header: true,
            columns: {
                nombre: 'Nombre',
                apellidos: 'Apellidos',
                telefono: 'Teléfono',
                medallas: 'Medallas'
            }
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=trainers.csv');
        res.send(csvBuffer);

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
            message: `${response.length} entrenadores actualizados con exito.`,
            response
        });

    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error.message}`
        });
    }
}

/**
 * @method DELETE
 *
 * Controller to handle the procces of delete ona or several records...
 *
 * @param {req, res} --> req.body
 * @returns res.json({});
 */
const deleteTrainersController = async (req, res) => {
    // deconstruting the req.body to retrieve the trainers_ids array...
    const { trainers_ids } = req.body;

    try {
        const response = await deleteTrainers(trainers_ids);

        res.status(200).json({ message: response });
    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error.message}`
        });
    }
}

export { getTrainersController, csvTrainersFileController, createTrainerController, updateTrainersController, deleteTrainersController };