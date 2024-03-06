const fs = require('fs');
const http = require('http');
const debug = require('debug')('http');
const nodepath = require('node:path');
const express = require('express');

const app = express();

app.use(express.static(nodepath.resolve(__dirname, '..', 'public')));
app.use(express.static(nodepath.resolve(__dirname, '..', 'node_modules')));



const PORT = 8081;

debug(`Server listening on localhost:${PORT}`);
app.listen(PORT);
