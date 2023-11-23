import express from "express";
import "dotenv/config";
import chalk from "chalk";
// File imports
import { auth } from "./src/middlewares/auth.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Auth middleware
app.use(auth);

// Endpoints
app.get("/", (req, res) => {
  res.send("Protected route with Basic HTTP Authentication!");
});

// Run the server
app.listen(process.env.PORT, () => {
  console.log(
    chalk.blue.underline("Server running on port " + process.env.PORT + "!")
  );
});
