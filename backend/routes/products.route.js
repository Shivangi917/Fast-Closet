import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { addProduct, getProducts, getTrendingProducts } from "../controllers/products.controller.js";
import multer from "multer";

const router = express.Router();

// Multer setup for temporary storage of files before uploading to cloud
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add", protect, upload.array("images", 5), addProduct); // max 5 images
router.get("/get", getProducts);
router.get('/trending', getTrendingProducts);

export default router;
