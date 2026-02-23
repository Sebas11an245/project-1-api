const url = require('url');
const getHandlers = require('./handlers/getHandlers');
const postHandlers = require('./handlers/postHandlers');
const { serveFile } = require('./handlers/fileHandler');

const handleRequest = (req, res, data) => {
  const parsedUrl = url.parse(req.url);
  const path = parsedUrl.pathname;
  const { method } = req;

  if (path === '/' || path === '/index.html') {
    return serveFile(res, 'client/index.html', 'text/html');
  }

  if (path === '/client.js') {
    return serveFile(res, 'client/client.js', 'text/javascript');
  }

  if (path === '/style.css') {
    return serveFile(res, 'client/style.css', 'text/css');
  }

  if (path === '/docs.html') {
    return serveFile(res, 'client/docs.html', 'text/html');
  }

  if (path === '/api/pokemon' && (method === 'GET' || method === 'HEAD')) {
    return getHandlers.getAllPokemon(req, res, data);
  }

  if (path.startsWith('/api/pokemon/') && (method === 'GET' || method === 'HEAD')) {
    const id = path.split('/')[3];
    return getHandlers.getPokemonById(req, res, data, id);
  }

  if (path.startsWith('/api/pokemon/type/') && (method === 'GET' || method === 'HEAD')) {
    const type = path.split('/')[4];
    return getHandlers.getPokemonByType(req, res, data, type);
  }

  if (path === '/api/stats' && (method === 'GET' || method === 'HEAD')) {
    return getHandlers.getStats(req, res, data);
  }

  if (path === '/api/pokemon' && method === 'POST') {
    return postHandlers.addPokemon(req, res, data);
  }

  if (path.startsWith('/api/pokemon/') && method === 'POST') {
    const id = path.split('/')[3];
    return postHandlers.updatePokemon(req, res, data, id);
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Endpoint not found' }));
};

module.exports = { handleRequest };
