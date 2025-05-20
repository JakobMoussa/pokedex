
const typeColors = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    psychic: '#F85888',
    dark: '#705848',
    fairy: '#EE99AC',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
    dragon: '#7038F8',
    normal: '#A8A878'
  };

  let offset = 0;
  const limit = 20;
  const container = document.getElementById('pokedex-list');
 
  
  function morePokemon() {
    offset += limit;
    fetchMorePokemons(offset, limit, container);
  }
  
  function fetchMorePokemons(offset, limit, container) {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .then(res => res.json())
      .then(async data => {
        const pokemonList = await Promise.all(
          data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            return await response.json();
          })
        );
  
        // Neue Pokémon hinzufügen
        pokemonList.forEach(pokemon => {
          const id = pokemon.id;
          const name = pokemon.name;
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`;
          const types = pokemon.types.map(type => type.type.name);
  
          const cardHTML = getPokemonCardTemplate(id, name, imageUrl, types);
          container.innerHTML += cardHTML;
        });
      })
      .catch(err => console.error('Fehler beim Nachladen:', err));
  }
  


  async function fetchPokemons(container) {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
      const data = await response.json();
  
      const pokemonList = await Promise.all(
        data.results.map(async (pokemon) => {
          const ressponse = await fetch(pokemon.url);
          return await ressponse.json();
        })
      );
  
      renderPokemons(pokemonList, container);
    } catch (error) {
      console.error('Fehler beim Laden der Pokémon:', error);
    }
  }

