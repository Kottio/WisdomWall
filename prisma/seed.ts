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

// ============================================================================
// HELPER FUNCTIONS FOR GENERATING REALISTIC DATA
// ============================================================================

/**
 * Generate a random date between startDate and endDate
 * Used to spread data across time for realistic time-series analysis
 */
function randomDate(startDate: Date, endDate: Date): Date {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
}

/**
 * Pick a random item from an array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick multiple random items from an array (without duplicates)
 */
function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================================================
// DATA TEMPLATES - French names, positions, advice messages, etc.
// ============================================================================

const firstNames = [
  "Marie", "Jean", "Sophie", "Pierre", "Julie", "Thomas", "Emma", "Lucas",
  "Léa", "Antoine", "Chloé", "Nicolas", "Camille", "Alexandre", "Laura",
  "Maxime", "Sarah", "Julien", "Manon", "Mathieu", "Clara", "Hugo",
  "Lucie", "Romain", "Anaïs", "Clément", "Pauline", "Vincent", "Margaux",
  "Benjamin", "Alice", "Quentin", "Justine", "Guillaume", "Marine", "Adrien",
  "Céline", "Florian", "Charlotte", "Kevin", "Mélanie", "David", "Océane",
  "Sébastien", "Audrey", "François", "Marion", "Arnaud", "Laetitia", "Louis"
];

const lastNames = [
  "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit",
  "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel",
  "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier", "Morel",
  "Girard", "André", "Mercier", "Dupont", "Lambert", "Bonnet", "François",
  "Martinez", "Legrand", "Garnier", "Faure", "Rousseau", "Blanc", "Guerin",
  "Muller", "Henry", "Roussel", "Nicolas", "Perrin", "Morin", "Mathieu",
  "Clement", "Gauthier", "Dumont", "Lopez", "Fontaine", "Chevalier", "Robin"
];

const positions = [
  "Data Engineer",
  "Senior Data Engineer",
  "Junior Data Engineer",
  "Data Analyst",
  "Senior Data Analyst",
  "Business Analyst",
  "Machine Learning Engineer",
  "ML Engineer",
  "Data Scientist",
  "Senior Data Scientist",
  "Analytics Engineer",
  "BI Developer",
  "Database Administrator",
  "ETL Developer",
  "Big Data Engineer",
  "Data Architect",
  "AI Engineer",
  "Research Scientist",
];

const categories = [
  "Ingénierie Données",
  "Analyse de Données",
  "Machine Learning",
  "Carrière & Portfolio",
  "Outils & Technologies",
];

const adviceTemplates = [
  "Toujours documenter vos pipelines de données. Votre futur vous remerciera!",
  "La qualité des données est plus importante que la quantité. Investissez dans la validation.",
  "Ne jamais sous-estimer l'importance du nettoyage des données avant l'analyse.",
  "Apprenez SQL en profondeur. C'est la base de tout travail avec les données.",
  "N'ayez pas peur de poser des questions. La communauté data est bienveillante.",
  "Utilisez Git pour versionner vos notebooks Jupyter dès le début.",
  "Les tests unitaires ne sont pas optionnels, même pour les scripts de données.",
  "Automatisez tout ce qui est répétitif. Investissez du temps maintenant, économisez plus tard.",
  "La visualisation des données est un art. Prenez le temps d'apprendre les bonnes pratiques.",
  "Commentez votre code SQL comme si la prochaine personne à le lire était un psychopathe qui sait où vous habitez.",
  "Les index peuvent améliorer les performances de 100x. Apprenez à les utiliser correctement.",
  "Ne jamais faire confiance aux données brutes. Toujours vérifier et valider.",
  "Un bon data engineer est paresseux. Automatisez, automatisez, automatisez!",
  "Apprenez Python ET SQL. Les deux sont indispensables dans le monde de la data.",
  "Les erreurs sont des opportunités d'apprentissage. Gardez un journal de vos erreurs.",
  "Créez un portfolio GitHub actif. C'est votre meilleur CV en data.",
  "Participez à des compétitions Kaggle pour pratiquer sur des données réelles.",
  "La scalabilité n'est pas toujours nécessaire au début. Commencez simple.",
  "Lisez les documentations officielles. Elles contiennent des trésors d'informations.",
  "Network avec d'autres professionnels de la data. LinkedIn est votre ami.",
];

