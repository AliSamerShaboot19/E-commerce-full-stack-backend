import express from "express";
import { isAdmin, requireSignUp } from "../middlewares/authMiddleware.js";
import {
  categoryConroller,
  createCategoryController,
  DeleteCategoryController,
  SingleCategoryController,
  updateCategory,
} from "../controller/createCategoryController.js";
const router = express.Router();

router.post(
  "/create-category",
  requireSignUp,
  isAdmin,
  createCategoryController
);
router.put("/update-category/:id", requireSignUp, isAdmin, updateCategory);
router.get("/get-category", categoryConroller);
router.get("/single-category/:id", SingleCategoryController);
router.delete(
  "/delete-category/:id",
  requireSignUp,
  isAdmin,
  DeleteCategoryController
);
export default router;
