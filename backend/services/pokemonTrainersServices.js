/**
 * @module PokemonTrainers
 *
 * This file contains all the require services to handle the operation of the CRUD
 * module pokemon trainers. Here are managed the 4 classic http request:
 *
 * @method GET --> read all the trainers stored...
 * @method POST --> crea a new trainer register...
 * @method PUT --> update the info of a specific trainer register...
 * @method DELETE --> delete a trainer...
 * @method GET --> this second method get is to create a csv file with all pokemon trainers...
 */
import Trainers from '../models/pokemonTrainersModel.js';

/**
 * @method GET
 *
 * This service helps me to retrieve all the registers in the trainers collection, and it can also help
 * to make dynamic search by name...
 *
 * @param {string} search
 * @returns {trainers} []
 */
const getTrainers = async (search) => {
    try {
        // extract data from the database...
        const trainers = await Trainers.find();

        // if no data was found, we let the customer know...
        if(!trainers){
            console.error('Data not found.');
            throw new Error('Data not found.');
        }

        // alphabetize the data...
        let sortedTrainersData = trainers.map((t) => {
            return {
                id: t._id,
                nombre: t.nombre,
                apellidos: t.apellidos,
                telefono: t.telefono,
                medallas: t.medallas
            }
        }).sort((a, b) => {
            // Sort alphabetically by name
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });

        //if there is data in the search variable we do the filtering...
        if(search){
            sortedTrainersData = sortedTrainersData.filter(t => t.name.includes(search.toLowerCase()));
        }

        // returns the data...
        return sortedTrainersData || [];
    } catch (error) {
        console.error(`error: ${error.message}`);
        throw new Error(`Error: ${error.message}`);
    }
}

/**
 * @method POST
 *
 * This service helps me to create new registers in the collection of trainers, we can create one by one or several at
 * the same time...
 *
 * @param {array} trainers - array of trainer objects to be inserted...
 * @returns {result}
 * @throws {Error} --> error if insertion fails...
 */
const createTrainer = async (trainers) => {
    try {
        //check if trainers is an array and has at least one record...
        if(!Array.isArray(trainers) || trainers.length === 0){
            throw new Error('The trainers parameter must be a non-empty array.');
        }

        // Insert records into the collection...
        const result = await Trainers.insertMany(trainers);

        // return the result const...
        return result;
    } catch (error) {
        console.error(`Error creating trainers: ${error.message}`);
        throw new Error(`Failed to create trainers: ${error.message}`);
    }
}

/**
 * @method PUT
 *
 * This service helps to handle the process of update the data of a specific trainer, or trainers,
 * it recive as a param an object array call trainers, which has inside the trainers and their info to be
 * update...
 *
 * @param {Object array} trainers
 * @returns {}
 */
const updateTrainers = async (trainers) => {
    try {
        // check if trainers is an array and has at leats one record...
        if(!Array.isArray(trainers) || trainers.length === 0){
            console.log(trainers);
            throw new Error('The trainers parameter must be a non-empty array.');
        }

        // variable to store the results of each update...
        const updateResults = [];

        // iterate each trainer in the trainers array to update their information...
        for(const trainer of trainers){
            // ensure that each trainer has an id tu update their info...
            if(!trainer._id){
                throw new Error(`Each trainer object must have and id field. Missing id for ${JSON.stringify(trainer.name)}`);
            }

            // update the trainer data in the database...
            const updateTrainer = await Trainers.findByIdAndUpdate(
                trainer._id,
                { $set: trainer },
                { new: true, runValidators: true }
            );

            // add the result into updateResults array...
            updateResults.push(updateTrainer);
        }

        // return an object with the results of the updates...
        return updateResults;
    } catch (error) {
        console.error(`Error updating trainers: ${error.message}`);
        throw new Error(`Failed to update trainers: ${error.message}`);
    }
}

export { getTrainers, createTrainer, updateTrainers };