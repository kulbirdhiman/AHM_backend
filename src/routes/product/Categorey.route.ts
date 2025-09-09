import express from "express";
import {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
} from "../../controllers/Categorey.controller";
const router = express.Router();

router.route("/").post(createCategory).get(getCategories);
router
  .route("/:id")
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
