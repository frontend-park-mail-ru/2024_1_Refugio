'use strict'

const fs = require('fs');
const http = require('http');
const debug = require('debug')('http');
const nodepath = require('node:path');
const express = require('express');

const app = express();

app.use(express.static(nodepath.resolve(__dirname, '..', 'public')));
app.use(express.static(nodepath.resolve(__dirname, '..', 'node_modules')));

const PORT = 8080;

// app.get('/',async (req, res) => {

// });

// const server = http.createServer(async (req, res) => {
//   const { url } = req;
//   let path = url === '/' ?
//     nodepath.join(__dirname, '..', 'public', 'index.html') :
//     nodepath.join(__dirname, '..', 'public', url);
//   if (url === '/node_modules/handlebars/dist/handlebars.runtime.js') {
//     path = nodepath.join(__dirname, '..', url)
//   }

//   if (path === '/favicon.ico') {
//     res.write('404');
//     res.end();
//     return;
//   }

//   const file = await fs.readFile(`${path}`, (err, data) => {
//     if (err) {
//       debug(err);
//       res.write('404');
//       res.end();
//       return;
//     }

//     res.write(data);
//     res.end();
//   });
// })

debug(`Server listening on localhost:${PORT}`);
app.listen(PORT);