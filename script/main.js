let allPokemon = [];

const input = document.getElementById('search-input');
const closeBtn = document.getElementById('search-close');
const searchIcon = document.getElementById('search-icon');

input.addEventListener('input', function () {
  let textInside = input.value !== '';

  if (textInside) {
    closeBtn.style.display = 'inline';
    searchIcon.style.display = 'none';
  } else {
    closeBtn.style.display = 'none';
    searchIcon.style.display = 'inline';
  }

  filterPokemon();
});

function setAllPokemon(pokemonArray) {
  allPokemon = pokemonArray;
}

function filterPokemon() {
  const searchTerm = input.value.toLowerCase();
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