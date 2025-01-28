import express from "express";
import { getProducts, searchProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts); //obtain products
router.get("/search", searchProduct); //search products in OpenFoodFacts

export default router;