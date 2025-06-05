const typeColors = {
    fire: '#fc6c6d',
    water: '#5089bd',  
    grass: '#2f947c',
    electric: '#F8D030',
    ice: '#98D8D8',
    psychic: '#F85888',
    dark: '#705848',
    fairy: '#EE99AC',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#7d8822',
    ghost: '#705898',
    steel: '#B8B8D0',
    dragon: '#7038F8',
    normal: '#7a7a42'
  };

  let offset = 0;
  const limit = 20;
  const maxPokemon = 80;
  const container = document.getElementById('pokedex-list');
  
  function morePokemon() {
    offset += limit;
  
    if (offset >= maxPokemon) {
      alert("Maximal 80 Pokémon können geladen werden.");
      document.getElementById('add-more-btn').style.display = 'none';
      return;
    }
  
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
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      const pokemonList = await Promise.all(
        data.results.map(async (pokemon) => {
          const ressponse = await fetch(pokemon.url);
          return await ressponse.json();
        })
      );

      allPokemon = pokemonList;
      setAllPokemon(pokemonList);
      renderPokemons(pokemonList, container);

      
      if (offset >= maxPokemon) {
        document.getElementById('add-more-btn').style.display = 'none';
      }
    } catch (error) {
      console.error('Fehler beim Laden der Pokémon:', error);
    }

  }


