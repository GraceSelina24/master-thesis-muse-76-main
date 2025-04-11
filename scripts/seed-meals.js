// Meal seeding script - Run with: node scripts/seed-meals.js
// @ts-check
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure the public/images/meals directory exists
const mealImagesDir = path.join(__dirname, '..', 'public', 'images', 'meals');
if (!fs.existsSync(mealImagesDir)) {
  fs.mkdirSync(mealImagesDir, { recursive: true });
}

// Function to download images
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filepath, buffer);
    
    console.log(`Downloaded image to ${filepath}`);
    return true;
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
    return false;
  }
}

// Define our meal data
const meals = [
  // Breakfast meals
  {
    name: "Greek Yogurt Bowl",
    description: "Creamy Greek yogurt topped with mixed berries, honey, granola, and chia seeds. A high-protein breakfast to fuel your day.",
    calories: 380,
    protein: 22,
    carbs: 45,
    fat: 12,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1470",
    type: "breakfast"
  },
  {
    name: "Avocado Toast with Poached Egg",
    description: "Whole grain toast topped with mashed avocado, a perfectly poached egg, and a sprinkle of red pepper flakes and microgreens.",
    calories: 340,
    protein: 15,
    carbs: 30,
    fat: 20,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=1480",
    type: "breakfast"
  },
  {
    name: "Overnight Oats with Berries",
    description: "Rolled oats soaked overnight with almond milk, chia seeds, vanilla, and topped with fresh berries and a drizzle of maple syrup.",
    calories: 310,
    protein: 12,
    carbs: 54,
    fat: 7,
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=1476",
    type: "breakfast"
  },
  {
    name: "Spinach and Feta Omelette",
    description: "Fluffy three-egg omelette filled with sautéed spinach, crumbled feta cheese, and diced tomatoes. Served with whole grain toast.",
    calories: 420,
    protein: 28,
    carbs: 18,
    fat: 24,
    image: "https://images.unsplash.com/photo-1565895405227-31cffbe0cf86?auto=format&fit=crop&q=80&w=1470",
    type: "breakfast"
  },
  {
    name: "Protein Pancakes",
    description: "Fluffy pancakes made with protein powder, banana, and oats. Topped with fresh berries and a drizzle of pure maple syrup.",
    calories: 390,
    protein: 24,
    carbs: 52,
    fat: 10,
    image: "https://images.unsplash.com/photo-1575853121743-60c24f0a7502?auto=format&fit=crop&q=80&w=1664",
    type: "breakfast"
  },
  
  // Lunch meals
  {
    name: "Mediterranean Quinoa Salad",
    description: "A refreshing salad with cooked quinoa, cucumber, cherry tomatoes, red onion, feta cheese, olives, dressed with olive oil and lemon juice.",
    calories: 420,
    protein: 15,
    carbs: 50,
    fat: 18,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1470",
    type: "lunch"
  },
  {
    name: "Grilled Chicken Caesar Wrap",
    description: "Grilled chicken breast with romaine lettuce, parmesan cheese, and Caesar dressing wrapped in a whole grain tortilla.",
    calories: 450,
    protein: 35,
    carbs: 40,
    fat: 15,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=1528",
    type: "lunch"
  },
  {
    name: "Lentil Soup with Vegetables",
    description: "Hearty lentil soup with carrots, celery, onions, and spinach, seasoned with cumin and a hint of lemon. Served with whole grain bread.",
    calories: 320,
    protein: 18,
    carbs: 45,
    fat: 8,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1471",
    type: "lunch"
  },
  {
    name: "Turkey and Avocado Sandwich",
    description: "Sliced turkey breast, avocado, lettuce, tomato, and mustard on whole grain bread. Served with a side of mixed greens.",
    calories: 380,
    protein: 28,
    carbs: 35,
    fat: 16,
    image: "https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&q=80&w=1374",
    type: "lunch"
  },
  {
    name: "Chickpea and Vegetable Buddha Bowl",
    description: "A colorful bowl with roasted chickpeas, sweet potatoes, broccoli, red cabbage, and quinoa, drizzled with tahini sauce.",
    calories: 440,
    protein: 20,
    carbs: 60,
    fat: 14,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1470",
    type: "lunch"
  },
  
  // Dinner meals
  {
    name: "Grilled Salmon with Roasted Vegetables",
    description: "Grilled salmon fillet with a lemon herb marinade, served with roasted asparagus, bell peppers, and zucchini.",
    calories: 510,
    protein: 38,
    carbs: 24,
    fat: 28,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1470",
    type: "dinner"
  },
  {
    name: "Spaghetti with Turkey Meatballs",
    description: "Whole grain spaghetti topped with lean turkey meatballs and homemade marinara sauce. Garnished with fresh basil and parmesan.",
    calories: 480,
    protein: 32,
    carbs: 55,
    fat: 16,
    image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&q=80&w=1465",
    type: "dinner"
  },
  {
    name: "Vegetable Stir-Fry with Tofu",
    description: "Crispy tofu stir-fried with broccoli, carrots, snow peas, and bell peppers in a ginger-garlic sauce. Served with brown rice.",
    calories: 380,
    protein: 22,
    carbs: 45,
    fat: 14,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=1470",
    type: "dinner"
  },
  {
    name: "Baked Chicken Breast with Quinoa",
    description: "Herb-seasoned baked chicken breast served with fluffy quinoa and steamed green beans with a hint of lemon and garlic.",
    calories: 450,
    protein: 40,
    carbs: 35,
    fat: 12,
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=1469",
    type: "dinner"
  },
  {
    name: "Sweet Potato and Black Bean Enchiladas",
    description: "Corn tortillas filled with roasted sweet potatoes, black beans, and spinach, topped with enchilada sauce and a sprinkle of cheese.",
    calories: 420,
    protein: 18,
    carbs: 65,
    fat: 10,
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=1471",
    type: "dinner"
  },
  
  // Snack meals
  {
    name: "Mixed Berry Yogurt Parfait",
    description: "Greek yogurt layered with mixed berries, granola, and a drizzle of honey. A perfect balance of protein and natural sweetness.",
    calories: 240,
    protein: 8,
    carbs: 35,
    fat: 8,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=1470",
    type: "snack"
  },
  {
    name: "Apple Slices with Almond Butter",
    description: "Crisp apple slices served with a side of creamy almond butter for dipping. A satisfying combination of sweet and savory.",
    calories: 210,
    protein: 6,
    carbs: 25,
    fat: 12,
    image: "https://images.unsplash.com/photo-1478145799258-573d68fd36b1?auto=format&fit=crop&q=80&w=1528",
    type: "snack"
  },
  {
    name: "Hummus with Vegetable Sticks",
    description: "Creamy chickpea hummus served with fresh vegetable sticks including carrots, celery, and bell peppers. A nutritious and filling snack.",
    calories: 180,
    protein: 7,
    carbs: 20,
    fat: 8,
    image: "https://images.unsplash.com/photo-1627308073954-a9e59a6bc571?auto=format&fit=crop&q=80&w=1470",
    type: "snack"
  },
  {
    name: "Trail Mix Energy Bites",
    description: "No-bake energy bites made with oats, peanut butter, dried fruits, and a sprinkle of dark chocolate chips. Perfect for an energy boost.",
    calories: 160,
    protein: 5,
    carbs: 18,
    fat: 9,
    image: "https://images.unsplash.com/photo-1679233151773-0f9898feada9?auto=format&fit=crop&q=80&w=1470",
    type: "snack"
  },
  {
    name: "Greek Yogurt with Honey and Walnuts",
    description: "Plain Greek yogurt topped with a drizzle of honey and a handful of chopped walnuts. Rich in protein and healthy fats.",
    calories: 220,
    protein: 15,
    carbs: 15,
    fat: 12,
    image: "https://images.unsplash.com/photo-1488477304112-4944851de03d?auto=format&fit=crop&q=80&w=1470",
    type: "snack"
  },
];

