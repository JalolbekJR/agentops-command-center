import { seedDatabase } from "../src/server/db/seed";

seedDatabase()
  .then(() => {
    console.log("Database seed completed.");
  })
  .catch((error: unknown) => {
    console.error("Database seed failed.");
    console.error(error);
    process.exitCode = 1;
  });
