import express from "express";
import "dotenv/config";
import chalk from "chalk";
// Database
import { ObjectId } from "mongodb";
import { connectMongoDb } from "./utils/mongodb.js";
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
  res.send("Hello World!");
});

app.get("/seller", async (req, res) => {
  try {
    await connectMongoDb(async (database) => {
      const olistSellersDataset = await database.collection(
        "olist_sellers_dataset"
      );
      const seller = await olistSellersDataset.findOne({
        _id: new ObjectId("655e701f74df0c1bc1447b9e"),
      });

      if (!seller) {
        return res
          .status(404)
          .json({ success: false, message: "Seller not found!" });
      }

      res
        .status(200)
        .json({ success: true, message: "Seller found!", data: seller });
    });
  } catch (error) {
    console.error(error);
  }
});

// Run the server
app.listen(process.env.PORT, () => {
  console.log(
    chalk.blue.underline("Server running on port " + process.env.PORT + "!")
  );
});
