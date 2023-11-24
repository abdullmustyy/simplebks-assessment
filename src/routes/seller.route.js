import express from "express";
import {
  getSellerOrderItems,
  deleteOrderItem,
} from "../controllers/seller.controller.js";

export const sellerRouter = express.Router();

// Get seller order items route
sellerRouter.get("/order_items", getSellerOrderItems);

// Delete order item route
sellerRouter.delete("/order_items/:id", deleteOrderItem);
