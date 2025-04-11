import express from 'express';
import cors from 'cors';
import mealsRouter from './routes/meals';
import workoutsRouter from './routes/workouts';
// ... existing imports ...

const app = express();

app.use(cors());
app.use(express.json());

// ... existing routes ...

// Add the new routes
app.use('/api/meals', mealsRouter);
app.use('/api/workouts', workoutsRouter);

// ... rest of the file ... 