import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

// Load environment variables
config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});
async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data (optional - comment out if you want to keep existing data)
  await prisma.adviceComment.deleteMany();
  await prisma.adviceLike.deleteMany();
  await prisma.advice.deleteMany();
  await prisma.student.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      id: "user_1",
      name: "Marie Dupont",
      email: "marie.dupont@example.com",
      emailVerified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "user_2",
      name: "Jean Martin",
      email: "jean.martin@example.com",
      emailVerified: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: "user_3",
      name: "Sophie Bernard",
      email: "sophie.bernard@example.com",
      emailVerified: true,
    },
  });

  console.log("✅ Users created");

  // Create Students
  const student1 = await prisma.student.create({
    data: {
      username: "DataPro",
      position: "Senior Data Engineer",
      linkedinUrl: "https://linkedin.com/in/datapro",
      gitHubUrl: "https://github.com/datapro",
      userId: user1.id,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      username: "MLExpert",
      position: "Machine Learning Engineer",
      linkedinUrl: "https://linkedin.com/in/mlexpert",
      gitHubUrl: "https://github.com/mlexpert",
      userId: user2.id,
    },
  });

  const student3 = await prisma.student.create({
    data: {
      username: "AnalyticsGuru",
      position: "Data Analyst",
      linkedinUrl: "https://linkedin.com/in/analyticsguru",
      userId: user3.id,
    },
  });

  console.log("✅ Students created");

  // Create Advices
  const advice1 = await prisma.advice.create({
    data: {
      message:
        "Toujours documenter vos pipelines de données. Votre futur vous remerciera!",
      category: "Ingénierie Données",
      resourceUrl: "https://example.com/data-documentation",
      studentId: student1.id,
      createdAt: new Date("2025-12-10"),
    },
  });

  const advice2 = await prisma.advice.create({
    data: {
      message:
        "La qualité des données est plus importante que la quantité. Investissez dans la validation.",
      category: "Analyse de Données",
      studentId: student3.id,
      createdAt: new Date("2025-12-15"),
    },
  });

  const advice3 = await prisma.advice.create({
    data: {
      message:
        "Ne jamais sous-estimer l'importance du nettoyage des données avant l'analyse.",
      category: "Analyse de Données",
      studentId: student2.id,
      createdAt: new Date("2025-12-17"),
    },
  });

  const advice4 = await prisma.advice.create({
    data: {
      message:
        "Apprenez SQL en profondeur. C'est la base de tout travail avec les données.",
      category: "Analyse de Données",
      resourceUrl: "https://example.com/sql-guide",
      studentId: student1.id,
      createdAt: new Date("2025-12-18"),
    },
  });

  const advice5 = await prisma.advice.create({
    data: {
      message:
        "N'ayez pas peur de poser des questions. La communauté data est bienveillante.",
      category: "Carrière & Portfolio",
      studentId: student3.id,
      createdAt: new Date("2025-12-19"),
    },
  });

  console.log("✅ Advices created");

  // Create Likes
  await prisma.adviceLike.create({
    data: {
      studentId: student2.id,
      adviceId: advice1.id,
    },
  });

  await prisma.adviceLike.create({
    data: {
      studentId: student3.id,
      adviceId: advice1.id,
    },
  });

  await prisma.adviceLike.create({
    data: {
      studentId: student1.id,
      adviceId: advice2.id,
    },
  });

  await prisma.adviceLike.create({
    data: {
      studentId: student2.id,
      adviceId: advice2.id,
    },
  });

  await prisma.adviceLike.create({
    data: {
      studentId: student3.id,
      adviceId: advice2.id,
    },
  });

  console.log("✅ Likes created");

  // Create Comments
  await prisma.adviceComment.create({
    data: {
      text: "Excellent conseil! J'ai appris ça à mes dépens 😅",
      studentId: student2.id,
      adviceId: advice1.id,
      createdAt: new Date("2025-12-11"),
    },
  });

  await prisma.adviceComment.create({
    data: {
      text: "100% d'accord. La documentation c'est la base!",
      studentId: student3.id,
      adviceId: advice1.id,
      createdAt: new Date("2025-12-12"),
    },
  });

  await prisma.adviceComment.create({
    data: {
      text: "Tellement vrai! 80% du temps sur le nettoyage...",
      studentId: student1.id,
      adviceId: advice3.id,
      createdAt: new Date("2025-12-17"),
    },
  });

  await prisma.adviceComment.create({
    data: {
      text: "Merci pour ce conseil! Je vais commencer à apprendre SQL.",
      studentId: student3.id,
      adviceId: advice4.id,
      createdAt: new Date("2025-12-18"),
    },
  });

  console.log("✅ Comments created");

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
