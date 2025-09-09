import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../controllers/product.controller";
const router = express.Router();

router.route("/").post(createProduct).get(getProducts);
router.route("/:id").put(updateProduct).delete(deleteProduct).get(getProductById);

export default router;
