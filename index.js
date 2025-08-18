import express from 'express';
import indexRoutes from './routes/index.js';
import catRoutes from './routes/cats.js';
import ageRoutes from './routes/age.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', indexRoutes);
app.use('/api/cats', catRoutes);
app.use('/api/age', ageRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
