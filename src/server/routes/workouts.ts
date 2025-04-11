import { Router } from 'express';
import { prisma } from '../prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all workouts for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// Add a new workout
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, duration, calories } = req.body;
    
    const workout = await prisma.workout.create({
      data: {
        name,
        description,
        duration: parseInt(duration),
        calories: calories ? parseInt(calories) : null,
        userId: req.user.id,
      },
    });
    
    res.json(workout);
  } catch (error) {
    console.error('Error adding workout:', error);
    res.status(500).json({ error: 'Failed to add workout' });
  }
});

export default router; 