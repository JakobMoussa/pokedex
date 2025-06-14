    function renderPokemons(pokemons, container) {
    container.innerHTML = '';
  
    for (let i = 0; i < pokemons.length; i++) {
      const pokemon = pokemons[i];
      const id = pokemon.id;
      const name = pokemon.name;
      const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
      const types = pokemon.types.map(type => type.type.name);
      container.innerHTML += getPokemonCardTemplate(id, name, imageUrl, types);
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
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
function showOverlay(event, name, id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(pokemon => {
      const overlayContainer = document.getElementById('overlay-container');
      const overlayBody = document.getElementById('overlay-body');
      overlayBody.innerHTML = getOverlayTemplate(pokemon);
      overlayContainer.classList.remove('d-none');
    })
    .catch(err => {
      console.error("Fehler beim Laden des Overlays:", err);
    });
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
          <button class="arrow-btn" onclick="showPreviousPokemon(${id})">←</button>
          <button class="arrow-btn" onclick="showNextPokemon(${id})">→</button>
        </div>
      </div>
    </div>
  `;
}

function switchTab(event, tabName, pokemonId) {
  const container = document.getElementById('overlay-info');
  if (!container) return;

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then(res => res.json())
    .then(pokemon => {
      if (tabName === 'about') {
        renderAboutTab(container, pokemon);
      } else if (tabName === 'stats') {
        renderStatsTab(container, pokemon);
      } else if (tabName === 'evo') {
        renderEvoTab(container, pokemon);
      }
    })
    .catch(err => {
      container.innerHTML = `<div class="info-row"><em>Failed to load data.</em></div>`;
      console.error('Tab switch error:', err);
    });
}

function setActiveTab(clickedButton) {
  const buttons = document.getElementsByClassName('tab-btn');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active');
  }
  clickedButton.classList.add('active');
}

function renderAboutTab(container, pokemon) {
  container.innerHTML = `
    <div class="info-row"><strong class="row-design">Species:</strong><span>${capitalize(pokemon.species.name)}</span></div>   
    <div class="info-row"><strong class="row-design">Height:</strong><span>${(pokemon.height / 10).toFixed(2)} m</span></div>
    <div class="info-row"><strong class="row-design">Weight:</strong><span>${(pokemon.weight / 10).toFixed(1)} kg</span></div>
    <div class="info-row"><strong class="row-design">Abilities:</strong><span>${pokemon.abilities.map(a => capitalize(a.ability.name)).join(', ')}</span></div>
  `;
}

function renderStatsTab(container, pokemon) {
  const statsHTML = buildStatsHTML(pokemon);
  container.innerHTML = statsHTML;
  animateStatBars();
}

function buildStatsHTML(pokemon) {
  const statLabels = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Special Attack',
    'speed': 'Speed'
  };

  const usedStats = {};
  let html = '';
  const stats = pokemon.stats;

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    const statName = stat.stat.name;
    if (usedStats[statName]) continue;
    usedStats[statName] = true;

    const value = stat.base_stat;
    const percent = Math.min((value / 150) * 100, 100).toFixed(1);
    const label = statLabels[statName] || capitalize(statName);

    html += createStatRow(label, percent);
  }

  return html;
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

function animateStatBars() {
  setTimeout(() => {
    const bars = document.getElementsByClassName('stat-bar-fill');
    for (let i = 0; i < bars.length; i++) {
      const target = bars[i].getAttribute('data-target');
      bars[i].style.width = target;
    }
  }, 50);
}

function renderEvoTab(container, pokemon) {
  container.innerHTML = `<div class="info-row"><em>Loading evolution chain...</em></div>`;
  loadEvolutionChain(pokemon.species.url, container);
}

function loadEvolutionChain(speciesUrl, container) {
  fetch(speciesUrl)
    .then(res => res.json())
    .then(speciesData => fetchEvolutionChain(speciesData.evolution_chain.url, container))
    .catch(err => handleEvoError(container, err));
}

function fetchEvolutionChain(evoUrl, container) {
  fetch(evoUrl)
    .then(res => res.json())
    .then(evolutionData => {
      const chain = parseEvolutionChain(evolutionData.chain);
      renderEvolutionChain(chain, container);
    })
    .catch(err => handleEvoError(container, err));
}

function parseEvolutionChain(chainNode) {
  const chain = [];
  let current = chainNode;

  while (current) {
    chain.push(capitalize(current.species.name));
    current = current.evolves_to[0];
  }

  return chain;
}

function renderEvolutionChain(chain, container) {
  container.innerHTML = `
    <div class="info-row"><strong>Evolution Chain:</strong></div>
    <div class="evolution-chain">
      ${chain.map(name => `<span class="evolution-stage">${name}</span>`).join(' → ')}
    </div>
  `;
}

function handleEvoError(container, err) {
  console.error('Fehler beim Laden der Evolution Chain:', err);
  container.innerHTML = `<div class="info-row"><em>Fehler beim Laden der Evolution.</em></div>`;
}

function showPreviousPokemon(currentId) {
  let prevId = currentId - 1;
  if (prevId < 1) return; 
  showOverlay(null, '', prevId); 
}

function showNextPokemon(currentId) {
  let nextId = currentId + 1;
  if (nextId > 80) return; 
  showOverlay(null, '', nextId);
}

function closeOverlay() {
  const overlayContainer = document.getElementById('overlay-container');
  overlayContainer.classList.add('d-none');
  document.getElementById('overlay-body').innerHTML = '';
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


  