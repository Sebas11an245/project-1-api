const url = require('url');

const sendJSON = (req, res, status, data) => {
  const response = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(response),
  });

  if (req.method !== 'HEAD') {
    res.write(response);
  }
  res.end();
};

const getAllPokemon = (req, res, data) => {
  const parsedUrl = url.parse(req.url, true);
  let results = data.pokemon || data;

  const { type, generation, limit, name } = parsedUrl.query;

  if (type) {
    results = results.filter(p =>
      p.type.map(t => 
        t.toLowerCase()).includes(type.toLowerCase())
    );
  }

  if (generation) {
    const genNum = Number(generation);
    if (Number.isNaN(genNum)) {
      return sendJSON(req, res, 400, { message: 'Invalid generation parameter' });
    }
    results = results.filter(p => p.generation === genNum);
  }

  if (name) {
    results = results.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (limit) {
    const limitNum = Number(limit);
    if (Number.isNaN(limitNum)) {
      return sendJSON(req, res, 400, { message: 'Invalid limit parameter' });
    }
    results = results.slice(0, limitNum);
  }

  if (results.length === 0) {
    return sendJSON(req, res, 204, {});
  }

  return sendJSON(req, res, 200, { count: results.length, results });
};

const getPokemonById = (req, res, data, id) => {
  const pokeId = Number(id);
  if (Number.isNaN(pokeId)) {
    return sendJSON(req, res, 400, { message: 'ID must be a number' });
  }

  const results = data.filter(p => p.id === pokeId);

  if (!results.length) {
    return sendJSON(req, res, 404, { message: 'Pokemon not found' });
  }

  return sendJSON(req, res, 200, results[0]);
};

const getPokemonByType = (req, res, data, type) => {
  const results = data.filter(p =>
    p.type.map(t => 
      t.toLowerCase()).includes(type.toLowerCase())
  );

  if (!results.length) {
    return sendJSON(req, res, 204, {});
  }

  return sendJSON(req, res, 200, results);
};

const getStats = (req, res, data) => {
  const parsedUrl = url.parse(req.url, true);
  const { minAttack, minDefense, minSpeed } = parsedUrl.query;

  let results = data;

  if (minAttack) {
    results = results.filter(p => p.stats.attack >= Number(minAttack));
  }
  if (minDefense) {
    results = results.filter(p => p.stats.defense >= Number(minDefense));
  }
  if (minSpeed) {
    results = results.filter(p => p.stats.speed >= Number(minSpeed));
  }

  if (!results.length) {
    return sendJSON(req, res, 204, {});
  }

  return sendJSON(req, res, 200, results);
};

module.exports = {
  getAllPokemon,
  getPokemonById,
  getPokemonByType,
  getStats,
  sendJSON,
};