import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const existingUser = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      },
    });
    console.log('User created successfully!');
  } else {
    console.log('User with this email already exists. Skipping creation.');
  }

  console.log('Database seeded successfully!');

  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (user) {
    await prisma.workout.createMany({
      data: [
        {
          name: 'Yoga',
          description: 'A relaxing workout focusing on flexibility and mindfulness.',
          userId: user.id,
          duration: 30, // Default duration in minutes
        },
        {
          name: 'HIIT',
          description: 'High-Intensity Interval Training for quick and effective results.',
          userId: user.id,
          duration: 30, // Default duration in minutes
        },
        {
          name: 'Strength Training',
          description: 'Build muscle and improve strength with targeted exercises.',
          userId: user.id,
          duration: 30, // Default duration in minutes
        },
        {
          name: 'Cardio',
          description: 'Boost your heart health with aerobic exercises.',
          userId: user.id,
          duration: 30, // Default duration in minutes
        },
        {
          name: 'Pilates',
          description: 'Improve core strength and posture with Pilates.',
          userId: user.id,
          duration: 30, // Default duration in minutes
        },
        {
          name: 'Full Body HIIT',
          description: 'A high-intensity workout targeting the entire body.',
          duration: 30,
          calories: 320,
          userId: user.id,
        },
        {
          name: 'Upper Body Strength',
          description: 'Focus on building upper body strength with dumbbells.',
          duration: 45,
          calories: 280,
          userId: user.id,
        },
        {
          name: 'Lower Body Focus',
          description: 'Strengthen your lower body with targeted exercises.',
          duration: 40,
          calories: 300,
          userId: user.id,
        },
      ],
    });

    console.log('Workout options seeded successfully!');
  } else {
    console.log('User not found. Skipping workout seeding.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });