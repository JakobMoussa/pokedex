function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  function renderPokemons(pokemons, container) {
    container.innerHTML = '';
  
    pokemons.forEach(pokemon => {
      const id = pokemon.id;
      const name = pokemon.name;
      const imageUrl = pokemon.sprites.front_default;
      const types = pokemon.types.map(t => t.type.name);
  
      const cardHTML = getPokemonCardTemplate(id, name, imageUrl, types);
      container.innerHTML += cardHTML;
    });
  }
  
  function getPokemonCardTemplate(id, name, imageUrl, types) {
    return `
      <li onclick="showOverlay(event, '${name}', '${id}')" class="pokemon-card" data-id="${id}">
        <div class="li-header">
          <span class="pokemon-number">#${id}</span>
          <span class="li-header-title">${capitalize(name)}</span>
        </div>
        <div class="li-middle">
          <img class="main-img" src="${imageUrl}" alt="${name}">
        </div>
        <div class="li-footer">
          ${types.map(type => `<span class="pokemon-type ${type}">${type}</span>`).join('')}
        </div>
      </li>
    `;
  }


  async function fetchPokemons(container) {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
      const data = await response.json();
  
      const pokemonList = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return await res.json();
        })
      );
  
      renderPokemons(pokemonList, container);
    } catch (error) {
      console.error('Fehler beim Laden der Pokémon:', error);
    }
  }
  
  function init() {
    const container = document.getElementById('pokedex-list');
    if (container) {
      fetchPokemons(container);
    } else {
      console.error("Container nicht gefunden!");
    }
  }
  
  document.addEventListener('DOMContentLoaded', init);