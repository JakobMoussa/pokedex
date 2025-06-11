const typeColors = {
    fire: '#f76162cc',
    water: '#2c80cdc4',  
    grass: '#3eb699cf',
    electric: '#f1c71dcc',
    ice: '#98D8D8',
    psychic: '#f85888d4',
    dark: '#705848',
    fairy: '#ee99ac80',
    fighting: '#de332ac4',
    poison: '#d36ad3db',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#7d8822ad',
    ghost: '#705898',
    steel: '#B8B8D0',
    dragon: '#7038F8',
    normal: '#7f7f3dd1'
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

  function showLoader() {
    document.getElementById('loader').classList.remove('d-none');
  }
  
  function hideLoader() {
    document.getElementById('loader').classList.add('d-none');
  }
  
  async function fetchPokemons(container) {
    showLoader();
    try {
      const response = await fetch(getPokemonListUrl());
      const data = await response.json();
      const pokemonList = await loadPokemonDetails(data.results);
  
      allPokemon = pokemonList;
      setAllPokemon(pokemonList);
      renderPokemons(pokemonList, container);
      toggleLoadMoreButton();
    } catch (error) {
      console.error('Fehler beim Laden der Pokémon:', error);
    } finally {
      hideLoader();
    }
  }
  
  function getPokemonListUrl() {
    return `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  }
  
  async function loadPokemonDetails(pokemonArray) {
    return Promise.all(
      pokemonArray.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return await res.json();
      })
    );
  }
  
  function toggleLoadMoreButton() {
    const btn = document.getElementById('add-more-btn');
    if (offset >= maxPokemon) btn.style.display = 'none';
    else btn.style.display = 'inline';
  }


