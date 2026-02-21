const fs = require('fs');
const path = require('path');

const loadData = () => {
  const filePath = path.join(__dirname, '../data/pokedex.json');
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

module.exports = loadData;