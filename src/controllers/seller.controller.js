import { database } from "../utils/mongodb.js";

const getSellerOrderItems = async (req, res) => {
  try {
    // Get optional payload for request query
    const { sort = "shipping_limit_date", limit = 20, offset = 0 } = req.query;
    // Destructure sellerId of the currently logged in seller
    const { sellerId } = req.seller;

    // Get the MongoDB database collection
    const orderItemsDataset = database.collection("olist_order_items_dataset");
    const sellerOrderItems = await orderItemsDataset
      .find({
        seller_id: sellerId,
      })
      .sort({ [sort]: 1 })
      .skip(+offset)
      .limit(+limit)
      .toArray();

    // Send a not found error if sellerOrderItems does not exist
    if (sellerOrderItems.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 404, error: "Seller order items not found." },
      });
    }

    async function getProductCategoryName(productId) {
      const productsDataset = database.collection("olist_products_dataset");

      const product = await productsDataset.findOne({
        product_id: productId,
      });

      if (!product) {
        throw new Error("Product not found.");
      }

      return product.product_category_name;
    }

    const sellerOrderItemsWithCategory = await Promise.all(
      sellerOrderItems.map(async (order) => {
        const productCategory = await getProductCategoryName(order.product_id);

        return {
          id: order.order_item_id,
          product_id: order.product_id,
          product_category: productCategory,
          price: order.price,
          date: order.shipping_limit_date,
        };
      })
    );

    // Send the sellerOrderItems as response
    res.status(200).json({
      success: true,
      message: "Seller order items retrieved successfully.",
      data: sellerOrderItemsWithCategory,
      total: sellerOrderItems.length,
      limit: +limit,
      offset: +offset,
    });
  } catch (error) {
    console.error(error);
  }
};

export { getSellerOrderItems };
