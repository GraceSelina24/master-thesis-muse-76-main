import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateMealImage() {
  try {
    const updatedMeal = await prisma.meal.update({
    name: "Apple Slices with Almond Butter",
      where: { name: '' },
      data: {
        image: 'https://plus.unsplash.com/premium_photo-1699986147008-d8d620f863bf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    });
    console.log('Meal image updated successfully:', updatedMeal);
  } catch (error) {
    console.error('Error updating meal image:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateMealImage();