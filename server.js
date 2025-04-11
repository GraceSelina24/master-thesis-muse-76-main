import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES Modules compatibility - get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in .env file');
  process.exit(1);
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve static files from the public directory (accessible as http://localhost:3001/images/...)
const publicPath = path.join(__dirname, 'public');
console.log('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Add a specific route for debugging image access
app.get('/test-image/:imageName', (req, res) => {
  const imagePath = path.join(publicPath, 'images', 'meals', req.params.imageName);
  console.log('Testing image access for:', imagePath);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send(`Image not found: ${imagePath}`);
  }
});

// Log all API requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Auth middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Register a user
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    // Return token and user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      message: 'User registered successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login a user
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    // Return token and user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user
app.get('/api/users/me', authenticate, async (req, res) => {
  try {
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/profile', authenticate, async (req, res) => {
  try {
    // Mock profile data since we don't have a real profile model yet
    const mockProfile = {
      name: req.user.name,
      email: req.user.email,
      height: 180,
      weight: 75,
      age: 30,
      gender: 'Male',
      activityLevel: 'Moderate',
      dietaryPreferences: ['Vegetarian', 'Low Sugar', 'High Protein'],
      healthGoals: ['Weight Loss', 'Muscle Gain', 'Better Sleep'],
      heightUnit: 'cm',
      weightUnit: 'kg',
      calorieUnit: 'kcal',
      distanceUnit: 'km',
      theme: 'system',
      language: 'en',
      emailNotifications: true,
      pushNotifications: true,
      mealReminders: true,
      workoutReminders: true,
      progressUpdates: true,
      goalNotifications: true,
      subscriptionStatus: 'free',
      subscriptionEndDate: null
    };
    
    res.json(mockProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile data' });
  }
});

// Update user profile settings
app.put('/api/profile', authenticate, async (req, res) => {
  try {
    const {
      theme,
      language,
      heightUnit,
      weightUnit,
      calorieUnit,
      distanceUnit,
      emailNotifications,
      pushNotifications,
      mealReminders,
      workoutReminders,
      progressUpdates,
      goalNotifications
    } = req.body;

    // In a real application, you would update these in the database
    // For this mock implementation, we'll just return the data as if it was updated
    
    const updatedProfile = {
      name: req.user.name,
      email: req.user.email,
      height: 180,
      weight: 75,
      age: 30,
      gender: 'Male',
      activityLevel: 'Moderate',
      dietaryPreferences: ['Vegetarian', 'Low Sugar', 'High Protein'],
      healthGoals: ['Weight Loss', 'Muscle Gain', 'Better Sleep'],
      heightUnit: heightUnit || 'cm',
      weightUnit: weightUnit || 'kg',
      calorieUnit: calorieUnit || 'kcal',
      distanceUnit: distanceUnit || 'km',
      theme: theme || 'system',
      language: language || 'en',
      emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
      pushNotifications: pushNotifications !== undefined ? pushNotifications : true,
      mealReminders: mealReminders !== undefined ? mealReminders : true,
      workoutReminders: workoutReminders !== undefined ? workoutReminders : true,
      progressUpdates: progressUpdates !== undefined ? progressUpdates : true,
      goalNotifications: goalNotifications !== undefined ? goalNotifications : true,
      subscriptionStatus: 'free',
      subscriptionEndDate: null
    };
    
    res.json(updatedProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile data' });
  }
});

// Health Data endpoints
// Get health data for a user
app.get('/api/health/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the authenticated user is requesting their own health data
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Mock health data
    const healthData = [
      {
        id: '1',
        userId,
        weight: 75.5,
        height: 180,
        bmi: 23.3,
        bloodPressure: '120/80',
        heartRate: 68,
        date: new Date(2023, 4, 15).toISOString(),
      },
      {
        id: '2',
        userId,
        weight: 75.0,
        height: 180,
        bmi: 23.1,
        bloodPressure: '118/78',
        heartRate: 66,
        date: new Date(2023, 4, 10).toISOString(),
      }
    ];
    
    res.json(healthData);
  } catch (error) {
    console.error('Get health data error:', error);
    res.status(500).json({ message: 'Failed to fetch health data' });
  }
});

// Add health data record
app.post('/api/health/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { weight, height, bloodPressure, heartRate } = req.body;
    
    // Check if the authenticated user is adding their own health data
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Calculate BMI if height and weight are provided
    let bmi = null;
    if (height && weight) {
      // BMI = weight(kg) / height(m)²
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
      bmi = parseFloat(bmi.toFixed(1));
    }
    
    // Mock creating a health record
    const healthRecord = {
      id: Date.now().toString(),
      userId,
      weight,
      height,
      bmi,
      bloodPressure,
      heartRate,
      date: new Date().toISOString(),
    };
    
    res.status(201).json(healthRecord);
  } catch (error) {
    console.error('Add health data error:', error);
    res.status(500).json({ message: 'Failed to add health data' });
  }
});

// Meals API endpoints
// Get meals for a user
app.get('/api/meals/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching meals for user: ${userId}`);
    
    // Check if the authenticated user is requesting their own meals
    if (req.user.id !== userId) {
      console.log('Unauthorized: User IDs do not match', { requestedId: userId, authenticatedId: req.user.id });
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const meals = await prisma.meal.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
    
    console.log(`Found ${meals.length} meals for user ${userId}`);
    if (meals.length > 0) {
      console.log('First meal sample:', {
        id: meals[0].id,
        name: meals[0].name,
        image: meals[0].image,
        type: meals[0].type
      });
    }
    
    res.json(meals);
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ message: 'Failed to fetch meals' });
  }
});

// Add a new meal
app.post('/api/meals/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, description, calories, protein, carbs, fat, date, type, image } = req.body;
    
    // Check if the authenticated user is adding to their own meals
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const meal = await prisma.meal.create({
      data: {
        userId,
        name,
        description,
        calories,
        protein,
        carbs,
        fat,
        type,
        image,
        date: date ? new Date(date) : new Date()
      }
    });
    
    res.status(201).json(meal);
  } catch (error) {
    console.error('Add meal error:', error);
    res.status(500).json({ message: 'Failed to add meal' });
  }
});

// Delete a meal
app.delete('/api/meals/:mealId', authenticate, async (req, res) => {
  try {
    const { mealId } = req.params;
    
    // Find the meal
    const meal = await prisma.meal.findUnique({
      where: { id: mealId }
    });
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    // Check if the authenticated user owns this meal
    if (req.user.id !== meal.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await prisma.meal.delete({
      where: { id: mealId }
    });
    
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ message: 'Failed to delete meal' });
  }
});

// Workouts API endpoints
// Get workouts for a user
app.get('/api/workouts/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the authenticated user is requesting their own workouts
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
    
    res.json(workouts);
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ message: 'Failed to fetch workouts' });
  }
});

// Add a new workout
app.post('/api/workouts/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, description, duration, calories, date, type } = req.body;
    
    // Check if the authenticated user is adding to their own workouts
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const workout = await prisma.workout.create({
      data: {
        userId,
        name,
        description,
        duration,
        calories,
        date: date ? new Date(date) : new Date()
      }
    });
    
    res.status(201).json(workout);
  } catch (error) {
    console.error('Add workout error:', error);
    res.status(500).json({ message: 'Failed to add workout' });
  }
});

// Delete a workout
app.delete('/api/workouts/:workoutId', authenticate, async (req, res) => {
  try {
    const { workoutId } = req.params;
    
    // Find the workout
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId }
    });
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Check if the authenticated user owns this workout
    if (req.user.id !== workout.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await prisma.workout.delete({
      where: { id: workoutId }
    });
    
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ message: 'Failed to delete workout' });
  }
});

// Google authentication endpoint
app.post('/api/users/google-auth', async (req, res) => {
  try {
    const { name, email, uid, photoURL } = req.body;
    
    if (!email || !uid) {
      return res.status(400).json({ message: 'Email and uid are required' });
    }
    
    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Create a new user if they don't exist
      user = await prisma.user.create({
        data: {
          name: name || email.split('@')[0],
          email,
          password: uid, // Store firebase UID as password (it's not used for login)
          profilePicture: photoURL || null
        },
      });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || null
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a route to list all available meal images
app.get('/list-images', (req, res) => {
  const mealsDir = path.join(publicPath, 'images', 'meals');
  console.log('Looking for meal images in:', mealsDir);
  
  try {
    if (fs.existsSync(mealsDir)) {
      const files = fs.readdirSync(mealsDir);
      console.log('Found files:', files);
      res.json({
        path: mealsDir,
        files,
        count: files.length,
        message: 'These are the available meal images'
      });
    } else {
      res.status(404).json({
        error: 'Directory not found',
        path: mealsDir
      });
    }
  } catch (error) {
    console.error('Error listing image directory:', error);
    res.status(500).json({
      error: String(error),
      path: mealsDir
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});