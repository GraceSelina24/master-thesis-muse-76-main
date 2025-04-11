import { Router } from 'express';
import { prisma } from '../prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all meals for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const meals = await prisma.meal.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });
    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// Add a new meal
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, calories, protein, carbs, fat } = req.body;
    
    const meal = await prisma.meal.create({
      data: {
        name,
        description,
        calories: parseInt(calories),
        protein: protein ? parseFloat(protein) : null,
        carbs: carbs ? parseFloat(carbs) : null,
        fat: fat ? parseFloat(fat) : null,
        userId: req.user.id,
      },
    });
    
    res.json(meal);
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(500).json({ error: 'Failed to add meal' });
  }
});

export default router; 