// Main seeding function
async function seedMeals() {
  console.log('Starting meal seeding process...');
  
  try {
    // First, get a user to associate the meals with
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.error('No users found in the database. Please create a user first.');
      return;
    }
    
    console.log(`Found user: ${user.name} (${user.id})`);
    
    // Download all images first
    for (let i = 0; i < meals.length; i++) {
      const meal = meals[i];
      const imageName = `meal-${i + 1}.jpg`;
      const localPath = path.join(mealImagesDir, imageName);
      
      // Download the image (if it doesn't exist)
      if (!fs.existsSync(localPath)) {
        console.log(`Downloading image for ${meal.name}...`);
        await downloadImage(meal.image, localPath);
      } else {
        console.log(`Image for ${meal.name} already exists, skipping download.`);
      }
      
      // Update the image path to the local file path (relative to public)
      meal.image = `/images/meals/${imageName}`;
    }
    
    // Create all meals in the database
    for (const meal of meals) {
      // Check if the meal already exists to avoid duplicates
      const existingMeal = await prisma.meal.findFirst({
        where: {
          userId: user.id,
          name: meal.name
        }
      });
      
      if (existingMeal) {
        console.log(`Meal "${meal.name}" already exists, skipping.`);
        continue;
      }
      
      // Create the meal
      const createdMeal = await prisma.meal.create({
        data: {
          userId: user.id,
          name: meal.name,
          description: meal.description,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          image: meal.image,
          type: meal.type,
          date: new Date(), // Using current date
        }
      });
      
      console.log(`Created meal: ${createdMeal.name} (${createdMeal.id})`);
    }
    
    console.log('Meal seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding meals:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedMeals()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 