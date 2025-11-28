import { Request, Response } from "express";
import slugify from "slugify";
import Product from "../models/Product";
import Category from "../models/Category";
import { Op } from "sequelize";

// ✅ Create a new product
const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      sku,
      images,
      seoTitle,
      seoDescription,
      seoKeywords,
      specifications,
      addons,
      categoryId,
    } = req.body;

    console.log("📥 Incoming Body:", req.body);

    // -------------------------
    // ✅ Validate name
    // -------------------------
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({ message: "Product name is required and must be a string" });
    }

    // -------------------------
    // ✅ Create slug safely
    // -------------------------
    const slug = slugify(name, { lower: true, strict: true });

    // -------------------------
    // ❗ Check for slug duplicate
    // -------------------------
    const existing = await Product.findOne({ where: { slug } });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Product with similar name already exists" });
    }

    // -------------------------
    // ✅ Create product
    // -------------------------
    const product = await Product.create({
      name,
      slug,
      description,
      price,
      discountPrice,
      stock,
      sku,
      images,
      seoTitle,
      seoDescription,
      seoKeywords,
      specifications,
      addons,
      categoryId,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("❌ Backend error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Get all products
const getProducts = async (req: Request, res: Response) => {
  try {
    // query params: page, limit, search
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const offset = (page - 1) * limit;

    // Build where condition
    const where: any = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows: products, count } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: "category" }],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: products,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("❌ getProducts error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get single product by id
const getProductById = async (req: Request, res: Response) => {
  try {
    console.log(req.params)
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: "category" }],
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update product
const updateProduct = async (req: Request, res: Response) => {
  // console.log("update api call" ,req.params , req.body)
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      sku,
      images,
      seoTitle,
      seoDescription,
      seoKeywords,
      specifications,
      addons,
      categoryId,
    } = req.body;

    let slug = product.slug;
    if (name && name !== product.name) {
      slug = slugify(name, { lower: true, strict: true });
    }

    await product.update({
      name,
      slug,
      description,
      price,
      discountPrice,
      stock,
      sku,
      images,
      seoTitle,
      seoDescription,
      seoKeywords,
      specifications,
      addons,
      categoryId,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete product
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
};
