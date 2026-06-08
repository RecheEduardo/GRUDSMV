import { useEffect, useState } from "react";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";

const usePokedex = (pokemonName: string) => {
  
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        
        if(!pokemonName) {
            return;
        }
      const fetchPokemon = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`${BASE_URL}${pokemonName.toLowerCase()}`);
          if (!response.ok) {
            throw new Error("Erro ao buscar Pokémon. Verifique o nome e tente novamente.");
          }
          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPokemon();
    }, [pokemonName]);

    return { data, error, loading };
}

export default usePokedex