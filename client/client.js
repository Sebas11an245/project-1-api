const responseBox = document.getElementById('responseBox');

// Buttons
const getAllBtn = document.getElementById('getAllBtn');
const headAllBtn = document.getElementById('headAllBtn');
const getByIdBtn = document.getElementById('getByIdBtn');
const getByTypeBtn = document.getElementById('getByTypeBtn');
const addPokemonForm = document.getElementById('addPokemonForm');
const updatePokemonForm = document.getElementById('updatePokemonForm');

// Inputs
const pokemonIdInput = document.getElementById('pokemonIdInput');
const typeInput = document.getElementById('typeInput');

// Helper function
const sendRequest = async (url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
    },
  };

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (method === 'HEAD') {
    responseBox.textContent = `Status: ${response.status}`;
    return;
  }

  const data = await response.json();
  responseBox.textContent = JSON.stringify(data, null, 2);
};

getAllBtn.addEventListener('click', () => {
  sendRequest('/api/pokemon');
});

headAllBtn.addEventListener('click', () => {
  sendRequest('/api/pokemon', 'HEAD');
});

getByIdBtn.addEventListener('click', () => {
  const id = pokemonIdInput.value;
  if (!id) return alert('Enter an ID');
  sendRequest(`/api/pokemon/${id}`);
});

getByTypeBtn.addEventListener('click', () => {
  const type = typeInput.value;
  if (!type) return alert('Enter a type');
  sendRequest(`/api/pokemon?type=${type}`);
});

// POSTn
addPokemonForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newPokemon = {
    name: document.getElementById('nameInput').value,
    type: document.getElementById('typeAddInput').value,
    generation: Number(document.getElementById('generationInput').value),
    stats: {
      attack: Number(document.getElementById('attackInput').value),
      defense: Number(document.getElementById('defenseInput').value),
      speed: Number(document.getElementById('speedInput').value),
    },
  };

  sendRequest('/api/pokemon', 'POST', newPokemon);
});

// POST
updatePokemonForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = document.getElementById('updateIdInput').value;

  if (!id) {
    alert('Please enter a Pokémon ID to update');
    return;
  }

  const updatedPokemon = {};

  const name = document.getElementById('updateNameInput').value;
  const type = document.getElementById('updateTypeInput').value;
  const generation = document.getElementById('updateGenerationInput').value;

  const attack = document.getElementById('updateAttackInput').value;
  const defense = document.getElementById('updateDefenseInput').value;
  const speed = document.getElementById('updateSpeedInput').value;

  if (name) updatedPokemon.name = name;
  if (type) updatedPokemon.type = [type];
  if (generation) updatedPokemon.generation = Number(generation);

  if (attack || defense || speed) {
    updatedPokemon.stats = {};
    if (attack) updatedPokemon.stats.attack = Number(attack);
    if (defense) updatedPokemon.stats.defense = Number(defense);
    if (speed) updatedPokemon.stats.speed = Number(speed);
  }

  sendRequest(`/api/pokemon/${id}`, 'POST', updatedPokemon);
});