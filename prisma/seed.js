import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'jane.doe@example.com',
      password: 'hashed_password',
      name: 'Jane Doe',
    },
  });

  await prisma.meal.create({
    data: {
      userId: user.id, // Use the auto-generated user ID
      name: 'Lunch',
      calories: 600,
    },
  });

  await prisma.workout.create({
    data: {
      userId: user.id, // Use the auto-generated user ID
      name: 'Evening Yoga',
      duration: 45,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
