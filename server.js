const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

process.on("uncaughtException", (err) => {
  console.log("UncaughtException, shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection, shutting down...");
  server.close(() => {
    process.exit(1);
  });
});