const commentTemplates = [
  "Excellent conseil! Merci pour le partage.",
  "Je suis totalement d'accord avec ça!",
  "J'ai appris ça à mes dépens 😅",
  "Super astuce, je vais l'appliquer dès demain!",
  "Tellement vrai! J'aurais aimé le savoir plus tôt.",
  "100% d'accord. C'est exactement ce que je dis toujours!",
  "Merci pour ce conseil! Très utile.",
  "C'est une perspective intéressante!",
  "Je ne connaissais pas cette approche, merci!",
  "Ça me rappelle un projet sur lequel j'ai travaillé récemment.",
];

// ACTUAL events tracked in the application (from app/lib/events.ts usage)
const eventNames = [
  "advice_liked",        // When user likes an advice
  "advice_unliked",      // When user unlikes an advice
  "comment_created",     // When user creates a comment
  "resource_clicked",    // When clicking "Voir le Lien" button
  "linkedin_clicked",    // When clicking LinkedIn profile link
  "comments_expanded",   // When expanding comments section
  "category_filtered",   // When filtering by category
];

// ============================================================================
// MAIN SEEDING FUNCTION
// ============================================================================

async function main() {
  console.log("🌱 Starting database seeding...");
  console.log("⚠️  This will delete all existing data and create new seed data");

  // Clean existing data
  console.log("\n🗑️  Cleaning existing data...");
  await prisma.event.deleteMany();
  await prisma.adviceComment.deleteMany();
  await prisma.adviceLike.deleteMany();
  await prisma.advice.deleteMany();
  await prisma.student.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Existing data cleaned");

  // ============================================================================
  // STEP 1: Create Users and Students (40 total)
  // Note: Keep initial data small as students will create their own accounts
  // ============================================================================
  console.log("\n👥 Creating 40 users and students...");
  const students = [];
  const userPromises = [];

  for (let i = 1; i <= 40; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const username = `${firstName}${lastName}${i}`.toLowerCase();

    const userPromise = prisma.user.create({
      data: {
        id: `user_${i}`,
        name: `${firstName} ${lastName}`,
        email: `${username}@example.com`,
        emailVerified: true,
      },
    }).then(async (user) => {
      const student = await prisma.student.create({
        data: {
          username: username,
          position: randomItem(positions),
          linkedinUrl: Math.random() > 0.3 ? `https://linkedin.com/in/${username}` : null,
          gitHubUrl: Math.random() > 0.5 ? `https://github.com/${username}` : null,
          userId: user.id,
          createdAt: randomDate(new Date("2024-06-01"), new Date("2025-11-01")),
        },
      });
      return student;
    });

    userPromises.push(userPromise);
  }

  const createdStudents = await Promise.all(userPromises);
  students.push(...createdStudents);
  console.log(`✅ Created ${students.length} users and students`);

  // ============================================================================
  // STEP 2: Create Advice Posts (100 total)
  // Note: Students will create more through the app
  // ============================================================================
  console.log("\n📝 Creating 100 advice posts...");
  const advices = [];
  const advicePromises = [];

  // Date range: from 6 months ago to now
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const now = new Date();

  for (let i = 0; i < 100; i++) {
    const student = randomItem(students);
    const category = randomItem(categories);
    const message = randomItem(adviceTemplates);
    const hasResourceUrl = Math.random() > 0.7; // 30% have resource URLs

    const advicePromise = prisma.advice.create({
      data: {
        message: message,
        category: category,
        resourceUrl: hasResourceUrl ? `https://example.com/resource-${i}` : null,
        studentId: student.id,
        createdAt: randomDate(sixMonthsAgo, now),
      },
    });

    advicePromises.push(advicePromise);
  }

  const createdAdvices = await Promise.all(advicePromises);
  advices.push(...createdAdvices);
  console.log(`✅ Created ${advices.length} advice posts`);

  // ============================================================================
  // STEP 3: Create Likes (~300 total)
  // ============================================================================
  console.log("\n❤️  Creating likes...");
  const likes = new Set<string>(); // Track unique student-advice pairs
  const likePromises = [];

  // Each advice gets between 0-10 likes (realistic distribution)
  for (const advice of advices) {
    const numLikes = randomInt(0, 10);
    const likers = randomItems(students, numLikes);

    for (const liker of likers) {
      const key = `${liker.id}-${advice.id}`;
      if (!likes.has(key)) {
        likes.add(key);
        likePromises.push(
          prisma.adviceLike.create({
            data: {
              studentId: liker.id,
              adviceId: advice.id,
              createdAt: randomDate(advice.createdAt, now),
            },
          })
        );
      }
    }
  }

  await Promise.all(likePromises);
  console.log(`✅ Created ${likes.size} likes`);

  // ============================================================================
  // STEP 4: Create Comments (~150 total)
  // ============================================================================
  console.log("\n💬 Creating comments...");
  const commentPromises = [];

  // Each advice gets between 0-3 comments
  for (const advice of advices) {
    const numComments = randomInt(0, 3);

    for (let i = 0; i < numComments; i++) {
      const commenter = randomItem(students);
      const commentText = randomItem(commentTemplates);

      commentPromises.push(
        prisma.adviceComment.create({
          data: {
            text: commentText,
            studentId: commenter.id,
            adviceId: advice.id,
            createdAt: randomDate(advice.createdAt, now),
          },
        })
      );
    }
  }

  const createdComments = await Promise.all(commentPromises);
  console.log(`✅ Created ${createdComments.length} comments`);

  // ============================================================================
  // STEP 5: Create Events (1000 total - matches API pagination limit)
  // ============================================================================
  console.log("\n📊 Creating 1000 events for analytics...");
  const eventPromises = [];

  // Generate realistic event data using ACTUAL events from the app
  for (let i = 0; i < 1000; i++) {
    const student = randomItem(students);
    const advice = randomItem(advices);
    const eventName = randomItem(eventNames);

    // Generate a session ID (simulating user sessions)
    const sessionId = `session_${student.id}_${randomInt(1, 20)}`;

    // Event properties vary based on event type (matching actual app tracking)
    let properties = {};

    if (eventName === "comment_created") {
      properties = {
        commentLength: randomInt(10, 200),
        commentId: randomInt(1, 500), // Approximate comment ID
      };
    } else if (eventName === "linkedin_clicked") {
      properties = {
        targetStudentId: advice.studentId,
      };
    } else if (eventName === "category_filtered") {
      properties = {
        category: randomItem(categories),
      };
    }
    // Other events (advice_liked, advice_unliked, resource_clicked, comments_expanded)
    // don't have additional properties in the actual app

    eventPromises.push(
      prisma.event.create({
        data: {
          eventName: eventName,
          properties: properties,
          studentId: student.id,
          adviceId: eventName.includes("advice") ? advice.id : null,
          sessionId: sessionId,
          createdAt: randomDate(sixMonthsAgo, now),
        },
      })
    );
  }

  await Promise.all(eventPromises);
  console.log(`✅ Created 1000 events`);

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Students: ${students.length}`);
  console.log(`   - Advice posts: ${advices.length}`);
  console.log(`   - Likes: ${likes.size}`);
  console.log(`   - Comments: ${createdComments.length}`);
  console.log(`   - Events: 1000`);
  console.log("\n💡 Your database is now ready for data engineering exercises!");
  console.log("📝 Note: Students will add more data as they use the platform.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
