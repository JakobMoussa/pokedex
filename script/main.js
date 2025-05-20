  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');
  const searchIcon = document.getElementById('search-icon');

  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() !== '') {
      searchClose.classList.remove('d-none');
      searchIcon.classList.add('d-none');

    } else {
      // Wenn das Feld leer ist, verstecke das "X"
      searchClose.classList.add('d-none');
      searchIcon.classList.remove('d-none');
    }
  });

  // Wenn auf das "X" geklickt wird
  function clearInput() {
    searchInput.value = '';
    searchClose.classList.add('d-none');
    searchInput.focus();
  }
  

  
 