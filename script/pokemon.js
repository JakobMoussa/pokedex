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
        data.results.map(p => fetch(p.url).then(r => r.json()))
      );

      allPokemon = [...allPokemon, ...pokemonList];
      renderPokemonCards(pokemonList, container);
    })
    .catch(err => console.error('Fehler beim Nachladen:', err));
}

function renderPokemonCards(pokemonList, container) {
  pokemonList.forEach(pokemon => {
    const id = pokemon.id;
    const name = pokemon.name;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`;
    const types = pokemon.types.map(type => type.type.name);
    container.innerHTML += getPokemonCardTemplate(id, name, imageUrl, types);
  });
}

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

function renderStatsTab(container, pokemon) {
  const statsHTML = buildStatsHTML(pokemon);
  container.innerHTML = statsHTML;
  animateStatBars();
}

function buildStatsHTML(pokemon) {
  const statLabels = getStatLabels();
  let html = '';
  const usedStats = {};

  for (let i = 0; i < pokemon.stats.length; i++) {
    const stat = pokemon.stats[i];
    const name = stat.stat.name;
    if (usedStats[name]) continue;
    usedStats[name] = true;

    const value = stat.base_stat;
    const percent = Math.min((value / 150) * 100, 100).toFixed(1);
    const label = statLabels[name] || capitalize(name);
    html += createStatRow(label, percent);
  }

  return html;
}

function toggleLoadMoreButton() {
  const btn = document.getElementById('add-more-btn');
  if (offset >= maxPokemon) btn.style.display = 'none';
  else btn.style.display = 'inline';
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

function setActiveTab(clickedButton) {
  const buttons = document.getElementsByClassName('tab-btn');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active');
  }
  clickedButton.classList.add('active');
}

function showOverlay(event, name, id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(pokemon => {
      const overlayContainer = document.getElementById('overlay-container');
      const overlayBody = document.getElementById('overlay-body');
      overlayBody.innerHTML = getOverlayTemplate(pokemon);
      overlayContainer.classList.remove('d-none');

      updateNavButtons(pokemon.id);
    })
    .catch(err => {
      console.error("Fehler beim Laden des Overlays:", err);
    });
}

function showPreviousPokemon(currentId) {
  if (currentId <= 1) return;
  showOverlay(null, '', currentId - 1);
}

function showNextPokemon(currentId) {
  const nextId = currentId + 1;
  if (!pokemonIsLoaded(nextId)) return;
  showOverlay(null, '', nextId);
}

function pokemonIsLoaded(id) {
  return allPokemon.find(p => p.id === id) !== undefined;
}

function updateNavButtons(currentId) {
  const prevBtn = document.querySelector('.arrow-btn.prev');
  const nextBtn = document.querySelector('.arrow-btn.next');

  prevBtn.disabled = currentId <= 1;
  nextBtn.disabled = !pokemonIsLoaded(currentId + 1);
}

function closeOverlay() {
  const overlayContainer = document.getElementById('overlay-container');
  overlayContainer.classList.add('d-none');
  document.getElementById('overlay-body').innerHTML = '';
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

function switchTab(event, tabName, pokemonId) {
  const container = document.getElementById('overlay-info');
  if (!container) return;

  fetchTabData(tabName, pokemonId, container);
  updateActiveTab(event);
}

function fetchTabData(tabName, pokemonId, container) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then(res => res.json())
    .then(pokemon => renderTab(tabName, container, pokemon))
    .catch(err => {
      container.innerHTML = `<div class="info-row"><em>Failed to load data.</em></div>`;
      console.error('Tab switch error:', err);
    });
}

function renderTab(tab, container, pokemon) {
  const tabs = {
    about: renderAboutTab,
    stats: renderStatsTab,
    evo: renderEvoTab
  };
  tabs[tab]?.(container, pokemon);
}

function updateActiveTab(event) {
  document.querySelectorAll('.tab-btn').forEach(btn =>
    btn.classList.remove('active')
  );
  event.target.classList.add('active');
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
