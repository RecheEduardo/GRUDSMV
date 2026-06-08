type Pokemon = {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    type: { name: string };
  }>;
};


const PokeCard = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
    <div className="pokedex-card">
      <h3 className="pokedex-name">{pokemon.name}</h3>
      {pokemon.sprites.front_default && (
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="pokedex-image"
        />
      )}
      <p>
        <strong>Altura:</strong> {pokemon.height * 10} cm
      </p>
      <p>
        <strong>Peso:</strong> {pokemon.weight / 10} kg
      </p>
      <p>
        <strong>Tipos:</strong>{" "}
        {pokemon.types.map((t) => t.type.name).join(" / ")}
      </p>
    </div>
  );
};

export default PokeCard;
