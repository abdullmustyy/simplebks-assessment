import { database } from "../utils/mongodb.js";

const getSellerOrderItems = async (req, res) => {
  try {
    // Get optional payload for request query
    const { sort = "shipping_limit_date", limit = 20, offset = 0 } = req.query;
    // Destructure sellerId of the currently logged in seller
    const { sellerId } = req.seller;

    // Limit should not be greater than 100
    if (+limit > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          error: "Limit should not be greater than 100.",
        },
      });
    }

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
        error: {
          code: 404,
          error: "The currently logged in user has no order item.",
        },
      });
    }

    // Get product category name with product_id
    async function getProductCategoryName(productId) {
      // Get the MongoDB database collection
      const productsDataset = database.collection("olist_products_dataset");
      // Get the product with the given product_id
      const product = await productsDataset.findOne({
        product_id: productId,
      });

      // Send a not found error if product does not exist
      if (!product) {
        throw new Error("Product not found.");
      }

      // Return the product category name
      return product.product_category_name;
    }

    // Get product category name with product_id
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
    res.status(500).json({
      success: false,
      error: { code: 500, error: "Internal server error." || error.message },
    });
  }
};

const deleteOrderItem = async (req, res) => {
  try {
    // Destructure id from request params
    const { id } = req.params;
    // Get the MongoDB database collection
    const orderItemsDataset = database.collection("olist_order_items_dataset");

    // Delete the order item with the given id
    const deletedOrderItem = await orderItemsDataset.deleteOne({
      order_item_id: +id,
    });

    // Send a not found error if deletedOrderItem does not exist
    if (deletedOrderItem.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 404, error: "Order item not found." },
      });
    }

    // Send a success response if deletedOrderItem exists
    res.status(200).json({
      success: true,
      message: "Order item deleted successfully.",
      data: deletedOrderItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: { code: 500, error: "Internal server error." || error.message },
    });
  }
};

export { getSellerOrderItems, deleteOrderItem };
