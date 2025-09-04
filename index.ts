import express, { Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRoutes from './routes/index.js';
import catRoutes from './routes/cats.js';
import chatRoutes from './routes/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const isVercel = process.env.VERCEL === '1';

// Middleware
// In Vercel, static files are served from the dist/public directory
const staticPath = isVercel ? path.join(__dirname, 'public') : 'public';
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', indexRoutes);
app.use('/api/cats', catRoutes);
app.use('/api/chat', chatRoutes);

// Only listen if not in serverless environment
if (!isVercel) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

export default app;
