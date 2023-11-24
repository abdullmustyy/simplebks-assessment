import express from "express";
import "dotenv/config";
import chalk from "chalk";
// File imports
import { auth } from "./src/middlewares/auth.middleware.js";
import { sellerRouter } from "./src/routes/seller.route.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Auth middleware
app.use(auth);

// Routes
app.use(sellerRouter);

// Base route
app.get("/", (req, res) => {
  res.send("Simplebks Job Assessment, please hire me :)");
});

// Run the server
app.listen(process.env.PORT, () => {
  console.log(
    chalk.blue.underline("Server running on port " + process.env.PORT + "!")
  );
});
