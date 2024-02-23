const fs = require('fs');
const http = require('http');
const debug = require('debug')('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const {url} = req;

    const path = url === '/'? 'index.html' : url;

    if (path === '/favicon.ico') {
      res.write('404');
      res.end();
      return;
    }

    const file = fs.readFile(`./public/${path}`, (err, data) => {
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