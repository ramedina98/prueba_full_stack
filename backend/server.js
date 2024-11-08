// import necessary modules...
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/db.js'; // connection to the mongodb database...
import pokemonRoutes from './routes/pokemonRoutes.js';
// laod enviroment variables from .env file...
import dotenv from 'dotenv';
dotenv.config();

// create an instance of Express...
const app = express();
const PORT = process.env.PORT;

// connect to mongo...
connectDB();

// middleware...
app.use(bodyParser.json());

// middleware configuration...
app.use(cors()); // emable cors for all routes...
app.use(express.json()); // parse incoming json requests...

app.use('/api/pokemon', pokemonRoutes);

// start the server...
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});