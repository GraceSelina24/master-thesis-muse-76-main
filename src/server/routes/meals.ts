import { Router } from 'express';
import { prisma } from '../../lib/db'; // Corrected named import for `prisma`
import { authenticate } from '../middleware/auth'; // Placeholder for `authenticate` function

const router = Router();

// Get all meals for the authenticated user
router.get('/', authenticate, async (req, res) => { // Updated middleware
  try {
    const meals = await prisma.meal.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });
    res.status(200).json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new meal
router.post('/', authenticate, async (req, res) => { // Updated middleware
  try {
    const { name, calories, date } = req.body;
    const newMeal = await prisma.meal.create({
      data: {
        name,
        calories,
        date,
        userId: req.user.id,
      },
    });
    res.status(201).json(newMeal);
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;