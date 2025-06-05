let allPokemon = [];

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search-input');
  const closeBtn = document.getElementById('search-close');
  const searchIcon = document.getElementById('search-icon');

  input.addEventListener('input', () => {
    const hasText = input.value.trim() !== '';

    closeBtn.classList.toggle('d-none', !hasText);
    searchIcon.style.display = hasText ? 'none' : 'inline-block';

    filterPokemon();
  });
});

function setAllPokemon(pokemonArray) {
  allPokemon = pokemonArray;
}

function filterPokemon() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const filtered = allPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
  const container = document.getElementById('pokedex-list');
  renderPokemons(filtered, container);
}

function clearInput() {
  const input = document.getElementById('search-input');
  const searchIcon = document.getElementById('search-icon');
  const closeBtn = document.getElementById('search-close');

  input.value = '';
  closeBtn.classList.add('d-none');
  searchIcon.style.display = 'inline-block';
  renderPokemons(allPokemon, document.getElementById('pokedex-list'));
}
