import chalk from "chalk";
import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

// Replace the placeholder with your Atlas connection string
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectMongoDb(operations) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Define database
    const database = client.db("olist");

    // Send a ping to confirm a successful connection
    await database.command({ ping: 1 });

    console.log(
      chalk.whiteBright.bold(
        "Pinged your deployment. You successfully connected to MongoDB!"
      )
    );

    // Run the specified operation
    await operations(database);
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
