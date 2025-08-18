import { Router, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router: Router = Router();

router.get('/', (_req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

export default router;
