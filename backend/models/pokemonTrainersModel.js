/**
 * @module PokemonTrainers
 *
 * This file contains the pokemon trainers model, to CRUD the collection trainers...
 */
import mongoose from "mongoose";

/**
 * the shcema has to have the following fields:
 * 1. nombre
 * 2. apellidos
 * 3. numero
 * 4. medallas de gimnasio obtenidas
 */
const TrainersSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    telefono: { type: String },
    medallas: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Trainers', TrainersSchema);