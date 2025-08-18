import { Router, Request, Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router: Router = Router();

/**
 *  Function to generate the HTML with appropriate endpoints
 */
function generateIndexHtml(aboutEndpoint: string, navEndpoint: string): string {
    const htmlTemplate = readFileSync(path.join(__dirname, '..', 'views', 'index.html'), 'utf-8');

    // Replace the endpoints in the HTML
    return htmlTemplate
        .replace('hx-get="/api/cats/about/groucho_and_chica"', `hx-get="${aboutEndpoint}"`)
        .replace('hx-get="/api/cats/about_navigation/groucho_and_chica"', `hx-get="${navEndpoint}"`);
}

router.get('/', (_req: Request, res: Response): void => {
    const html = generateIndexHtml('/api/cats/about/groucho_and_chica', '/api/cats/about_navigation/groucho_and_chica');
    res.send(html);
});

router.get('/cats/:name', (req: Request, res: Response): void => {
    // Replace all hyphens with underscores
    const catView = req.params.name.replace(/-/g, '_');

    const validViews = ['groucho', 'chica', 'groucho_and_chica'];
    const viewName = validViews.includes(catView) ? catView : 'groucho_and_chica';

    const html = generateIndexHtml(`/api/cats/about/${viewName}`, `/api/cats/about_navigation/${viewName}`);
    res.send(html);
});

export default router;
