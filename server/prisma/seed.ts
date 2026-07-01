import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { prisma } from "./prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) =>
    path.basename(fileName, path.extname(fileName)),
  );

  // Map camelCase model names to actual Postgres table names (PascalCase, per your schema)
  const tableNames = modelNames.map(
    (name) => name.charAt(0).toUpperCase() + name.slice(1),
  );

  try {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${tableNames.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE;`,
    );
    console.log(`Truncated tables: ${tableNames.join(", ")}`);
  } catch (error) {
    console.error("Error truncating tables:", error);
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  await deleteAllData(orderedFileNames);

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    try {
      for (const data of jsonData) {
        await model.create({ data });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
