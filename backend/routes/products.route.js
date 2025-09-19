import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { addProduct, getNearbyProductsByCategory, getProductById, getProductsByStore, getAllProducts, getSimilarProducts } from "../controllers/products.controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add", protect, upload.array("images", 5), addProduct);
router.get("/category", getNearbyProductsByCategory);
router.get("/product-id/:id", getProductById);
router.get("/store/:storeId", getProductsByStore);
router.get("/all-products", getAllProducts);
router.get("/:id/similar", getSimilarProducts);

export default router;
