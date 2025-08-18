import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

export default router;
