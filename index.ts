import express, { Express } from 'express';
import indexRoutes from './routes/index.js';
import catRoutes from './routes/cats.js';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', indexRoutes);
app.use('/api/cats', catRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
