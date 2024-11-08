# POKEDEX

# Índice

1. [Modulo 1 backend](#modulo-1-backend)
    - [Controllers](#controladores-pokemons)
    - [Servicios](#servicios-pokemons)
2. [Modulo 1 frontend](#frontend-module-1)
3. [Modulo 2 backend](#modulo-1-backend)
    - [Servicios](#service-trainers)
    - [Controllers](#controllers-trainers)
3. [Modulo 2 frontend](#module-2-frontend)
4. [Dependencias back](#dependencias-del-backend)
5. [Dependencias Front](#dependencias-del-frontend)

## Modulo 1 backend

El módulo PokeApi contiene todos los controladores y servicios necesarios para interactuar con la API de Pokémon. Proporciona funcionalidades como la obtención de una lista de Pokémon, la búsqueda por nombre, y la creación de un archivo PDF con la información de un Pokémon.

### Controladores Pokemons
- getPokemonsController
- Método: GET

- Ruta: /

- Descripción: Este controlador maneja el punto final que devuelve una lista de Pokémon según los parámetros limit, page y search.

- Parámetros:

    - req.query:
    - limit (opcional): Número máximo de Pokémon a retornar.
    - page (opcional): Página para paginación de resultados.
    - search (opcional): Filtro para buscar Pokémon por nombre.
    - Retorno:

    - res.json(): Retorna un JSON con los datos de los Pokémon solicitados.

```javaScript
const getPokemonsController = async (req, res) => {
    const { limit, page, search } = req.query;

    let paramsObject = { limit, page, search };

    try {
        const pokemons = await getPokemons(paramsObject);
        res.status(200).json({ pokemons });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
}
```
getPokemonPDFController
- Método: GET

- Ruta: /pdf

- Descripción: Este controlador maneja la creación de un archivo PDF con la información de un Pokémon, utilizando el servicio getPokemonPDF.

- Parámetros:

    - req.body:
    - pokemon_data: Datos del Pokémon, incluyendo nombre, imagen y habilidades.
    - Retorno:

    - pdfBuffer: Retorna un archivo PDF generado con la información del Pokémon.

```javaScript
const getPokemonPDFController = async (req, res) => {
    try {
        const { pokemon_data } = req.body;

        if(!pokemon_data) {
            res.status(400).json({ error: 'Missing pokemon data in the request' });
        }

        const pdfBuffer = await getPokemonPDF(pokemon_data);

        if (!pdfBuffer) {
            res.status(500).json({ error: 'Failed to generate PDF' });
        }

        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
```
### Servicios Pokemons
- getPokemons
- Método: GET

- URL: https://pokeapi.co/api/v2/pokemon/

- Descripción: Este servicio obtiene datos de Pokémon desde la API de Pokémon. Permite paginación, limitación del número de resultados y búsqueda por nombre. Además, ordena los resultados alfabéticamente por nombre.

- Parámetros:

    - params:
    - page (opcional): Página para la paginación.
    - limit (opcional): Número máximo de elementos a retornar.
    - search (opcional): Filtro para buscar Pokémon por nombre.
    - Retorno:

Devuelve un array de objetos con los datos del Pokémon (id, nombre, habilidades, imagen, etc.).
```javaScript
const getPokemons = async (params) => {
    const url_poke = `https://pokeapi.co/api/v2/pokemon/?offset=${params.page}&limit=${params.limit}`;

    try {
        const response = await axios.get(url_poke);
        let pokemons = response.data.results;

        pokemons = pokemons.map(poke => {
            return { name: poke.name, url: poke.url };
        }).sort((a, b) => a.name.localeCompare(b.name));

        let pokemnos_data = await Promise.all(pokemons.map(async (poke) => {
            const pokemonResponse = await axios.get(poke.url);
            const pokemon = pokemonResponse.data;
            return {
                id: pokemon.id,
                name: pokemon.name,
                abilities: pokemon.abilities.map(ability => ability.ability.name)
            }
        }));

        if (params.search) {
            pokemnos_data = pokemnos_data.filter(poke => poke.name.includes(params.search.toLowerCase()));
        }

        return pokemnos_data || [];
    } catch (error) {
        throw new Error(error);
    }
}
```
getPokemonPDF
- Método: GET

- Descripción: Este servicio genera un archivo PDF con los datos de un Pokémon, incluyendo nombre, imagen y habilidades.

- Parámetros:

    - pokemon_data: Objeto con los datos del Pokémon que se utilizarán para generar el PDF.
    - Retorno:

    - Retorna un pdfBuffer con el archivo PDF generado.
```Javascript
const getPokemonPDF = async (pokemon_data) => {
    if (!pokemon_data.image || !pokemon_data.name || pokemon_data.abilities.length === 0) {
        throw new Error('Missing required Pokémon data: image, name, or abilities');
    }

    try {
        const pdfBuffer = await generatePDF(pokemon_data);
        if (!pdfBuffer) {
            throw new Error('Failed to generate PDF');
        }
        return pdfBuffer;
    } catch (error) {
        throw new Error('Failed to generate Pokémon PDF');
    }
}
```
- Generador de PDF
- generatePDF
- Método: Genera PDF

- Descripción: Esta función se encarga de generar el archivo PDF con los datos de un Pokémon. Se descarga la imagen del Pokémon, se inserta en el PDF, junto con el nombre y las habilidades.

- Parámetros:

    - pokemon: Objeto que contiene la información del Pokémon, como la imagen, nombre y habilidades.
    - Retorno:

Un Buffer que contiene el archivo PDF generado.

```javaScript
export const generatePDF = async (pokemon) => {
    const { image, name, abilities } = pokemon;
    const doc = new PDFDocument({
        size: [288, 492],  // 80mm x 200mm
        margin: 0
    });

    try {
        const response = await axios.get(image, { responseType: 'arraybuffer' });

        if (!response.data || response.status !== 200) {
            throw new Error('Failed to download image');
        }

        const imageBuffer = await sharp(response.data).png().toBuffer();

        doc.moveDown(2);
        doc.fontSize(25).text(`${name}`, { align: 'center' });
        doc.moveDown(0.5);
        doc.image(imageBuffer, { fit: [240, 240], align: 'right', valign: 'center' });
        doc.moveDown(9);
        doc.fontSize(13).text(`Abilities:`, { align: 'center', underline: true });

        doc.moveDown(1);
        abilities.forEach((ability, index) => {
            doc.fontSize(10).text(`${index + 1}. ${ability}`, { align: 'center' });
        });

        doc.end();

        return new Promise((resolve, reject) => {
            const buffers = [];
            doc.on('data', chunk => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', error => reject(new Error('Error generating PDF: ' + error.message)));
        });

    } catch (error) {
        throw new Error('Error generating Pokémon PDF: ' + error.message);
    }
}
```

## Frontend Module 1
El frontend de la Pokedex App interactúa con el backend para mostrar una lista de Pokémon con opciones de paginación y búsqueda dinámica. Utilizando React, el frontend realiza peticiones al servidor backend a través de la API para obtener una lista de Pokémon, controlando tres parámetros clave en la solicitud: limit, page y search. El componente PokemonDisplay se encarga de gestionar la carga de los Pokémon con estos parámetros, mostrando una cantidad limitada de resultados por página, permitiendo la búsqueda por nombre y realizando la paginación.

El componente useEffect asegura que cada vez que se modifiquen los valores de limit, page o handleSearch, se realice una nueva petición al backend, que devuelve los Pokémon correspondientes. Además, se gestiona el estado de carga y errores para proporcionar una experiencia de usuario más fluida.

Además de la visualización de los Pokémon, el frontend también incluye un botón para generar un PDF con la información detallada de un Pokémon específico. Al hacer clic en el botón, se realiza una petición POST al backend para generar el PDF con los datos del Pokémon seleccionado (como imagen, nombre y habilidades). El backend responde con el archivo PDF, que luego es descargado por el usuario.

Código de ejemplo
```javascript
import { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard";

export default function PokemonDisplay({ handleSearch, limit, page }) {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemons = async () => {
            const url = `http://localhost:3001/api/pokemon/?limit=${limit}&page=${page}&search=${handleSearch}`;

            try {
                setLoading(true);
                const response = await axios.get(url);
                setPokemons(response.data.pokemons);
                setLoading(false);
            } catch (error) {
                setError("Error al cargar los pokemons");
                setLoading(false);
            }
        }

        fetchPokemons();
    }, [limit, page, handleSearch]);

    const handlePdfMaker = async (pokemon) => {
        const pokemon_data = {
            image: pokemon.images.dream_world,
            name: pokemon.name,
            abilities: pokemon.abilities
        }

        try {
            const response = await axios.post('http://localhost:3001/api/pokemon/pdf', { pokemon_data }, { responseType: 'arraybuffer' });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${pokemon.name}_pokemon.pdf`;
            link.click();
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="w-full py-4 flex flex-wrap gap-3 justify-start items-start">
            {pokemons.map((pokemon, index) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} number={index} pdfMaker={handlePdfMaker}/>
            ))}
        </div>
    );
}
```

## Modulo 2 backend

### Service Trainers

Este archivo contiene un conjunto de servicios para manejar las operaciones CRUD de los entrenadores de Pokémon, usando los métodos HTTP estándar: GET, POST, PUT y DELETE. A continuación te ofrezco una explicación de cada uno de los métodos:

1. GET: getTrainers(search)
    - Propósito: Recupera todos los entrenadores registrados en la base de datos, con opción a realizar una búsqueda dinámica por nombre, apellido, teléfono o medallas.
    - Parámetro: search (opcional) - Una cadena que se usa para filtrar los resultados.
    - Proceso:
        Recupera todos los registros de la colección de entrenadores.
    Si se pasa un search, filtra los resultados en función de ese término.
    Los resultados se ordenan alfabéticamente por nombre.
    - Retorno: Un array de objetos de entrenadores filtrados y ordenados, o un array vacío si no se encuentran datos.
2. POST: createTrainer(trainers)
    - Propósito: Crea uno o más nuevos registros de entrenadores en la base de datos.
    - Parámetro: trainers (array) - Un array de objetos de entrenadores que se van a insertar en la base de datos.
    - Proceso:
    - Valida que trainers sea un array no vacío.
    - Inserta los registros en la base de datos utilizando insertMany.
    - Retorno: El resultado de la operación de inserción.
3. PUT: updateTrainers(trainers)
    - Propósito: Actualiza la información de los entrenadores existentes.
    - Parámetro: trainers (array) - Un array de objetos de entrenadores con los datos a actualizar. Cada objeto debe tener un campo _id para identificar el registro a actualizar.
    - Proceso:
    - Valida que cada objeto trainer tenga un campo _id.
    - Actualiza la información de cada entrenador utilizando findByIdAndUpdate.
    - Retorno: Un array de los resultados de las actualizaciones.
4. DELETE: deleteTrainers(trainers_ids)
    - Propósito: Elimina uno o más registros de entrenadores.
    - Parámetro: trainers_ids (array) - Un array de IDs de entrenadores a eliminar.
    - Proceso:
    - Verifica que los IDs proporcionados existan en la base de datos.
    - Elimina los entrenadores correspondientes utilizando deleteMany.
    - Retorno: Un mensaje que indica cuántos entrenadores fueron eliminados exitosamente.

Notas importantes:
    - Validaciones: Cada método realiza validaciones para asegurarse de que los parámetros sean correctos (por ejemplo, validando si el array de entrenadores no está vacío).
    - Errores: Si ocurre algún error durante la ejecución de una operación, se lanza una excepción y se captura un mensaje de error detallado.

Este archivo de servicios es parte del controlador que maneja la lógica de negocio relacionada con los entrenadores de Pokémon y la comunicación con la base de datos.

### Controllers Trainers

Este archivo contiene varios controladores para manejar las operaciones CRUD de los entrenadores de Pokémon. A continuación se describen las funciones de cada controlador:

1. GET: getTrainersController(req, res)
    - Propósito: Recupera los registros de los entrenadores desde la base de datos MongoDB, y permite buscar entrenadores por nombre si se proporciona un término de búsqueda (search) en la consulta.
    - Parámetros de entrada:
        - req.query: Contiene el parámetro search para filtrar los entrenadores por nombre.
    - Proceso:
        - Llama a getTrainers(search) para obtener los entrenadores, usando el parámetro search si es necesario.
        -i la consulta tiene éxito, se responde con los entrenadores obtenidos en formato JSON con código de estado 200.
        - Si ocurre un error, se responde con un mensaje de error y código de estado 500.
    - Retorno:
        - Si tiene éxito: res.status(200).json({ trainers })
        - En caso de error: res.status(500).json({ error: 'Internal server error: [mensaje]' })
2. GET: csvTrainersFileController(_req, res)
    - Propósito: Recupera todos los entrenadores y genera un archivo CSV con los datos. El archivo se envía como respuesta.
    - Proceso:
        - Llama a getTrainers() para obtener todos los entrenadores.
        - Si no se encuentran entrenadores, lanza un error indicando que no hay datos disponibles para generar el CSV.
        - Si se encuentran datos, convierte la información a formato CSV utilizando csv-stringify y la envía como un archivo adjunto.
        - Establece los encabezados de la respuesta para que el archivo sea descargado como trainers.csv.
    - Retorno:
        - Si todo va bien, envía el CSV con res.send(csvBuffer).
        - Si ocurre un error, responde con un mensaje de error con código 500: res.status(500).json({ error: 'Internal server error: [mensaje]' }).
3. POST: createTrainerController(req, res)
    - Propósito: Crea uno o más registros de entrenadores en la base de datos.
    - Parámetros de entrada:
        - req.body: Contiene un objeto trainers, que es un arreglo de entrenadores a guardar.
    - Proceso:
        - Llama a createTrainer(trainers) para guardar los nuevos entrenadores.
        - Si la creación es exitosa, responde con un mensaje de éxito y la lista de entrenadores creados.
        - Si ocurre un error, responde con un mensaje de error con código 500.
    - Retorno:
        - Si todo va bien, responde con un mensaje y los entrenadores creados: res.status(200).json({ message, trainers }).
        - En caso de error: res.status(500).json({ error: 'Internal server error: [mensaje]' }).
4. PUT: updateTrainersController(req, res)
    - Propósito: Actualiza uno o más registros de entrenadores.
    - Parámetros de entrada:
    - req.body: Contiene un objeto trainers, que es un arreglo de entrenadores con los datos actualizados.
    - Proceso:
        - Llama a updateTrainers(trainers) para actualizar los entrenadores en la base de datos.
        - Si no se encuentran entrenadores para actualizar, responde con un mensaje de error 404 indicando que no se encontró el entrenador.
        - Si la actualización es exitosa, responde con un mensaje de éxito y los entrenadores actualizados.
        - Si ocurre un error, responde con un mensaje de error con código 500.
    - Retorno:
        - Si tiene éxito: res.status(200).json({ message, response }).
        - Si no se encuentran registros: res.status(404).json({ message: 'Trainers or trainer not found.' }).
        - En caso de error: res.status(500).json({ error: 'Internal server error: [mensaje]' }).
5. DELETE: deleteTrainersController(req, res)
    - Propósito: Elimina uno o varios entrenadores de la base de datos.
    - Parámetros de entrada:
        - req.body: Contiene un arreglo trainers_ids, que incluye los IDs de los entrenadores a eliminar.
    - Proceso:
        - Llama a deleteTrainers(trainers_ids) para eliminar los entrenadores de la base de datos.
        - Si la eliminación tiene éxito, responde con un mensaje de éxito.
        - Si ocurre un error, responde con un mensaje de error con código 500.
    - Retorno:
        - Si tiene éxito: res.status(200).json({ message: response }).
        - En caso de error: res.status(500).json({ error: 'Internal server error: [mensaje]' }).
Resumen general:
    getTrainersController: Recupera entrenadores de la base de datos y los devuelve en formato JSON.
    csvTrainersFileController: Recupera todos los entrenadores y los convierte en un archivo CSV descargable.
    createTrainerController: Crea nuevos entrenadores en la base de datos.
    updateTrainersController: Actualiza registros de entrenadores existentes.
    deleteTrainersController: Elimina entrenadores de la base de datos.

## module 2 Frontend

Este módulo permite a los usuarios realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los entrenadores Pokémon registrados en la base de datos. El frontend está diseñado con React, y utiliza axios para hacer peticiones al backend y gestionar los datos de los entrenadores.

Visualización de Entrenadores: Los entrenadores se muestran en una tabla con campos como nombre, apellidos, teléfono y medallas, y se ofrece la opción de actualizar o eliminar cada entrenador.

Crear y Actualizar Entrenadores: A través de un formulario, los usuarios pueden agregar nuevos entrenadores o actualizar la información existente. Esta operación se realiza mediante solicitudes POST y PUT al backend.

Eliminar Entrenadores: Los usuarios pueden eliminar entrenadores a través de un botón de eliminación. Al hacer clic, se envía una solicitud DELETE al backend para eliminar el entrenador seleccionado.

Generación de Archivo CSV: El módulo incluye un botón que permite descargar un archivo CSV con todos los entrenadores registrados. Esto se logra mediante una solicitud GET que devuelve los datos en formato CSV, que luego es descargado por el usuario.

Código de ejemplo (con la función para descargar el CSV):
```javascript
import { useState, useEffect } from "react";
import axios from "axios";
import TrainersCell from "./TrainersCell";

export default function TrainersDisplay({ handleSearch, flag, setFlag, data, setData, openForm, methodType }) {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrainers = async () => {
            const url = `http://localhost:3001/api/pokemon/trainers/?search=${handleSearch}`;

            try {
                setLoading(true);
                const response = await axios.get(url);
                setTrainers(response.data.trainers);
                setLoading(false);
            } catch (error) {
                setError("Error al cargar los entrenadores pokemon");
                setLoading(false);
            }
        }

        fetchTrainers();
    }, [handleSearch, flag]);

    const deleteATrainer = async (id) => {
        const url = 'http://localhost:3001/api/pokemon/delete-trainers/';
        let trainers_ids = [];

        trainers_ids.push(id);
        try {
            await axios.delete(url, { data: { trainers_ids } });
            setFlag(prevFlag => prevFlag + 1);
            console.log("Entrenador eliminado exitosamente");
        } catch (error) {
            console.error("Error al eliminar el entrenador:", error.message);
        }
    }

    const handlePrintCsvFileOfTrainers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/pokemon/csv-trainers/', {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'trainers.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el archivo CSV:", error.message);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="w-full flex flex-col justify-start items-start">
            <div className="celdas-trainers">
                <ul>
                    <li className="text-pokebolRed font-bold tracking-wider text-lg">Nombre</li>
                    <li className="text-pokebolRed font-bold tracking-wider text-lg">Apellidos</li>
                    <li className="text-pokebolRed font-bold tracking-wider text-lg">Telefono</li>
                    <li className="text-pokebolRed font-bold tracking-wider text-lg">Medallas</li>
                    <li className="text-pokebolRed font-bold tracking-wider text-lg">Actualizar - Borrar</li>
                </ul>
            </div>
            {trainers.map((trainer, index) => (
                <TrainersCell key={index} trainer={trainer} onClick={handleButtonClick}/>
            ))}
            <button onClick={handlePrintCsvFileOfTrainers}>Descargar CSV de Entrenadores</button>
        </div>
    );
}
```

## Dependencias del Backend

Este proyecto utiliza varias dependencias para facilitar el desarrollo del servidor y la gestión de datos. A continuación se detallan las principales librerías y herramientas utilizadas en el backend:

- Dependencias de Producción (dependencies)
    axios:

    Versión: ^1.7.7
    Descripción: Librería para realizar solicitudes HTTP. Se usa en el backend para interactuar con APIs externas o realizar solicitudes a otros servicios.
    body-parser:

    Versión: ^1.20.3
    Descripción: Middleware de Express para analizar el cuerpo de las solicitudes HTTP entrantes, permitiendo que el servidor maneje datos JSON y formularios de manera eficiente.
    cors:

    Versión: ^2.8.5
    Descripción: Middleware para habilitar Cross-Origin Resource Sharing (CORS), lo que permite que el servidor sea accesible desde diferentes dominios y habilita la comunicación entre el frontend y el backend en aplicaciones web.
    csv-stringify:

    Versión: ^6.5.1
    Descripción: Librería para convertir objetos de JavaScript a formato CSV. Es útil para exportar datos a un archivo CSV desde el backend.
    dotenv:

    Versión: ^16.4.5
    Descripción: Permite cargar variables de entorno desde un archivo .env en el servidor. Esto es útil para manejar configuraciones sensibles, como claves API y credenciales de bases de datos.
    express:

    Versión: ^4.21.1
    Descripción: Framework de Node.js que facilita la creación de aplicaciones web y APIs. Express se utiliza para definir rutas, manejar solicitudes HTTP y organizar la lógica del servidor.
    mongoose:

    Versión: ^8.8.0
    Descripción: Librería de modelado de objetos para MongoDB, que proporciona una solución sencilla para interactuar con bases de datos MongoDB desde Node.js.
    pdfkit:

    Versión: ^0.15.1
    Descripción: Librería para generar archivos PDF en el backend. Se usa para crear documentos PDF programáticamente, como informes o facturas.
    sharp:

    Versión: ^0.33.5
    Descripción: Librería para procesamiento de imágenes. Permite redimensionar, recortar y convertir imágenes, lo que es útil para la manipulación de imágenes en el backend.

- Dependencias de Desarrollo (devDependencies)
    nodemon:
    Versión: ^3.1.7
    Descripción: Herramienta que reinicia automáticamente el servidor cada vez que se detectan cambios en el código fuente. Es útil durante el desarrollo para evitar tener que reiniciar manualmente el servidor.


## Dependencias del Frontend

Este proyecto utiliza varias dependencias para mejorar la experiencia de desarrollo y proporcionar funcionalidades esenciales para la aplicación. A continuación se detallan las principales librerías y herramientas utilizadas en el frontend:

- Dependencias de Producción (dependencies)
    @fortawesome/free-solid-svg-icons:

    Versión: ^6.6.0
    Descripción: Proporciona los íconos de FontAwesome en formato SVG para su uso en la interfaz de usuario. Se utiliza para añadir iconos visuales en la aplicación.
    @fortawesome/react-fontawesome:

    Versión: ^0.2.2
    Descripción: Permite utilizar los íconos de FontAwesome de manera fácil y optimizada dentro de componentes de React.
    axios:

    Versión: ^1.7.7
    Descripción: Es una librería para realizar peticiones HTTP. En este proyecto, se usa para hacer solicitudes al backend y obtener datos de los Pokémon y entrenadores.
    react:

    Versión: ^18.3.1
    Descripción: Es la librería principal para construir la interfaz de usuario. React permite crear componentes interactivos y dinámicos que se actualizan de manera eficiente.
    react-dom:

    Versión: ^18.3.1
    Descripción: Es el paquete que se encarga de renderizar los componentes de React en el DOM del navegador.

- Dependencias de Desarrollo (devDependencies)
    @eslint/js:

    Versión: ^9.13.0
    Descripción: Configuración para el uso de ESLint con reglas de JavaScript, ayudando a mantener el código limpio y consistente.
    @types/react:

    Versión: ^18.3.12
    Descripción: Proporciona tipos de TypeScript para React, mejorando la experiencia de desarrollo con autocompletado y verificación estática de tipos.
    @types/react-dom:

    Versión: ^18.3.1
    Descripción: Proporciona los tipos de TypeScript para react-dom, mejorando la verificación y autocompletado en proyectos TypeScript.
    @vitejs/plugin-react:

    Versión: ^4.3.3
    Descripción: Plugin para integrar React en el proceso de compilación de Vite, una herramienta de desarrollo moderna para aplicaciones web.
    autoprefixer:

    Versión: ^10.4.20
    Descripción: Herramienta para añadir prefijos automáticamente a las reglas CSS, asegurando la compatibilidad con navegadores más antiguos.
    eslint:

    Versión: ^9.13.0
    Descripción: Herramienta de análisis estático de código para identificar y corregir patrones problemáticos en el código JavaScript.
    eslint-plugin-react:

    Versión: ^7.37.2
    Descripción: Plugin de ESLint para verificar las mejores prácticas y el estilo de código específico para aplicaciones React.
    eslint-plugin-react-hooks:

    Versión: ^5.0.0
    Descripción: Plugin de ESLint para verificar el uso adecuado de los hooks de React, asegurando que se sigan las reglas de los hooks.
    eslint-plugin-react-refresh:

    Versión: ^0.4.14
    Descripción: Plugin para habilitar y verificar el soporte de React Fast Refresh, que permite una recarga instantánea de los componentes mientras se desarrollan.
    globals:

    Versión: ^15.11.0
    Descripción: Proporciona un conjunto de variables globales que están disponibles en el entorno de ejecución de un navegador, como window y document.
    postcss:

    Versión: ^8.4.47
    Descripción: Herramienta para transformar CSS con plugins, utilizada en combinación con TailwindCSS para la personalización y optimización de los estilos.
    tailwindcss:

    Versión: ^3.4.14
    Descripción: Framework de CSS que utiliza clases utilitarias para crear diseños personalizados sin necesidad de escribir CSS desde cero.
    vite:

    Versión: ^5.4.10
    Descripción: Herramienta de desarrollo y construcción ultra rápida, que permite la recarga instantánea y la optimización de la aplicación.