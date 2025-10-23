import express from "express";
import { isAdmin, requireSignUp } from "../middlewares/authMiddleware.js";
import {
  CountProductsController,
  CreateProductController,
  deleteProduct,
  getAllproductController,
  getSingleProduct,
  ProductFilterController,
  productListController,
  ProductPhotoController,
  updateProductController,
} from "../controller/ProductsController.js";
import formidable from "express-formidable";
const routerProduct = express.Router();
routerProduct.post(
  "/create-product",
  requireSignUp,
  isAdmin,
  formidable(),
  CreateProductController
);
routerProduct.post(
  "/update-product/:pid",
  requireSignUp,
  isAdmin,
  formidable(),
  updateProductController
);
routerProduct.get("/get-product", getAllproductController);
routerProduct.get("/get-product/:slug", getSingleProduct);
routerProduct.get("/product-photo/:pid", ProductPhotoController);
routerProduct.delete("/delete-product/:pid", deleteProduct);
routerProduct.post("/product-filter", ProductFilterController);
routerProduct.get("/product-count", CountProductsController);
routerProduct.get("/product-list/:page", productListController);

export default routerProduct;
