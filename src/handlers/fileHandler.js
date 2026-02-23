const fs = require('fs');
const path = require('path');

const serveFile = (res, filePath, contentType) => {
  const fullPath = path.join(__dirname, '../../', filePath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': data.length,
    });

    res.end(data);
  });
};

module.exports = { serveFile };
