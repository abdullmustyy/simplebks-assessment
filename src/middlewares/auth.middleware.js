import { connectMongoDb } from "../../utils/mongodb.js";

// Basic HTTP authentication middleware
export const auth = async (req, res, next) => {
  // If 'Authorization' header not present
  if (!req.get("Authorization")) {
    const err = new Error("Not Authenticated!");
    // Set status code to '401 Unauthorized' and 'WWW-Authenticate' header to 'Basic'
    res.status(401).set("WWW-Authenticate", "Basic");
    next(err);
  }
  // If 'Authorization' header present
  else {
    // Decode the 'Authorization' header Base64 value
    const credentials = Buffer.from(
      req.get("Authorization").split(" ")[1],
      "base64"
    )
      // Convert the buffer to string and split it to get username and password
      .toString()
      .split(":");

    const username = credentials[0];
    const password = +credentials[1];

    // Found seller
    let seller;

    // Connect to MongoDB
    await connectMongoDb(async (database) => {
      const olistSellersDataset = await database.collection(
        "olist_sellers_dataset"
      );
      const data = await olistSellersDataset.findOne({
        seller_id: username,
        seller_zip_code_prefix: password,
      });

      // Assign the seller to the retrirved data
      seller = data;
    });

    // If credentials are not valid
    if (!seller) {
      const err = new Error("Not Authenticated!");
      // Set status code to '401 Unauthorized' and 'WWW-Authenticate' header to 'Basic'
      res.status(401).set("WWW-Authenticate", "Basic");
      next(err);
    }

    res.status(200);
    // Continue the execution
    next();
  }
};
