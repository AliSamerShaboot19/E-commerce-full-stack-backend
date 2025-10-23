import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
export const CreateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name Is Ali" });
      case !description:
        return res.status(500).send({ error: "Name Is description" });
      case !price:
        return res.status(500).send({ error: "Name Is Price" });
      case !category:
        return res.status(500).send({ error: "Name Is category" });
      case !quantity:
        return res.status(500).send({ error: "Name Is quntity" });
      case !shipping:
        return res.status(500).send({ error: "Name Is shipping" });
      case photo && photo.size > 100000:
        return res
          .status(500)
          .send({ error: "Photot is Required and should be less then lMB" });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

export const getAllproductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo") // استبعاد حقل الصورة
      .limit(12) // 12منتج
      .sort({ createAt: -1 }); // من الاحدث للاقدم  1 من الاقدم للاحدث -
    res.status(200).send({
      success: true,
      message: "AllProducts",
      products,
      total: products.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// get single

export const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category"); // يربط بين المنتج والتصنيف الخاص به
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product",
      error,
    });
  }
};


export const ProductPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

// delete

export const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting photo",
      error,
    });
  }
};

// update product

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name Is Required" });
      case !description:
        return res.status(500).send({ error: "Name Is description" });
      case !price:
        return res.status(500).send({ error: "Name Is Price" });
      case !category:
        return res.status(500).send({ error: "Name Is category" });
      case !quantity:
        return res.status(500).send({ error: "Name Is quntity" });
      case !shipping:
        return res.status(500).send({ error: "Name Is shipping" });
      case photo && photo.size > 100000:
        return res
          .status(500)
          .send({ error: "Photot is Required and should be less then lMB" });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.contentType = photo.type;
    }
    console.log(products);

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updating product",
    });
  }
};

export const ProductFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};

    // Handle category filter
    if (checked && checked.length > 0) {
      args.category = { $in: checked };
    }

    // Handle price filter
    if (radio && radio.length === 2) {
      args.price = {
        $gte: radio[0],
        $lte: radio[1],
      };
    }

    console.log("Filter args:", args); // For debugging

    const products = await productModel.find(args);

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Products",
      error: error.message,
    });
  }
};

export const CountProductsController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in getting count of products",
      error,
      success: false,
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perpage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .sort({ createAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in per page ctrl",
      error,
    });
  }
};
