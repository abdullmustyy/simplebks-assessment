import express from "express";
import { getSellerOrderItems } from "../controllers/seller.controller.js";

export const sellerRouter = express.Router();

sellerRouter.get("/order_items", getSellerOrderItems);
