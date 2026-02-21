const querystring = require('querystring');
const { sendJSON } = require('./getHandlers');

const parseBody = (req, callback) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const contentType = req.headers['content-type'];

    let parsedBody = {};

    if (contentType.includes('application/json')) {
      parsedBody = JSON.parse(body);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      parsedBody = querystring.parse(body);
    }

    callback(parsedBody);
  });
};

const addPokemon = (req, res, data) => {
  parseBody(req, (body) => {
    const { name, type, generation, stats } = body;

    if (!name || !type || !generation || !stats) {
      return sendJSON(req, res, 400, { message: 'Missing required fields' });
    }

    const newPokemon = {
      id: data.length + 1,
      name,
      type: Array.isArray(type) ? type : [type],
      generation: Number(generation),
      stats,
    };

    data.push(newPokemon);

    return sendJSON(req, res, 201, newPokemon);
  });
};

const updatePokemon = (req, res, data, id) => {
  const pokeId = Number(id);

  if (Number.isNaN(pokeId)) {
    return sendJSON(req, res, 400, { message: 'Invalid ID' });
  }

  const pokemon = data.find(p => p.id === pokeId);

  if (!pokemon) {
    return sendJSON(req, res, 404, { message: 'Pokemon not found' });
  }

  parseBody(req, (body) => {
    Object.assign(pokemon, body);
    return sendJSON(req, res, 200, pokemon);
  });
};

module.exports = {
  addPokemon,
  updatePokemon,
};