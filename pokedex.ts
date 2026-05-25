// Interface que descreve a estrutura de tipo retornada pela PokéAPI
interface PokemonType {
  type: {
    name: string;
  };
}

// Interface principal com os campos que vamos usar da resposta da API
interface PokemonData {
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
}

// Capitaliza a primeira letra de uma string
const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

// Função principal assíncrona
async function main(): Promise<void> {
  const query = process.argv[2];

  if (!query) {
    console.error('Uso: ts-node pokedex.ts <nome-ou-id>');
    process.exit(1);
  }

  try {
    // Faz a requisição à PokéAPI com o nome ou ID fornecido
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
    );

    // Se o status não for 200 OK, o Pokémon não foi encontrado
    if (!response.ok) {
      console.error('❌ Pokémon não encontrado!');
      process.exit(1);
    }
    const data = (await response.json()) as PokemonData;

    // Converte altura de decímetros para metros (divide por 10)
    const heightM = (data.height / 10).toFixed(1);

    // Converte peso de hectogramas para quilogramas (divide por 10)
    const weightKg = (data.weight / 10).toFixed(1);

    const types = data.types.map(t => capitalize(t.type.name)).join(' / ');
    console.log(`${capitalize(data.name)} – ${heightM} m – ${weightKg} kg – ${types}`);
  } catch (error) {
    console.error('Erro de rede. Tente novamente.');
    process.exit(1);
  }
}

main();
