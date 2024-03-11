import debug from 'debug';
import path from 'path';
import express from 'express';

const app = express();

const dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.resolve(dirname, '..', 'public')));
app.use(express.static(path.resolve(dirname, '..', 'node_modules')));

const PORT = 8081;

debug(`Server listening on localhost:${PORT}`);
app.listen(PORT);
