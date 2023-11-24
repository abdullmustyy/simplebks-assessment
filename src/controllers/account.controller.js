import { database } from "../utils/mongodb.js";

const updateAccount = async (req, res) => {
  try {
    // Destructure sellerId of the currently logged in seller
    const { sellerId } = req.seller;
    // Destructure update payload from request body
    const { city, state } = req.body;

    // Ensure that a city or state is provided
    if (!city && !state) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          error: "Please provide a city or state to update account.",
        },
      });
    }

    // Get the MongoDB database collection
    const sellersDataset = database.collection("olist_sellers_dataset");

    // Create an empty object to store the fields to be updated
    const updateFields = {};
    if (city) {
      updateFields.seller_city = city;
    }
    if (state) {
      updateFields.seller_state = state;
    }

    // Update the seller with the given seller_id
    const seller = await sellersDataset.findOneAndUpdate(
      { seller_id: sellerId },
      {
        $set: updateFields,
      },
      {
        projection: { _id: 0, seller_city: 1, seller_state: 1 },
        returnDocument: "after",
      }
    );

    // Send a not found error if seller does not exist
    if (!seller) {
      return res.status(404).json({
        success: false,
        error: { code: 404, error: "Seller not found." },
      });
    }

    // Return the updated seller
    return res.status(200).json({ success: true, data: seller });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export { updateAccount };
