function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  function renderPokemons(pokemons, container) {
    container.innerHTML = '';
  
    pokemons.forEach(pokemon => {
      const id = pokemon.id;
      const name = pokemon.name;
      const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
      const types = pokemon.types.map(type => type.type.name);
  
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
          ${types.map(type => getTypeIconTemplate(type)).join('')}
        </div>
      </li>
    `;
  }

    /*  ------------------------------   */
  

  function getTypeIconTemplate(type) {
    const color = typeColors[type] || '#ccc'; // Fallback-Farbe
    return `
      <img
        class="type-icon"
        src="./img/${type}.svg"
        alt="${type}"
        title="${type}"
        style="background-color: ${color}; border-radius: 4px; padding: 2px;"
      >
    `;
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


  