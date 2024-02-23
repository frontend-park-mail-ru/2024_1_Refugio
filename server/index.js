const fs = require('fs');
const http = require('http');
const debug = require('debug')('http');
const nodepath = require('node:path');

const PORT = 8001;

const server = http.createServer(async(req, res) => {
    const {url} = req;
    const path = url === '/' ? 
    nodepath.join(__dirname, '..', 'public', 'index.html') : 
    nodepath.join(__dirname, '..', 'public', url);

    if (path === '/favicon.ico') {
      res.write('404');
      res.end();
      return;
    }

    const file = await fs.readFile(`${path}`, (err, data) => {
      if (err) {
        debug(err);
        res.write('404');
        res.end();
        return;
      }

      res.write(data);
      res.end();
    });
})

debug(`Server listening on localhost:${PORT}`);
server.listen(PORT);