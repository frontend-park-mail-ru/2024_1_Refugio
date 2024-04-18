import debug from 'debug';
import path from 'path';
import express from 'express';
import fs from 'fs';

const app = express();

const dirname = path.dirname(new URL(import.meta.url).pathname);

const router = express.Router();

router.use(express.static(path.resolve(dirname, '..', 'static')));
router.use(express.static(path.resolve(dirname, '..', 'build')));
router.use(express.static(path.resolve(dirname, '..', 'node_modules')));


router.get('*', (req, res) => {
    const filePath = path.resolve(dirname, '../build', "index.html");
    if (!fs.existsSync(filePath)) {
        res.status(500).send('500. Internal server error');
        return;
    }
    res.sendFile(filePath);
})

app.use(router);

const PORT = 8081;

debug(`Server listening on localhost:${PORT}`);
app.listen(PORT);
