import express from "express";
import "dotenv/config";
import chalk from "chalk";
// File imports
import { auth } from "./src/middlewares/auth.middleware.js";
import { sellerRouter } from "./src/routes/seller.route.js";
import { accountRouter } from "./src/routes/account.route.js";

export const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Auth middleware
app.use(auth);

// Routes
app.use(sellerRouter);
app.use(accountRouter);

// Base route
app.get("/", (req, res) => {
  res.send(
    "<a href='https://simplebks.com/' target='_blanck'>Simplebks</a> Job Assessment, hire me :)"
  );
});

// Run the server
app.listen(process.env.PORT, () => {
  console.log(
    chalk.blue.underline("Server running on port " + process.env.PORT + "!")
  );
});
