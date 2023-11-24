import express from "express";
import { updateAccount } from "../controllers/account.controller.js";

export const accountRouter = express.Router();

// Update account route
accountRouter.patch("/account", updateAccount);
