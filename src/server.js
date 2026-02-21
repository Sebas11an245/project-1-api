const http = require('http');
const loadData = require('./dataLoader');
const router = require('./router');

const pokemonData = loadData();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  router.handleRequest(req, res, pokemonData);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});