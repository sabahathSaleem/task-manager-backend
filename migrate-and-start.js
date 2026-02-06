const { execSync } = require("child_process");

try {
  console.log("Running Prisma migrations...");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} catch (e) {
  console.error("Migration failed:", e);
}

require("./index");
