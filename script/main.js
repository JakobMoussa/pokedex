let allPokemon = [];

let input = document.getElementById('search-input');
let closeBtn = document.getElementById('search-close');
let searchIcon = document.getElementById('search-icon');

input.oninput = onSearchInput;

function onSearchInput() {
  const value = input.value;
  const hasText = value !== '';

  closeBtn.style.display = hasText ? 'inline' : 'none';
  searchIcon.style.display = hasText ? 'none' : 'inline';

  if (value.length >= 3) {
    filterPokemon(value);
  } else {
    renderPokemons(allPokemon, document.getElementById('pokedex-list'));
  }
}

function setAllPokemon(pokemonArray) {
  allPokemon = pokemonArray;
}

function filterPokemon(term) {
  const searchTerm = term.toLowerCase();
  const filtered = allPokemon.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );
  const container = document.getElementById('pokedex-list');
  renderPokemons(filtered, container);
}

function clearInput() {
  input.value = '';
  closeBtn.style.display = 'none';
  searchIcon.style.display = 'inline';
  renderPokemons(allPokemon, document.getElementById('pokedex-list'));
}
