    function getPokemonCardTemplate(id, name, imageUrl, types) {
    const primaryType = types [0];
    const bgColor = typeColors[primaryType] || '#ccc';
  
    return `
      <li onclick="showOverlay(event, '${name}', '${id}')" class="pokemon-card" style="background: ${bgColor}">
        <div class="li-header">
          <span class="pokemon-number">#${id}</span>
          <span class="li-header-title">${capitalize(name)}</span>
        </div>
        <div class="li-middle">
          <img class="background-img" src="./img/background-img.png">
          <img class="main-img" src="${imageUrl}" alt="${name}">     
        </div>
        <div class="li-footer">
          ${types.map(type => getTypeIconTemplate(type)).join('')}
        </div>
      </li>
    `;
  }

  function getTypeIconTemplate(type) {
    const color = typeColors[type] || '#ccc';
    return `
      <img
        class="type-icon"
        src="./img/${type}.svg"
        alt="${type}"
        title="${type}"
        style="background-color: ${color}"
    `;
  }

function getOverlayTemplate(pokemon) {
  const name = capitalize(pokemon.name);
  const id = pokemon.id;
  const types = pokemon.types.map(t => capitalize(t.type.name));
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  const bgColor = typeColors[pokemon.types[0].type.name] || '#ccc';

  const aboutHTML = `
    <div class="info-row"><strong class="row-design">Species:</strong><span class="about-text">${capitalize(pokemon.species.name)}</span></div>   
    <div class="info-row"><strong class="row-design">Height:</strong><span class="about-text">${(pokemon.height / 10).toFixed(2)} m</span></div>
    <div class="info-row"><strong class="row-design">Weight:</strong><span class="about-text">${(pokemon.weight / 10).toFixed(1)} kg</span></div>
    <div class="info-row"><strong class="row-design">Abilities:</strong><span class="about-text">${pokemon.abilities.map(a => capitalize(a.ability.name)).join(', ')}</span></div>
  `;

  return `
    <div class="overlay-card">
      <div class="overlay-top" style="background-color: ${bgColor};">
        <div class="overlay-header">
          <h2>${name}</h2>
          <span>#${id}</span>
          <span class="close-button" onclick="closeOverlay()">×</span>
        </div>
        <img src="./img/background-img.png" class="overlay-bg-icon">
        <div class="overlay-types">
          ${types.map(type => `<span class="type-btn">${type}</span>`).join('')}
        </div>
        <img src="${imageUrl}" class="overlay-img">
      </div>
      <div class="overlay-bottom">
        <div class="overlay-tabs">
          <span class="tab-btn active" onclick="switchTab(event, 'about', ${id})">About</span>
          <span class="tab-btn" onclick="switchTab(event, 'stats', ${id})">Stats</span>
          <span class="tab-btn" onclick="switchTab(event, 'evo', ${id})">Evo Chain</span>
        </div>
        <div class="overlay-info" id="overlay-info">
          ${aboutHTML}
        </div>
        <div class="overlay-nav">
          <button class="arrow-btn prev" onclick="showPreviousPokemon(${id})">←</button>
          <button class="arrow-btn next" onclick="showNextPokemon(${id})">→</button>
        </div>
      </div>
    </div>
  `;
}

function renderAboutTab(container, pokemon) {
  container.innerHTML = `
    <div class="info-row"><strong class="row-design">Species:</strong><span>${capitalize(pokemon.species.name)}</span></div>   
    <div class="info-row"><strong class="row-design">Height:</strong><span>${(pokemon.height / 10).toFixed(2)} m</span></div>
    <div class="info-row"><strong class="row-design">Weight:</strong><span>${(pokemon.weight / 10).toFixed(1)} kg</span></div>
    <div class="info-row"><strong class="row-design">Abilities:</strong><span>${pokemon.abilities.map(a => capitalize(a.ability.name)).join(', ')}</span></div>
  `;
}

function createStatRow(label, percent) {
  return `
    <div class="stat-row">
      <div class="stat-name">${label}</div>
      <div class="stat-bar-container">
        <div class="stat-bar-fill" style="width: 0%" data-target="${percent}%"></div>
      </div>
    </div>
  `;
}

function renderEvoTab(container, pokemon) {
  container.innerHTML = `<div class="info-row"><em>Loading evolution chain...</em></div>`;
  loadEvolutionChain(pokemon.species.url, container);
}

function renderEvolutionChain(chain, container) {
  container.innerHTML = `
    <div class="info-row"><strong>Evolution Chain:</strong></div>
    <div class="evolution-chain">
      ${chain.map(name => `<span class="evolution-stage">${name}</span>`).join(' → ')}
    </div>
  `;
}

function getStatLabels() {
  return {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Special Attack',
    'speed': 'Speed'
  };
}

function handleEvoError(container, err) {
  console.error('Fehler beim Laden der Evolution Chain:', err);
  container.innerHTML = `<div class="info-row"><em>Fehler beim Laden der Evolution.</em></div>`;
}