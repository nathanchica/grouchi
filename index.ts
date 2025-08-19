import express, { Express } from 'express';
import indexRoutes from './routes/index.js';
import catRoutes from './routes/cats.js';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
// In Vercel, static files are served from the dist/public directory
const staticPath = process.env.VERCEL === '1' ? 'dist/public' : 'public';
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', indexRoutes);
app.use('/api/cats', catRoutes);

// Only listen if not in serverless environment
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

export default app;
