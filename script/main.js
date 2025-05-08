  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');

  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() !== '') {
      searchClose.classList.remove('d-none');
    } else {
      // Wenn das Feld leer ist, verstecke das "X"
      searchClose.classList.add('d-none');
    }
  });

  // Funktion zum Löschen des Eingabefelds, wenn auf das "X" geklickt wird
  function clearInput() {
    searchInput.value = '';
    searchClose.classList.add('d-none');
    searchInput.focus();
  }
  