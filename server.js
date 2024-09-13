const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

process.on("uncaughtException", (err) => {
  console.log("UncaughtException, shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection, shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
