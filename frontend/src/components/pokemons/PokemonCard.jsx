
export default function PokemonCard({ pokemon, number, pdfMaker}){

    return (
        <div
            className="pokemonsCard"
        >
            <figure>
                <img src={pokemon.images.dream_world} alt={`pokemon ${pokemon.name}`} />
            </figure>
            <div>
                <span>N.º 00{number}</span>
                <h3>{pokemon.name}</h3>
                <ul>
                    <li>{pokemon.moves.length === 0 ? 'Ninguno' : pokemon.moves[0]}</li>
                    <li>{pokemon.abilities.length === 0 ? 'Ninguno' : pokemon.abilities[0]}</li>
                </ul>
                <div>
                    <button onClick={async () => pdfMaker(pokemon)}>Poke Ficha</button>
                </div>
            </div>
        </div>
    );
}